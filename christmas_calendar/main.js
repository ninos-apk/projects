const drawItemFunctions = [];
drawItemFunctions[1] = drawStar;
drawItemFunctions[2] = drawBall;
function buildCalendar(div) {
    const cellSize = 150;
    for (let day = 1; day < 25; day++) {
        const canvas = document.createElement("canvas");
        canvas.addEventListener("click", () => {
            const currentDate = Date.now();
            const clickedDate = new Date(currentDate);
            clickedDate.setDate(day);
            if(currentDate >= clickedDate.getTime()) {
                canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
                canvas.classList.toggle("flip");
            }
            else{
                const message = "The day has not come yet! Please be patient and wait until it's time to open the door";
                alert(message);
            }
        });
        canvas.addEventListener("transitionend", () => {
            fillCell(day, canvas);
        });
        canvas.width = cellSize;
        canvas.height = cellSize;
        div.appendChild(canvas);
        fillCell(day, canvas);
    }
}

function fillCell(index, canvas) {
    const ctx = canvas.getContext("2d");
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const itemSize = canvas.width * 0.6;
    const drawFunction = drawItemFunctions[index];
    const hue = Math.random() * 360;
    if (drawFunction && canvas.classList.contains("flip")) {
        drawFunction(ctx, x, y, itemSize, hue);
    }else{
        drawNumber(ctx, index, x, y, itemSize);
    }
}

function drawNumber(ctx, number, x, y, itemSize) {
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${itemSize}px Arial`;
    ctx.fillText(number, x, y);
}
