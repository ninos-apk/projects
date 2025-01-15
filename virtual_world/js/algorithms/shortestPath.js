// Heuristic function (Euclidean distance)
function euclideanDistance(pointA, pointB) {
    return Math.sqrt(
        Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2)
    );
}
function blindHeuristic(start, end) {
    return 0;
}

class ShortestPath {
    constructor(graph) {
        this.graph = graph;
        this.explored_nodes = [];
    }
    dijkstra(start, end) {

        for (const point of graph.points) {
            point.dist = Infinity;
            point.visited = false;
        }
        let currentPoint = start;
        currentPoint.dist = 0;

        while (!end.visited) {
            const segs = graph.getSegmentsLeavingFromPoint(currentPoint);
            for (const seg of segs) {
                const otherPoint = seg.p1.equals(currentPoint) ? seg.p2 : seg.p1;
                if (currentPoint.dist + seg.length() > otherPoint.dist) continue;
                otherPoint.dist = currentPoint.dist + seg.length();
                otherPoint.prev = currentPoint;
            }
            currentPoint.visited = true;

            const unvisited = graph.points.filter((p) => !p.visited);
            const dists = unvisited.map((p) => p.dist);
            currentPoint = unvisited.find((p) => p.dist == Math.min(...dists));
        }

        const path = [];
        currentPoint = end;
        while (currentPoint) {
            path.unshift(currentPoint);
            currentPoint = currentPoint.prev;
        }
        for (const point of graph.points) {
            delete point.dist;
            delete point.prev;
            delete point.visited;
        }
        return path;
    }
    aStar(start, end, heuristic=euclideanDistance) {
        // Initialize distances and previous nodes
        const dist = new Map();
        const prev = new Map();
        const visited = new Set();
        const priorityQueue = new PriorityQueue(
            (a, b) => (dist.get(a) + heuristic(a, end)) - (dist.get(b) + heuristic(b, end))
        );

        for (const point of graph.points) {
            dist.set(point, Infinity);
            prev.set(point, null);
        }
        dist.set(start, 0);
        this.explored_nodes = [];
        priorityQueue.push(start);
        this.explored_nodes.push(start);
        while (!priorityQueue.isEmpty()) {
            const currentPoint = priorityQueue.pop();
            this.explored_nodes.push(currentPoint);
            if (currentPoint === end) break;
            if (visited.has(currentPoint)) continue;

            visited.add(currentPoint);

            const segs = graph.getSegmentsLeavingFromPoint(currentPoint);
            for (const seg of segs) {
                const neighbor = seg.p1.equals(currentPoint) ? seg.p2 : seg.p1;
                if (visited.has(neighbor)) continue;

                const newDist = dist.get(currentPoint) + seg.length();
                if (newDist < dist.get(neighbor)) {
                    dist.set(neighbor, newDist);
                    prev.set(neighbor, currentPoint);
                    priorityQueue.push(neighbor);
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
}