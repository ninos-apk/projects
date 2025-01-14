class GraphEditor {
    constructor(viewport, graph) {
        this.viewport = viewport;
        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d");

        this.graph = graph; 

        this.selected = null; 
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;
        this.touch = null;
        this.timeOut = false;
        this.touchActive = false;
    }   

    enable(){
        this.#addEventListeners();
    }

    disable(){
        this.#removeEventListeners();
        this.selected = null;
        this.hovered = null;
    }

    #addEventListeners() {
        this.boundMouseUp = this.#handleMouseUp.bind(this);
        this.boundMouseDown = this.#handleMouseDown.bind(this);
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundTouchStart = this.#handleTouchStart.bind(this);
        this.boundTouchEnd = this.#handleTouchEnd.bind(this);
        this.boundTouchMove = this.#handleTouchMove.bind(this);
        this.boundContextMenu =  (evt) => evt.preventDefault();
        this.canvas.addEventListener("mousedown", this.boundMouseDown);
        this.canvas.addEventListener("mousemove", this.boundMouseMove);
        this.canvas.addEventListener("mouseup", this.boundMouseUp);
        this.canvas.addEventListener("contextmenu", this.boundContextMenu);
        this.canvas.addEventListener("touchstart", this.boundTouchStart);
        this.canvas.addEventListener("touchmove", this.boundTouchMove);
        this.canvas.addEventListener("touchend", this.boundTouchEnd);

        window.addEventListener("keydown", (evt) => {
            if (evt.key == "s") {
                this.start = this.hovered;
            }
            if (evt.key == "e") {
                this.end = this.hovered;
            }
        });
    }

    #removeEventListeners(){
        this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mousemove", this.boundMouseMove);
        this.canvas.removeEventListener("mouseup", this.boundMouseUp);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
        this.canvas.removeEventListener("touchstart", this.boundTouchStart);
        this.canvas.removeEventListener("touchmove", this.boundTouchMove);
        this.canvas.removeEventListener("touchend", this.boundTouchEnd);
    }

    #removePoint(point) {
        this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected == point) {
            this.selected = null;
        }
    }

    #select(point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    #handleMouseDown(evt) {
        if(this.touchActive){
            return;
        }
        if (evt.button == 2) {// right click
            if (this.selected) {
                this.selected = null;
                return;
            }
            if (this.hovered) {
                this.#removePoint(this.hovered)
            }
        }
        if (evt.button == 0) {//left click
            if (this.hovered) {
                this.#select(this.hovered);
                this.dragging = true;
                return;
            }
            this.graph.addPoint(this.mouse);
            this.#select(this.mouse);
            this.hovered = this.mouse;
        }
    }

    #handleMouseUp(evt){
        this.dragging = false;
        this.touchActive = false;
    }

    #handleMouseMove(evt) {
        if(this.touchActive){
            return;
        }
        this.mouse = this.viewport.getMouse(evt, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);
        if (this.dragging) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #handleTouchStart(evt){
        this.touchActive = true;
        this.touch = this.viewport.getTouchPoint(evt, true);
        if(evt.touches.length > 1){
            return;
        }
        this.hovered = getNearestPoint(this.touch, this.graph.points, 10 * this.viewport.zoom);
        if (this.hovered) {
            this.dragging = true;
            this.#select(this.hovered);
        }
    }

    #handleTouchMove(evt){
        this.touch = this.viewport.getTouchPoint(evt, true);
        setTimeout(() => {
            this.timeOut = true;
          }, 200);
        if (this.dragging) {
            this.viewport.disableViewportMove = true;
            this.selected.x = this.touch.x;
            this.selected.y = this.touch.y;
        }
    }

    #handleTouchEnd(evt){
        if(!this.dragging && !this.timeOut){
            this.graph.addPoint(this.touch);
            this.#select(this.touch);
        }
        this.dragging = false;
        this.viewport.disableViewportMove = false;
        this.timeOut = false;
    }

    display() {
        this.graph.draw(this.ctx)
        if (this.hovered) {
            this.hovered.draw(this.ctx, { outline: true });
        }
        if (this.selected) {
            const input_method = this.mouse?this.mouse:this.touch;
            const intent = this.hovered ? this.hovered : input_method;
            new Segment(this.selected, intent).draw(ctx, {color: "rgba(0,0,0,0.5)" ,dash:[3, 3]});
            this.selected.draw(this.ctx, { fill: true });
        }
        if(this.start && this.end){
            const path = this.graph.getShortestPathAStar(this.start, this.end);
            for(const point of path){
                point.draw(this.ctx,{size:50,color:"blue"});
                if(point.prev){
                    new Segment(point, point.prev).draw(ctx, {color: "rgba(63, 230, 12, 0.7)", width:20 });
                }
            }
        }
    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

}