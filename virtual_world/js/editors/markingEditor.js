class MarkingEditor {
    constructor(viewport, world, targetSegments) {
        this.viewport = viewport;
        this.world = world;

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d");

        this.intent = null;
        this.mouse = null;

        this.targetSegments = targetSegments;

        this.markings = world.markings;
    }

    // to be overwritten
    createMarking(center, directionVector) {
        return center;
    }

    enable() {
        this.#addMouseEventListeners();
        this.#addTouchEventListeners();
    }

    disable() {
        this.#removeMouseEventListeners();
        this.#removeTouchEventListeners();
    }

    #addMouseEventListeners() {
        this.boundMouseDown = this.#handleMouseDown.bind(this);
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.boundContextMenu = (evt) => evt.preventDefault();
        this.canvas.addEventListener("mousedown", this.boundMouseDown);
        this.canvas.addEventListener("mousemove", this.boundMouseMove);
        this.canvas.addEventListener("contextmenu", this.boundContextMenu);
    }

    #removeMouseEventListeners() {
        this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mousemove", this.boundMouseMove);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
    }

    #addTouchEventListeners() {
        this.boundTouchStart = this.#handleTouchStart.bind(this);
        this.canvas.addEventListener("touchstart", this.boundTouchStart);
    }
    #removeTouchEventListeners() {
        this.canvas.removeEventListener("touchstart", this.boundTouchStart);
    }

    addMarkingAt(point){
        const seg = getNearestSegment(point, this.targetSegments, 20 * this.viewport.zoom);
        if (seg) {
            const proj = seg.projectPoint(point);
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = this.createMarking(proj.point, seg.directionVector());
                return;
            }
        }
        this.intent = null;
    }
    
    removeMarkingAt(point){
        for (let i = 0; i < this.markings.length; i++) {
            const poly = this.markings[i].poly;
            if (poly.containsPoint(point)){
                this.markings.splice(i, 1);
                return;
            }
        }
    }

    #handleTouchStart(evt) {
        const touch = this.viewport.getTouchPoint(evt, true);
        this.addMarkingAt(touch);
        if (this.intent) {
            this.markings.push(this.intent);
            this.intent = null;
        }
    }

    #handleMouseMove(evt) {
        this.mouse = this.viewport.getMouse(evt, true);
        this.addMarkingAt(this.mouse);
    }

    #handleMouseDown(evt) {
        if (evt.button == 0) {//left click mouse
            if (this.intent) {
                this.markings.push(this.intent);
                this.intent = null;
            }
        }
        if (evt.button == 2) { //right click mouse
            this.removeMarkingAt(this.mouse);
        }
    }

    display() {
        if (this.intent) {
            this.intent.draw(this.ctx);
        }
    }

}