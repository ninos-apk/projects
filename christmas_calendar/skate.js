function drawSkate(ctx, x, y, size, hue){
    const sledge = {
        x,
        bottom: y + size * 0.34,
        size: size * 0.9,
    };
    
    drawSledge(ctx, sledge.x, sledge.bottom, sledge.size, hue);

    const sock = {
        x: x - size * 0.25,
        y: y + size * 0.05,
        size: size * 1.1,
    };
    drawSock(ctx, sock.x, sock.y, sock.size, color.reverse(hue), Math.PI);
}