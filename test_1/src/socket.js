let mainWs;

function messageHandler(message) {
  msgObject = JSON.parse(message);
  if (msgObject.type == "ack_get") {
    if (msgObject.content == "route") {
      ROUTE = msgObject.data;
    } else if (msgObject.content == "copter") {
      COPTERSTATUS = msgObject.data;
    } else {
      return
    }
  } else {
    return
  }
}

function setupSocket() {
  mainWs = new WebSocket("ws://localhost:8765");
  mainWs.onopen = function () {
    console.log("Connected");
    sendMessage('put', 's', ['12', '34'])
  };

  mainWs.onmessage = function (ev) {
    message = ev.data;
    console.log("Received: ".concat(message));
    messageHandler(message);
  };

  mainWs.onclose = function () {
    console.log("Connection closed");
    setTimeout(function () {
      setupSocket();
    }, 2000);
  };
}

function sendMessage(type, content = null, data = null) {
  var messageObj = {
    type: type,
    content: content,
    data: data,
  };
  message = JSON.stringify(messageObj)
  mainWs.send(message);
}

setupSocket();
