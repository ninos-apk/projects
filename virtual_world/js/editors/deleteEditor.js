class DeleteEditor extends MarkingEditor {
    constructor(viewport, world) {
        super(viewport, world, world.laneGuides);
    }

    createMarking(center, directionVector) {
        return new Delete(
            center,
            directionVector,
            this.world.roadWidth / 2,
            this.world.roadWidth / 2
        );
    }

    enable() {
        this.boundTouchStart = this.#HandleTouchDelete.bind(this);
        this.canvas.addEventListener("touchstart", this.boundTouchStart);
    }

    disable() {
        this.canvas.removeEventListener("touchstart", this.boundTouchStart);
    }

    #HandleTouchDelete(evt) {
        const touch = this.viewport.getTouchPoint(evt, true);
        this.removeMarkingAt(touch);
        const point = getNearestPoint(touch, this.world.graph.points, 10 * this.viewport.zoom);
        if (point) {
            this.world.graph.removePoint(point);
        }
    }

    display() {
        super.display();
        this.world.graph.draw(this.ctx);
    }
}