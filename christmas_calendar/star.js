function drawStar(ctx, x, y, size, hue, points = 10) {
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2;

    ctx.beginPath();
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const surfaceX = x - radius * Math.sin(angle);
        const surfaceY = y - radius * Math.cos(angle);
        ctx.lineTo(surfaceX, surfaceY);
    }
    ctx.closePath();
    ctx.fillStyle = color.normal(hue);
    ctx.fill();
}

