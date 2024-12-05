function drawBall(ctx, x, y, size, hue) {
    const top = x - size / 2;
    const ring = {
        radius: size * 0.1,
        x,
        get y() {
            return top + this.radius
        },
        thickness: size * 0.05,
        color: color.darkest(hue),
    };
    draw.circle(ctx, ring.x, ring.y, ring.radius, {strokeStyle: ring.color, lineWidth: ring.thickness, outline: "inside"});
    const ball = {
        radius: size * 0.4,
        x,
        get y() {
            return top + this.radius + ring.radius
        },
        color: color.normal(hue),
    };
    const highlight = {
        x: ball.x - ball.radius * 0.3,
        y: ball.y - ball.radius * 0.3,
    }
    const gradnient = ctx.createRadialGradient(highlight.x, highlight.y, 0, highlight.x, highlight.y, ball.radius);
    gradnient.addColorStop(0, color.light(hue));
    gradnient.addColorStop(1, color.dark(hue));
    draw.circle(ctx, ball.x, ball.y, ball.radius, {fillStyle: gradnient});
}
