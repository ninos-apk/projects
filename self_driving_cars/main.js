const back_button = document.getElementById("back-button");
back_button.addEventListener("click", function () {
    window.location.href = "../index.html?backFromProjects=true";
})

const carCanvas = document.getElementById("carCanvas");
const carCtx = carCanvas.getContext("2d");
const networkCanvas = document.getElementById("networkCanvas");
const networkCtx = networkCanvas.getContext("2d");

let screenSize = 'desktop';

if (window.matchMedia("(max-width: 768px)").matches) {
    screenSize = 'phone';
}
if (window.matchMedia("(max-width: 1024px)").matches) {
    screenSize = 'ipad'
}

function setCanvasSize(screen) {
    if (screen === 'phone') {
        carCanvas.width = window.innerWidth * 0.5;
        carCanvas.height = window.innerHeight;
        networkCanvas.width = window.innerWidth * 0.5;
        networkCanvas.height = window.innerHeight * 0.5;
        return;
    }
    if (screen === 'ipad') {

        carCanvas.width = window.innerWidth * 0.4;
        carCanvas.height = window.innerHeight;
        networkCanvas.width = window.innerWidth * 0.4;
        networkCanvas.height = window.innerHeight * 0.5;

        return;
    }
    carCanvas.width = window.innerWidth * 0.3;
    carCanvas.height = window.innerHeight;
    networkCanvas.width = window.innerWidth * 0.2;
    networkCanvas.height = window.innerHeight * 0.5;
}

setCanvasSize(screenSize);

let road = new Road(carCanvas.width / 2, carCanvas.width * 0.95, laneCount = 3);

window.addEventListener('resize', function () {
    setCanvasSize(screenSize);
    road = new Road(carCanvas.width / 2, carCanvas.width * 0.95, laneCount = 3);
    animate();
});

const N = parseInt(localStorage.getItem("generatedCars"));

if (N > 0) {
    carsNumber.value = N;
}
else {
    carsNumber.value = 1;
}

const cars = N > 0 ? generateCars(N) : generateCars(1);

let traffic = [];
let y = -300;
for (let i = 0; i < 10; i++) {
    lane = Math.floor(Math.random() * 3);
    traffic.push(new Car(road.getLaneCenter(lane), y, 30, 50, "DUMMY", maxspeed = 2, color = getRandomColor()))
    y -= 200;
}

for (let i = 0; i < 10; i++) {
    let lane1 = Math.floor(Math.random() * 3);
    let lane2 = Math.floor(Math.random() * 3);

    traffic.push(new Car(road.getLaneCenter(lane1), y, 30, 50, "DUMMY", maxspeed = 2, color = getRandomColor()))
    traffic.push(new Car(road.getLaneCenter(lane2), y, 30, 50, "DUMMY", maxspeed = 2, color = getRandomColor()))
    y -= 200;
}
let bestCar = cars[0];
let bestBrain = localStorage.getItem("bestBrain");

for (let i = 0; i < cars.length; i++) {
    if (bestBrain) {
        console.log("best Brain Found in Local Storage")
        cars[i].brain = JSON.parse(bestBrain);
    } else {
        console.log("Default best Brains loaded")
        cars[i].brain = JSON.parse(JSON.stringify(bestBrainData)); // Copy bestBrainData Object to mutate it for each car
    }
    if (i != 0) {
        NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
}

animate();

function save() {
    jsonData = JSON.stringify(bestCar.brain);
    localStorage.setItem("bestBrain", jsonData);
}
function discard() {
    localStorage.removeItem("bestBrain");
}
function reload() {
    let val = carsNumber.value;
    if (isNaN(val)) {
        val = 1;
    }
    if (val > 999) {
        val = 999;
    }
    localStorage.setItem("generatedCars", val);
    window.location.reload();
}

function generateCars(n) {
    const cars = [];
    for (let i = 0; i < n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    for (let c = 0; c < traffic.length; c++) {
        traffic[c].update(road.borders);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y))
    );
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    carCtx.save();

    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for (let c = 0; c < traffic.length; c++) {
        traffic[c].draw(carCtx);
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);
    carCtx.restore();
    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain)

    requestAnimationFrame(animate);
}