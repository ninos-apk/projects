const back_button = document.getElementById("back-button");
back_button.addEventListener("click", function () {
    window.location.href = "../../index.html?backFromProjects=true";
})

const carCanvas = document.getElementById("carCanvas");
carCanvas.width = window.innerWidth - 300;
const carCtx = carCanvas.getContext("2d");
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;
const miniMapCanvas = document.getElementById("miniMapCanvas");
miniMapCanvas.width = 300;
miniMapCanvas.height = 200;
const networkCtx = networkCanvas.getContext("2d");
const isMobile = window.matchMedia("(max-width: 600px)").matches;
networkCanvas.height = window.innerHeight - 400;
if (isMobile) {
    networkCanvas.width = 200;
    miniMapCanvas.width = networkCanvas.width;
    networkCanvas.height = window.innerHeight - 400;
    miniMapCanvas.height = window.innerHeight - networkCanvas.height - 200;
    carCanvas.width = window.innerWidth - networkCanvas.width;
}
carCanvas.height = window.innerHeight;

const graph = world.graph;

const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const miniMap = new MiniMap(miniMapCanvas, world.graph);

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
const traffic = [];
const roadBorders =  world.roadBorders.map((s)=>[s.p1,s.p2]);
world.cars = cars;
animate();

function save() {
    jsonData = JSON.stringify(bestCar.brain);
    localStorage.setItem("bestBrain", jsonData);
}
function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const startPoints = world.markings.filter((m)=> m instanceof Start);
    const startPoint = startPoints.length>0?startPoints[0].center:new Point(100,100);
    const dir = startPoints.length>0?startPoints[0].directionVector:new Point(0,-1);
    const cars = [];
    const startAngle = - angle(dir) + Math.PI /2;
    for (let i = 0; i < N; i++){
        cars.push(new Car(startPoint.x, startPoint.y, 30, 50, "AI", startAngle));
    }
    return cars;
}

function animate(time) {
    for (let c = 0; c < traffic.length;c++) {
        traffic[c].update(roadBorders);
    }
    for (let i = 0; i < cars.length; i++){
        cars[i].update(roadBorders, traffic);
    }
    bestCar = cars.find(
        c => c.fittness == Math.max(...cars.map(c => c.fittness))
    );
    world.bestCar = bestCar;
    viewport.offset.x = -bestCar.x;
    viewport.offset.y = -bestCar.y;
    viewport.reset();
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(carCtx, viewPoint, false);
    miniMap.update(viewPoint);
    for (let c = 0; c < traffic.length;c++) {
        traffic[c].draw(carCtx);
    }

    networkCtx.lineDashOffset = -time/50;
    networkCtx.clearRect(0,0,networkCanvas.width,networkCanvas.height);
    Visualizer.drawNetwork(networkCtx, bestCar.brain)

    requestAnimationFrame(animate);
}