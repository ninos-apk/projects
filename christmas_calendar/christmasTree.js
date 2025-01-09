function drawChristmasTree(ctx, x, y, size, hue){
    const top = y - size/2;
    const left = x - size/2;
    const right = x + size/2;
    const bottom = y + size/2;

    const tree = {
        size: size * 0.9,
        x,
        get y(){return bottom - this.size/2},
        get top(){return bottom - this.size},
        hue: 90, // green color
    };

    drawTree(ctx, tree.x, tree.y, tree.size, tree.hue);

    const star = {
        size: size * 0.2,
        x,
        y: tree.top,
        hue: 30, //orange color
    };
    drawStar(ctx, star.x, star.y, star.size, star.hue);
    drawStar(ctx, star.x, star.y, star.size / 2, 50);

    const balls = [];
    const ballSize = size * 0.08;
    const tryCount = 500;
    for (let i = 1; i <= tryCount; i++){
        const ball = {
            x: lerp(left, right, Math.random()),
            y: lerp(top, bottom, Math.random()),
        };
        if(balls.some(b => distance(b, ball) < ballSize)){
            continue;
        }

        const ballTop = ball.y - ballSize/2;
        const imgData = ctx.getImageData(ball.x , ballTop, 1, 1);

        if(imgData.data[1] != 255){// not green
            continue;
        }

        balls.push(ball);
        
    }
    balls.forEach(ball => {
        const randomNonGreenHue = lerp(180, 360, Math.random());
        drawBall(ctx, ball.x, ball.y, ballSize, randomNonGreenHue);
    });

    function lerp(A, B, t){
        return A + (B - A) * t;
    }

    function distance(p1, p2){
        return Math.hypot(p1.x - p2.x, p1.y - p2.y);
    }
}