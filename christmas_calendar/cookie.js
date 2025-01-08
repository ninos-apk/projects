function drawCookie(ctx, x, y, size, hue){
    const top = y - size/2;
    const left = x - size/2;
    const right = x + size/2;
    const bottom = y + size/2;
    
    const radius = size / 4;

    const length = 2 * Math.PI * radius;
    const dashLength = length / 6;

    ctx.save();

    ctx.setLineDash([0, dashLength]);

    draw.circle(ctx, x, y, radius,
         {
            lineWidth: radius * 2,
            strokeStyle: color.dark(hue),
            lineCap: "round"
        });

    ctx.restore();

    ctx.save();
    ctx.filter = "grayscale(1) brightness(20)";
    drawSnowFlake(ctx, x, y, size * 0.8, hue);
    ctx.restore();
}