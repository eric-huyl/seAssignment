const { invoke } = window.__TAURI__.tauri;
let POINTS = Array();
let ROUTE = Array();
let COPTERSTATUS;

function putWaypoints() {
  sendMessage("put", "waypoint", POINTS);
}

function clearWaypoints() {
  POINTS = [];
  clearMapPoints();
  refreshMarkerView();
}

function drawRoute(path) {
  console.log("Called drawRoute");
  var routeGraph = new AMap.Polyline({
    path: path,
    strockWeigtht: 2,
    strokeColor: "red",
    lineJoin: "round",
  });
  mainMap.add(routeGraph);
}

function copterFlight() {
  sendMessage("copter_control", "start_resume");
}

function copterHover() {
  sendMessage("copter_control", "hover");
}

function copterRestore() {
  sendMessage("copter_control", "restore");
}


function getStatus() {
  sendMessage("get", "copter");
}

function putWaypoint() {
  sendMessage("put", "waypoint");
}

function refreshMarkerView() {
  var pointList = document.createElement("ul");
  POINTS.forEach((point) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${point.id} ${point.lng}  ${point.lat} ${point.x}, ${point.y}`;
    pointList.appendChild(listItem);
  });
  document.getElementById("point_view").innerHTML = "";
  document.getElementById("point_view").appendChild(pointList);
}

function refreshCopterView() {
  getStatus();
  drawCopterMarker(COPTERSTATUS);
}

