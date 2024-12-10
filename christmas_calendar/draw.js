const draw = {};
draw.circle = (ctx, x, y, radius, options) =>{
    ctx.beginPath();
    if(options.outline == "inside"){
        radius -= options.lineWidth / 2;
    }
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    Object.assign(ctx, options);
    options.fillStyle && ctx.fill();
    options.strokeStyle && ctx.stroke();
}

draw.line = (ctx, fromX, fromY, toX, toY, options) =>{
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    Object.assign(ctx, options);
    ctx.stroke();
}

const color = {};
color.normal = (hue) => `hsl(${hue}, 100%, 50%)`;
color.dark = (hue) => `hsl(${hue}, 100%, 25%)`;
color.darkest = (hue) => `hsl(${hue}, 100%, 10%)`;
color.light = (hue) => `hsl(${hue}, 100%, 70%)`;
color.lightest = (hue) => `hsl(${hue}, 100%, 90%)`;

function resetCanvasContext(ctx) {
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 10;
    ctx.font = "10px sans-serif";
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    ctx.direction = "inherit";
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = "source-over";
    ctx.setLineDash([]);
}