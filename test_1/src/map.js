let mainMap;
let contextMenu = new AMap.ContextMenu();
let markerContextMenu = new AMap.ContextMenu();
let clickPosition;
let clickTarget;
let markerId = 0;
let copterMarker;
let start;
let end;
let driving;
let waypoints = new Array();

class Point {
  constructor(id, lng, lat, x, y) {
    this.id = id;
    this.lng = lng;
    this.lat = lat;
    this.x = x;
    this.y = y;
  }

  print_self() {
    return `${this.id}_${this.lng}_${this.lat}`;
  }
}

function createMap() {
  mainMap = new AMap.Map("map", {
    mapStyle: "amap://styles/whitesmoke",
    center: [108.833538, 34.123186],
    viewMode: "2D",
    zoom: 15,
  });
  var layer1 = new AMap.TileLayer.Satellite();
  mainMap.add(layer1);
  AMap.plugin("AMap.ToolBar", function () {
    var toolbar = new AMap.ToolBar({
      position: {
        top: "110px",
        right: "40px",
      },
    });
    mainMap.addControl(toolbar);
  });

  AMap.plugin("AMap.Driving", function () {
    driving = new AMap.Driving({
      policy: 0, //驾车路线规划策略，0是速度优先的策略
      map: mainMap,
      panel: "panel",
    });
  });

  mainMap.on("rightclick", function (ev) {
    contextMenu.open(mainMap, ev.lnglat);
    clickPosition = ev.lnglat;
    clickTarget = ev.target;
  });

  contextMenu.addItem("Add waypoint", addSinglePoint, 0);
  markerContextMenu.addItem("Remove waypoint", removeSinglePoint, 0);
  markerContextMenu.addItem("Set as start point", setStart, 1);
  markerContextMenu.addItem("Set as destination", setDestination, 2);
  markerContextMenu.addItem("Set as waypoint", setWaypoint, 3);
}

function searchRoute() {
  var opts = {
    waypoints: waypoints,
  };
  driving.search(start, end, opts, function (status, result) {
    if (status == "complete") {
      console.log("search complete");
    } else {
      console.log("search failed" + result);
    }
  });
}

function setStart() {
  start = [clickPosition.lng, clickPosition.lat];
  console.log(start);
}

function setDestination() {
  end = [clickPosition.lng, clickPosition.lat];
  console.log(end);
}

function setWaypoint() {
  waypoints.push([clickPosition.lng, clickPosition.lat]);
}

function addSinglePoint() {
  markerId = markerId + 1;
  var newMarker = new AMap.Marker({
    map: mainMap,
    position: clickPosition,
    title: "TestMarker",
    extData: {
      id: markerId,
    },
  });
  newMarker.on("rightclick", function (ev) {
    markerContextMenu.open(mainMap, ev.lnglat);
    clickPosition = ev.lnglat;
    clickTarget = ev.target;
  });
  pixelPos = mainMap.lngLatToContainer(clickPosition);
  newPoint = new Point(
    markerId,
    clickPosition.lng,
    clickPosition.lat,
    pixelPos.x,
    pixelPos.y
  );
  POINTS.push(newPoint);
  refreshMarkerView();
}

function removeSinglePoint() {
  targetId = clickTarget._opts.extData.id;
  POINTS = POINTS.filter((elem) => elem.id !== targetId);
  mainMap.remove(clickTarget);
  refreshMarkerView();
}

function clearMapPoints() {
  var currentPoints = mainMap.getAllOverlays("marker");
  mainMap.remove(currentPoints);
}

function drawRoute() {
  path = Array();
  ROUTE.forEach(function (elem) {
    path.push([elem.lng, elem.lat]);
  });
  var routeGraph = new AMap.Polyline({
    path: path,
    strockWeigtht: 2,
    strokeColor: "red",
    lineJoin: "round",
  });
  mainMap.add(routeGraph);
}

function drawCopterMarker(copterStatus) {
  position = mainMap.containerToLngLat(
    new AMap.Pixel(copterStatus[0], copterStatus[1])
  );
  copterMarker = new AMap.Marker({
    map: mainMap,
    position: position,
    title: "myCopter",
  });
}
