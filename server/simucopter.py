import math
import threading
import time
import utils
V = 5
REFRESHRATE = 10


class Copter:

    def __init__(self, lnglat, xy) -> None:
        self.start = lnglat, xy
        self.xy = xy
        self.route = []
        self.trace = []
        self.currentTarget = None
        self.mode = 'hover'

    def __str__(self) -> str:
        return f"pos: {self.xy} Towards: {self.currentTarget} \
            Mode: {self.mode}"

    def status(self):
        return [self.xy[0], self.xy[1], self.mode]


def flight(copter: Copter):
    copter.mode = 'flight'
    flight_thread = threading.Thread(target=flightSimu, args=(copter,))
    flight_thread.start()
    flight_thread.join()
    copter.mode = 'hover'
    utils.consoleLog("Flight is over", 'success')

def loadRoute(copter: Copter, route):
    copter.route = route


def hover(copter: Copter):
    copter.mode = "hover"
    return "Mode switched to HOVER"


def restore(copter: Copter):
    copter.xy = copter.start[1]
    copter.route = []
    copter.trace = []
    copter.currentTarget = None
    copter.mode = 'hover'
    return "Copter restored"


def distance(pointA, pointB):
    return math.sqrt(abs(pointA[0]-pointB[0])**2 + abs(pointA[1]-pointB[1])**2)


def atPosition(pointA, pointB):
    if distance(pointA, pointB) < 0.01:
        return True
    else:
        return False


def computeDirection(xy: list, target: list):
    global V
    global REFRESHRATE
    v_simu = V / REFRESHRATE
    if not v_simu > math.sqrt(abs(target[0]-xy[0])**2
                              + abs(target[1]-xy[1])**2):
        v_x = (target[0]-xy[0]) * v_simu / \
            math.sqrt(abs(target[0]-xy[0])**2 + abs(target[1]-xy[1])**2)
        v_y = (target[1]-xy[1]) * v_simu / \
            math.sqrt(abs(target[0]-xy[0])**2 + abs(target[1]-xy[1])**2)
    else:
        v_x = target[0]-xy[0]
        v_y = target[1]-xy[1]
    return v_x, v_y


def flightSimu(copter: Copter):
    global REFRESHRATE
    while copter.mode == 'flight':
        if atPosition(copter.xy, copter.route[2]):
            print("Copter reached destination")
            return
        copter.currentTarget = [220, 320]
        if atPosition(copter.xy, copter.currentTarget):
            copter.trace.append(copter.currentTarget)
            print("Copter reached: " + str(copter.currentTarget))
            continue
        v_x, v_y = computeDirection(copter.xy, copter.currentTarget)
        copter.xy[0] += v_x
        copter.xy[1] += v_y
        time.sleep(0.1)
