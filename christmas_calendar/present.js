function drawPresent(ctx, x, y, size, hue) {
    const top = y - size / 2;
    const left = x - size / 2;
    const bottom = y + size / 2;
    const right = x + size / 2;

    const box = {
        height : size * 0.8,
        width : size * 0.9,
        x,
        bottom,
        get top(){return bottom - this.height},
        color: color.dark(hue),
    };

    draw.line(ctx, box.x, box.top, box.x, box.bottom, {
        strokeStyle: box.color,
        lineWidth: box.width
    });

    const ropeWidth = size * 0.1;

    draw.line(ctx, box.x, box.top, box.x, box.bottom, {
        strokeStyle: color.normal(color.reverse(hue)),
        lineWidth: ropeWidth
    });

    const lid = {
        height : size * 0.2,
        width : size,
        x,
        top: box.top,
        get bottom(){return this.top + this.height},
        color: color.light(hue),
    };
    drawBow(ctx, x, box.top, size*0.8, color.reverse(hue));

    draw.line(ctx, lid.x, lid.top, lid.x, lid.bottom, {
        strokeStyle: lid.color,
        lineWidth: lid.width
    });
}