const back_button = document.getElementById("back-button");
back_button.addEventListener("click", function () {
    window.location.href = "../index.html?backFromProjects=true";
});

const carCanvas = document.getElementById("carCanvas");
const carCtx = carCanvas.getContext("2d");
const networkCanvas = document.getElementById("networkCanvas");
const networkCtx = networkCanvas.getContext("2d");
const miniMapCanvas = document.getElementById("miniMapCanvas");

let screenSize = 'desktop';

if (window.matchMedia("(max-width: 768px)").matches) {
    screenSize = 'phone';
}
if (window.matchMedia("(max-width: 1024px)").matches) {
    screenSize = 'ipad'
}

function setCanvasSize() {
    if (screenSize === 'phone') {
        carCanvas.width = window.innerWidth;
        networkCanvas.width = window.innerWidth * 0.5;
        miniMapCanvas.width = window.innerWidth * 0.4;

        carCanvas.height = window.innerHeight * 0.7;
        networkCanvas.height = window.innerHeight * 0.3;
        miniMapCanvas.height = window.innerHeight * 0.2;
        return;
    }
    carCanvas.width = window.innerWidth * 0.8;
    networkCanvas.width = window.innerWidth * 0.2;
    miniMapCanvas.width = window.innerWidth * 0.2;

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight * 0.6;
    miniMapCanvas.height = window.innerHeight * 0.3;
}

setCanvasSize();

window.addEventListener("resize", function () {
    setCanvasSize();
});

const worldString = localStorage.getItem("world");
if (worldString) {
    worldInfo = JSON.parse(worldString);
    // if there is a graph and the world contains at least one start(car)
    if (worldInfo.graph.points.length > 0 && worldInfo.markings.filter((m) => m.type === "start").length > 0) {
        world = World.load(worldInfo);
        console.log("world loaded");
    } else {
        console.log("default world loaded");
    }
} else {
    console.log("default world loaded");
}

const graph = world.graph;
const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const miniMap = new MiniMap(miniMapCanvas, world.graph);

const N = 10;
const cars = generateCars(N);
let bestCar = cars[0];
const traffic = [];
const roadBorders = world.roadBorders.map((s) => [s.p1, s.p2]);
world.cars = cars;
let tracking = true;
animate();

function save() {
    jsonData = JSON.stringify(bestCar.brain);
    localStorage.setItem("bestBrain", jsonData);
}
function discard() {
    localStorage.removeItem("bestBrain");
}

function reload() {
    window.location.reload();
}

function toggleTracking() {
    tracking = !tracking;
    const button = document.getElementById("tracking");
    if (tracking) {
        button.style.backgroundColor = "#a8dff5";
    } else {
        button.style.backgroundColor = "red";
    }
}

function generateCars(N) {
    const startPoints = world.markings.filter((m) => m instanceof Start);
    const startPoint = startPoints.length > 0 ? startPoints[0].center : new Point(100, 100);
    const dir = startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);
    const cars = [];
    const startAngle = - angle(dir) + Math.PI / 2;
    for (let i = 0; i < N; i++) {
        cars.push(new Car(startPoint.x, startPoint.y, 30, 50, "AI", startAngle));
    }
    return cars;
}

function animate(time) {
    for (let c = 0; c < traffic.length; c++) {
        traffic[c].update(roadBorders);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(roadBorders, traffic);
    }
    bestCar = cars.find(
        c => c.fittness == Math.max(...cars.map(c => c.fittness))
    );
    world.bestCar = bestCar;
    if(tracking){
        viewport.offset.x = -bestCar.x;
        viewport.offset.y = -bestCar.y;
    }
    viewport.reset();
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(carCtx, viewPoint, false);
    miniMap.update(viewPoint);
    for (let c = 0; c < traffic.length; c++) {
        traffic[c].draw(carCtx);
    }

    networkCtx.lineDashOffset = -time / 50;
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    Visualizer.drawNetwork(networkCtx, bestCar.brain)

    requestAnimationFrame(animate);
}
