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
    }

    #handleMouseMove(evt) {
        this.mouse = this.viewport.getMouse(evt, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);
        if (this.dragging) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #handleTouchStart(evt){
        this.touch = this.viewport.getTouchPoint(evt, true);
        const p = getNearestPoint(this.touch, this.graph.points, 10 * this.viewport.zoom);
        if(p && p.equals(this.selected)){
            this.selected = null;
        }

    }

    #handleTouchMove(evt){
        this.touch = this.viewport.getTouchPoint(evt, true);
        if (this.selected) {
            this.viewport.stopTouchMove = true;
            this.selected.x = this.touch.x;
            this.selected.y = this.touch.y;
        }
    }

    #handleTouchEnd(evt){
        this.viewport.stopTouchMove = false;
    }

    display() {
        this.graph.draw(this.ctx)
        if (this.hovered) {
            this.hovered.draw(this.ctx, { outline: true });
        }
        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent).draw(ctx, {color: "rgba(0,0,0,0.5)" ,dash:[3, 3]});
            this.selected.draw(this.ctx, { fill: true });
        }
    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

}