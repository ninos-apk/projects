const drawItemFunctions = [];
drawItemFunctions[1] = drawStar;
drawItemFunctions[2] = drawBall;
drawItemFunctions[3] = drawSock;
drawItemFunctions[4] = drawCane;
drawItemFunctions[5] = drawBow;
function buildCalendar(div) {
    const cellSize = 150;
    for (let day = 1; day < 25; day++) {
        const canvas = document.createElement("canvas");
        if(getFlip(day))canvas.classList.add("flip");
        canvas.addEventListener("click", () => {
            const currentDate = Date.now();
            const clickedDate = new Date(currentDate);
            clickedDate.setDate(day);
            if(currentDate >= clickedDate.getTime()) {
                canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
                canvas.classList.toggle("flip");
                setFlip(day,canvas.classList.contains("flip"));
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
    if(stored(index) && getFlip(index)){
        drawFunction(ctx, x, y, itemSize, hue);
        return;
    }
    if (drawFunction && getFlip(index)) {
        drawFunction(ctx, x, y, itemSize, hue);
        store(index);
    }else{
        drawNumber(ctx, index, x, y, itemSize);
        remove(index);
        setFlip(index,false);
    }
}

function drawNumber(ctx, number, x, y, itemSize) {
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${itemSize}px Arial`;
    ctx.fillText(number, x, y);
}

function store(index){
    if(!localStorage.getItem('numberSet')){
        localStorage.setItem('numberSet', JSON.stringify([]));
    }
    let storedSet = JSON.parse(localStorage.getItem('numberSet') || '[]');
    if (!storedSet.includes(index)) {
        storedSet.push(index);
        localStorage.setItem('numberSet', JSON.stringify(storedSet));
    }
}
function stored(index){
    let storedSet = JSON.parse(localStorage.getItem('numberSet') || '[]');
    return storedSet.includes(index);
}

function remove(index){
    if(!localStorage.getItem('numberSet')){
        return;
    }
    let storedSet = JSON.parse(localStorage.getItem('numberSet') || '[]');
    storedSet = storedSet.filter(num => num !== index);
    localStorage.setItem('numberSet', JSON.stringify(storedSet));
}
function setFlip(index, flip){
    if(!localStorage.getItem('flipTable')){
        localStorage.setItem('flipTable', JSON.stringify({}));
    }
    let flipTable = JSON.parse(localStorage.getItem('flipTable') || '{}');
    flipTable[index] = flip;
    localStorage.setItem('flipTable', JSON.stringify(flipTable));
}
function getFlip(index){
    if(localStorage.getItem('flipTable')){
        let flipTable = JSON.parse(localStorage.getItem('flipTable') || '{}');
        if(flipTable[index])return true;
        else return false;
    }
    return false;
}