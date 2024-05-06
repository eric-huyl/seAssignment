#!/usr/bin/env python

# 引入必要的库
import asyncio
import websockets
import json
import simucopter as sc
import pathfinder
from utils import consoleLog


WAYPOINTS = []
ROUTE = []
myCopter = sc.Copter([108.833538, 34.123186], [315, 215])


class Message:
    def __init__(self) -> None:
        self.type = 'unknown'
        self.content = None
        self.data = None

    def __str__(self) -> str:
        return f'Type: {self.type}, Content: {self.content}, Data: {self.data}'

    def encode(self):
        return json.dumps(self, cls=MessageEncoder)

    def quickAck(self, type, msg) -> None:
        self.type = type
        self.content = msg.content


class MessageEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Message):
            return o.__dict__
        return super().default(o)


def decodeJSON(json_data) -> Message:
    data = json.loads(json_data)
    msg = Message()
    msg.type = data['type']
    msg.content = data['content']
    msg.data = data['data']
    return msg


def messageHandler(message) -> str:
    global WAYPOINTS
    global ROUTE
    waypoints = []
    route = []
    resObject = Message()
    msgObject = decodeJSON(message)
    if msgObject.type == 'copter_control':
        if msgObject.content == 'start_resume':
            sc.flight(myCopter)
        elif msgObject.content == 'hover':
            sc.hover(myCopter)
        elif msgObject.content == 'restore':
            sc.restore(myCopter)
        else:
            consoleLog('Unknown control command', 'fail')
        resObject.quickAck('ack', msgObject)
    elif msgObject.type == 'get':
        resObject.type = 'ack_get'
        if msgObject.content == 'route':
            resObject.content = 'route'
            resObject.data = ROUTE
        elif msgObject.content == 'copter':
            resObject.content = 'copter'
            resObject.data = myCopter.status()
        else:
            consoleLog('Unknown get command', 'fail')
            resObject.quickAck('err', msgObject)
    elif msgObject.type == 'put':
        if msgObject.content == 'waypoint':
            waypoints = msgObject.data
            ROUTE = pathfinder.find(waypoints)
            resObject.type = 'ack_get'
            resObject.content = 'route'
            resObject.data = ROUTE
        else:
            consoleLog('Unknown put command', 'fail')
            resObject.quickAck('ack', msgObject)
    else:
        consoleLog('Unknown message type', 'fail')
        resObject.quickAck('err', msgObject)

    WAYPOINTS = waypoints
    route = []
    for point in ROUTE:
        route.append([point['x'], point['y']])
    sc.loadRoute(myCopter, route)
    resObjectJSON = resObject.encode()
    return resObjectJSON


async def receiver(websocket, path):
    async for message in websocket:
        consoleLog(f'Receive: {message}', 'log')
        response = messageHandler(message)
        consoleLog(f'Send: {response}', 'success')
        await websocket.send(response)


async def main():
    async with websockets.serve(receiver, "localhost", 8765):
        await asyncio.Future()

if __name__ == '__main__':
    asyncio.run(main())
