class Wheel{
    constructor(center,radius,colors){
        this.center = center;
        this.radius = radius;
        this.colors = colors
    }

    draw(ctx, angle = Math.PI){
        const sliceCount = this.colors.length;
        for (let i = 0; i < sliceCount; i++){
            const startAngle =  (i / sliceCount * Math.PI * 2) + angle;
            const endAngle =  ((i + 1) / sliceCount * Math.PI * 2) + angle;
            ctx.beginPath();
            ctx.fillStyle = this.colors[i];
            ctx.moveTo(this.center.x, this.center.y);
            ctx.arc(this.center.x, this.center.y, this.radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
        }
    }
}