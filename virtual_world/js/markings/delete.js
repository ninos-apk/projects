class Delete extends Marking{
    constructor(center, directionVector, width, height){
        super(center, directionVector, width, height);
        this.type = "delete";
    }

    draw(ctx){
     this.center.draw(ctx,{color:"rgba(255, 255, 255, 0.98)", size:30});
    }

}