function drawSnowMan(ctx, x, y, size, hue){
    const top = y - size/2;
    const left = x - size/2;
    const right = x + size/2;
    const bottom = y + size/2;

    const bottomBall = {
        size : size * 0.6,
        x,
        y: y + size * 0.2,
    };

    drawSnowBall(ctx, bottomBall.x, bottomBall.y, bottomBall.size, hue);

    const topBall = {
        size : size * 0.4,
        x,
        y: y - size * 0.2,
    };

    drawSnowBall(ctx, topBall.x, topBall.y, topBall.size, hue);

    const eye = {
        radius: size * 0.03,
        xOffset: size * 0.1,
        y: topBall.y,
    };

    draw.circle(ctx, x - eye.xOffset, eye.y, eye.radius, {fillStyle: color.darkest(hue)});
    draw.circle(ctx, x + eye.xOffset, eye.y, eye.radius, {fillStyle: color.darkest(hue)});

    const hat = {
        width: size * 0.3,
        height: size * 0.2,
        x,
        bottom: topBall.y - size * 0.1,
        top,
        sleeveHeight: size * 0.1,
        sleeveWidth: size * 0.4,
        hue: color.reverse(hue),
    };

    draw.line(ctx, hat.x, hat.bottom, hat.x, hat.top, {
        strokeStyle: color.dark(hat.hue),
        lineWidth: hat.width,

    });

    draw.line(ctx, hat.x , hat.bottom, hat.x , hat.bottom - hat.sleeveHeight, {
        strokeStyle: color.normal(hat.hue),
        lineWidth: hat.sleeveWidth,
        
    });
}