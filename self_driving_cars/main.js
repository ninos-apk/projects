const canvas = document.getElementById("myCanvas");
canvas.width = 250;
const ctx = canvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width * 0.9, laneCount=3);
const car = new Car(road.getLaneCenter(1), 350, 30, 50, "KEYS", 5);
let traffic = [];
for (let i = 0; i < 100; i++){
     traffic.push(new Car(road.getLaneCenter(1), -100, 30, 50, "AI",2))
    
}

animate();

function animate() {
    for (let c = 0; c < traffic.length;c++) {
        traffic[c].update(road.borders);
    }
    car.update(road.borders, traffic);
    canvas.height = window.innerHeight;
    ctx.save();
   
    ctx.translate(0, -car.y + canvas.height * 0.7);

    road.draw(ctx);
    for (let c = 0; c < traffic.length;c++) {
        traffic[c].draw(ctx, "orange");
    }
    car.draw(ctx, "blue");

    ctx.restore();
    requestAnimationFrame(animate);
}