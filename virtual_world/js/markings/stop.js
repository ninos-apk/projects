class Stop extends Marking{
    constructor(center, directionVector, width, height){
        super(center, directionVector, width, height);
        this.boarder = this.poly.segments[2];
    }

    draw(ctx){
        this.boarder.draw(ctx, {width:5, color:"white"});
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);

        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = this.height * 0.3 + "px Arial";
        ctx.fillText("STOP", 0, 0);

        ctx.restore();
    }

}