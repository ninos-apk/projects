function drawCane(ctx, x, y, size, hue){
    resetCanvasContext(ctx);
    const top = y - size/2;

    const width = size/2;
    const thickness = size * 0.1;
    const bottom = y + size/2;
    const arc = {
        radius : (width - thickness) / 2,
        x,
        get y() {return top + this.radius + thickness / 2}
    };

    ctx.beginPath();
    ctx.strokeStyle = color.normal(hue);
    ctx.lineWidth = thickness
    ctx.arc(arc.x,arc.y,arc.radius,Math.PI,0);
    ctx.lineTo(arc.x + arc.radius, bottom);
    ctx.stroke();
    ctx.strokeStyle = color.dark(hue);
    ctx.setLineDash([thickness, thickness]);
    ctx.stroke();
}