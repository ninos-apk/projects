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
        this.#addEventListnerForShortestPath();
    }

    enable() {
        this.#addTouchEventListeners();
        this.#addMouseEventListeners();
    }

    disable() {
        this.#removeTouchEventListeners();
        this.#removeMouseEventListeners();
        this.selected = null;
        this.hovered = null;
    }


    #addTouchEventListeners() {
        this.boundTouchStart = this.#handleTouchStart.bind(this);
        this.boundTouchMove = this.#handleTouchMove.bind(this);
        this.boundTouchEnd = this.#handleTouchEnd.bind(this);
        this.canvas.addEventListener("touchstart", this.boundTouchStart);
        this.canvas.addEventListener("touchmove", this.boundTouchMove);
        this.canvas.addEventListener("touchend", this.boundTouchEnd);
        this.boundContextMenu = (evt) => evt.preventDefault();
        this.canvas.addEventListener("contextmenu", this.boundContextMenu);
    }
    #removeTouchEventListeners() {
        this.canvas.removeEventListener("touchstart", this.boundTouchStart);
        this.canvas.removeEventListener("touchmove", this.boundTouchMove);
        this.canvas.removeEventListener("touchend", this.boundTouchEnd);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
    }
    #addMouseEventListeners() {
        this.boundMouseUp = this.#handleMouseUp.bind(this);
        this.boundMouseDown = this.#handleMouseDown.bind(this);
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.canvas.addEventListener("mousedown", this.boundMouseDown);
        this.canvas.addEventListener("mousemove", this.boundMouseMove);
        this.canvas.addEventListener("mouseup", this.boundMouseUp);

        this.boundContextMenu = (evt) => evt.preventDefault();
        this.canvas.addEventListener("contextmenu", this.boundContextMenu);
    }
    #removeMouseEventListeners() {
        this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mousemove", this.boundMouseMove);
        this.canvas.removeEventListener("mouseup", this.boundMouseUp);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
    }

    #addEventListnerForShortestPath() {
        this.boundMouseMove = this.#handleMouseMove.bind(this);
        this.canvas.addEventListener("mousemove", this.boundMouseMove);
        window.addEventListener("keydown", (evt) => {
            if (evt.key == "s") {
                this.start = this.mouse;
            }
            if (evt.key == "e") {
                this.end = this.mouse;
            }
            if (this.start && this.end) {
                world.generateCorridor(this.start, this.end);
            }
        });
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

    #handleMouseMove(evt) {
        this.mouse = this.viewport.getMouse(evt, true);
        this.hovered = getNearestPoint(this.mouse, this.graph.points, 10 * this.viewport.zoom);
        if (this.dragging) {
            this.selected.x = this.mouse.x;
            this.selected.y = this.mouse.y;
        }
    }

    #handleMouseUp(evt) {
        this.dragging = false;
    }

    #handleTouchStart(evt) {
        this.touch = this.viewport.getTouchPoint(evt, true);
        if (evt.touches.length > 1) {
            return;
        }
        this.hovered = getNearestPoint(this.touch, this.graph.points, 10 * this.viewport.zoom);
        if (this.hovered) {
            this.dragging = true;
            this.#select(this.hovered);
        }
        setTimeout(() => {
            this.timeOut = true;
        }, 200);
    }

    #handleTouchMove(evt) {
        this.touch = this.viewport.getTouchPoint(evt, true);
        if (this.dragging) {
            this.viewport.disableViewportMove = true;
            this.selected.x = this.touch.x;
            this.selected.y = this.touch.y;
        }
    }

    #handleTouchEnd(evt) {
        if (!this.timeOut && !this.dragging) {
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
            const input_method = this.mouse ? this.mouse : this.touch;
            const intent = this.hovered ? this.hovered : input_method;
            new Segment(this.selected, intent).draw(ctx, { color: "rgba(0,0,0,0.5)", dash: [3, 3] });
            this.selected.draw(this.ctx, { fill: true });
        }
    }

    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
    }

}