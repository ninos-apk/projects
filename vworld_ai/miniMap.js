class MiniMap{
    constructor (canvas, graph){
        this.canvas = canvas;
        this.graph = graph;
        this.ctx = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
    }

    update(viewPoint){
        this.ctx.clearRect(0,0,this.width,this.height);
        const scaler = 0.05;
        const scaledViewPoint = scale(viewPoint, -scaler);
        this.ctx.save();
        this.ctx.translate(scaledViewPoint.x + this.width /2,
                            scaledViewPoint.y + this.height/2);
        this.ctx.scale(scaler, scaler);
        for(const seg of this.graph.segments){
            seg.draw(this.ctx, {width:3/scaler, color:"white"});
        }
        this.ctx.restore();
        new Point(this.width/2, this.height/2).draw(this.ctx,{color:"blue", size:10, outline:true})
    }
}