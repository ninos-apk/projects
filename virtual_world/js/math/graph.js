class Graph {
    constructor(points = [], segments = []) {
        this.points = points;
        this.segments = segments;
    }

    static load(info) {
        const points = info.points.map((p) => new Point(p.x, p.y));
        const segments = info.segments.map((seg) => new Segment(
            points.find((p) => p.equals(seg.p1)),
            points.find((p) => p.equals(seg.p2)),
            seg.oneWay
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
        if (!this.containsSegment(seg) && !seg.p1.equals(seg.p2)) {
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

    getSegmentsLeavingFromPoint(point) {
        return this.segments.filter(seg => 
            seg.oneWay ? seg.p1.equals(point) : seg.includes(point)
        );
    }

    // getShortestPath(start, end) {

    //     for (const point of this.points) {
    //         point.dist = Infinity;
    //         point.visited = false;
    //     }
    //     let currentPoint = start;
    //     currentPoint.dist = 0;

    //     while (!end.visited) {
    //         const segs = this.getSegmentsLeavingFromPoint(currentPoint);
    //         for (const seg of segs) {
    //             const otherPoint = seg.p1.equals(currentPoint) ? seg.p2 : seg.p1;
    //             if(currentPoint.dist + seg.length() > otherPoint.dist) continue;
    //             otherPoint.dist = currentPoint.dist + seg.length();
    //             otherPoint.prev = currentPoint;
    //         }
    //         currentPoint.visited = true;

    //         const unvisited = this.points.filter((p) => !p.visited);
    //         const dists = unvisited.map((p) => p.dist);
    //         currentPoint = unvisited.find((p) => p.dist == Math.min(...dists));
    //     }

    //     const path = [];
    //     currentPoint = end;
    //     while(currentPoint){
    //         path.unshift(currentPoint);
    //         currentPoint = currentPoint.prev;
    //     }
    //     for(const point of this.points){
    //         delete point.dist;
    //         delete point.prev;
    //         delete point.visited;
    //     }
    //     return path;
    // }
    getShortestPath(start, end) {
        // Initialize distances and previous nodes
        const dist = new Map();
        const prev = new Map();
        const visited = new Set();
        const priorityQueue = new PriorityQueue((a, b) => dist.get(a) - dist.get(b));
    
        for (const point of this.points) {
            dist.set(point, Infinity);
            prev.set(point, null);
        }
        dist.set(start, 0);
        priorityQueue.push(start);
    
        // Dijkstra's Algorithm
        while (!priorityQueue.isEmpty()) {
            const currentPoint = priorityQueue.pop();
    
            if (currentPoint === end) break;
            if (visited.has(currentPoint)) continue;
    
            visited.add(currentPoint);
    
            const segs = this.getSegmentsLeavingFromPoint(currentPoint);
            for (const seg of segs) {
                const neighbor = seg.p1.equals(currentPoint) ? seg.p2 : seg.p1;
                if (visited.has(neighbor)) continue;
    
                const newDist = dist.get(currentPoint) + seg.length();
                if (newDist < dist.get(neighbor)) {
                    dist.set(neighbor, newDist);
                    prev.set(neighbor, currentPoint);
                    priorityQueue.push(neighbor); // Update priority
                }
            }
        }
    
        // Reconstruct the shortest path
        const path = [];
        for (let at = end; at !== null; at = prev.get(at)) {
            path.unshift(at);
        }
    
        return path;
    }
    getShortestPathAStar(start, end) {
        // Initialize data structures
        const dist = new Map(); // Distance from start to each point
        const prev = new Map(); // Tracks the previous point in the optimal path
        const fScore = new Map(); // Estimated total distance (dist + heuristic)
        const priorityQueue = new PriorityQueue((a, b) => fScore.get(a) - fScore.get(b));
        const visited = new Set();
    
        // Initialize distances
        for (const point of this.points) {
            dist.set(point, Infinity);
            fScore.set(point, Infinity);
            prev.set(point, null);
        }
        dist.set(start, 0);
        fScore.set(start, this.heuristic(start, end));
        priorityQueue.push(start);
    
        // A* Algorithm
        while (!priorityQueue.isEmpty()) {
            const current = priorityQueue.pop();
    
            // If we've reached the end point, reconstruct the path
            if (current === end) {
                const path = [];
                let temp = end;
                while (temp) {
                    path.unshift(temp);
                    temp = prev.get(temp);
                }
                return path;
            }
    
            visited.add(current);
    
            // Process neighbors
            const neighbors = this.getSegmentsLeavingFromPoint(current);
            for (const segment of neighbors) {
                const neighbor = segment.p1.equals(current) ? segment.p2 : segment.p1;
    
                if (visited.has(neighbor)) continue;
    
                const tentativeDist = dist.get(current) + segment.length();
    
                if (tentativeDist < dist.get(neighbor)) {
                    dist.set(neighbor, tentativeDist);
                    prev.set(neighbor, current);
                    fScore.set(neighbor, tentativeDist + this.heuristic(neighbor, end));
    
                    if (!priorityQueue.heap.includes(neighbor)) {
                        priorityQueue.push(neighbor);
                    }
                }
            }
        }
    
        // If we reach here, no path was found
        return [];
    }
    
    // Heuristic function (Euclidean distance)
    heuristic(pointA, pointB) {
        return Math.sqrt(
            Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
        );
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
            seg.draw(ctx, { color: "rgba(0,0,0,0.4)" });
        }
        for (const point of this.points) {
            point.draw(ctx, { color: "rgba(0,0,0,0.4)" });
        }
    }
}
