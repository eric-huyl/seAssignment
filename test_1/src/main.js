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
  pointList.classList.add('ul_class');
  POINTS.forEach((point) => {
    const listItem = document.createElement("li");
    const li_one = document.createElement("span");
    const li_two = document.createElement("span");
    listItem.textContent = ` point ${Math.round(point.id)}:   `;
    li_one.textContent =`(${Math.round(point.lng*1000)/1000} E,   ${Math.round(point.lat*1000)/1000} N )`;
    li_two.textContent = ` (${Math.round(point.x)} px,  ${Math.round(point.y)} px)`;
    listItem.classList.add('list_new');
    li_one.classList.add('list_new2');
    li_two.classList.add('list_new3');
    listItem.appendChild(li_one);
    listItem.appendChild(li_two);
    pointList.appendChild(listItem);
  });
  document.getElementById("point_view").innerHTML = "";
  document.getElementById("point_view").appendChild(pointList);
}

function refreshCopterView() {
  getStatus();
  drawCopterMarker(COPTERSTATUS);
}

