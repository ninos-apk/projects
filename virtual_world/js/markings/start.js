class Start extends Marking{
    constructor(center, directionVector, width, height){
        super(center, directionVector, width, height);
        this.img = new Image();
        this.img.src = "../assets/car.png";
        this.type = "start";
    }

    draw(ctx){
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);
        // last two parameters are the width and the height of the image
        ctx.drawImage(this.img,(-this.width/2)*0.5, -this.height/2 , this.width * 0.5, this.height * 0.8); 
        ctx.restore();
    }

}