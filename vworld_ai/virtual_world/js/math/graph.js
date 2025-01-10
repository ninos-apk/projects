class Graph{
    constructor(points = [], segments = []) {
        this.points = points; 
        this.segments = segments; 
    }

    static load(info) {
        const points = info.points.map((p) => new Point(p.x, p.y));
        const segments = info.segments.map((seg) => new Segment(
            points.find((p) => p.equals(seg.p1)),
            points.find((p) => p.equals(seg.p2))
        ));
        return new Graph(points, segments);
    }

    addPoint(point) {
        this.points.push(point);
    }
    removePoint(point) {
        const segs = this.getSegmentsWithPoint(point);
        for (const seg of segs) { this.removeSegment(seg); }
        this.points.splice(this.points.indexOf(point), 1);
    }

    addSegment(seg) {
        this.segments.push(seg);
    }

    tryAddPoint(point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false;
    }

    tryAddSegment(seg) {
        if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)){
            this.addSegment(seg);
            return true;
        }
        return false;
    }

    removeSegment(seg) {
        this.segments.splice(this.segments.indexOf(seg), 1);
    }

    getSegmentsWithPoint(point) {
        return this.segments.filter((s) => s.includes(point));
    }

    containsPoint(point) {
        return this.points.find((p) => p.equals(point));
    }

    containsSegment(seg) {
        return this.segments.find((s) => s.equals(seg));
    }

    dispose() {
        this.points.length = 0; 
        this.segments.length = 0; 
    }

    hash() {
        return JSON.stringify(this);
    }

    draw(ctx) {
        for (const seg of this.segments) {
            seg.draw(ctx, {color:"rgba(0,0,0,0.4)"});
        }
        for (const point of this.points) {
            point.draw(ctx, {color:"rgba(0,0,0,0.4)"});
        }
    }
}
