const carCanvas = document.getElementById("carCanvas");
const carCtx = carCanvas.getContext("2d");
const networkCanvas = document.getElementById("networkCanvas");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, laneCount = 3);
const N = 100;
const cars = generateCars(N);
let traffic = [];
let y = -300;
for (let i = 0; i < 10; i++) {
    lane = Math.floor(Math.random() * 3);
    traffic.push(new Car(road.getLaneCenter(lane), y, 30, 50, "DUMMY", maxspeed = 2, color=getRandomColor()))
    y -= 200;
}

for (let i = 0; i < 10; i++) {
    let lane1 = Math.floor(Math.random() * 3);
    let lane2 = Math.floor(Math.random() * 3);
    
    traffic.push(new Car(road.getLaneCenter(lane1), y, 30, 50, "DUMMY", maxspeed = 2, color=getRandomColor()))
    traffic.push(new Car(road.getLaneCenter(lane2), y, 30, 50, "DUMMY", maxspeed = 2, color=getRandomColor()))
    y -= 200;
}
let bestCar = cars[0];
const bestBrain = localStorage.getItem("bestBrain");
if (bestBrain) {
    console.log("best Brain Found in Local Storage")
    for (let i = 0; i < cars.length; i++){
        cars[i].brain = JSON.parse(bestBrain);
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}
else{
    console.log("Default best Brains loaded")
    const bestBrain =  JSON.stringify(bestBrainData);
    const bestBrain2 = JSON.stringify(bestBrainData2);
    for (let i = 0; i < cars.length / 2; i++){
        cars[i].brain = JSON.parse(bestBrain);
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
    for (let i = cars.length / 2; i < cars.length; i++){
        cars[i].brain = JSON.parse(bestBrain2);
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
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

function generateCars(N) {
    const cars = [];
    for (let i = 0; i < N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    for (let c = 0; c < traffic.length;c++) {
        traffic[c].update(road.borders);
    }
    for (let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }
    bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y))
    );
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
   
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

    road.draw(carCtx);
    for (let c = 0; c < traffic.length;c++) {
        traffic[c].draw(carCtx);
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue",true);
    carCtx.restore();
    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain)

    requestAnimationFrame(animate);
}