function getNearestPoint(loc, points, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const point of points) {
        const dist = distance(point, loc);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = point;
        }
    }
    return nearest;
}

function getNearestSegment(loc, segments, threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    for (const seg of segments) {
        const dist = seg.distanceToPoint(loc);
        if (dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = seg;
        }
    }
    return nearest;
}

function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y)
}

function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}
function scale(p, scaler) {
    return new Point(p.x * scaler, p.y * scaler);
}

function normalize(p) {
    return scale(p, 1 / magnitude(p));
}

function magnitude(p) {
    return Math.hypot(p.x, p.y);
}

function average(p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

function translate(loc, angle, offset) {
    return new Point(
        loc.x + Math.cos(angle) * offset,
        loc.y + Math.sin(angle) * offset
    );
}
function perpendicular(point){
    return new Point(-point.y, point.x);
}
function angle(p) {
    return Math.atan2(p.y, p.x);
}

function lerp(A, B, t){
    return A + (B - A) * t;
}
function lerp2D(A, B, t){
    return new Point(lerp(A.x,B.x,t), lerp(A.y,B.y,t));
}

function getIntersection(A,B,C,D){
    /*
    Ix = Ax + (Bx - Ax) t = Cx + (Dx - Cx) u
    Iy = Ay + (By - Ay) t = Cy + (Dy - Cy) u

    solving the equation after t will result in :
    t = top / bottom 
    where
    top = (Dx-Cx)(Ay-Cy)-(Dy-Cy)(Ax-Cx)
    bottom = (Dy-Cy)(Bx-Ax)-(Dx-Cx)(By-Ay)

    we do the same for u
    */
   const ttop = (D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
   const utop = (C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    const e = 0.00001
   if(Math.abs(bottom) > e){
        const t = ttop/bottom;
        const u = utop/bottom;
        if (t>=0 && t<=1 && u>=0 && u<=1){
            return{
                x:lerp(A.x,B.x,t),
                y:lerp(A.y, B.y, t),
                offset:t
            }
        }
    }
    return null;
}

function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ",100%, 60%)";
}

function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

function getFake3dPoint(point, viewPoint, height){
    const dir = normalize(subtract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scaler = Math.atan(dist/300) / (Math.PI / 2);
    return add(point, scale(dir, height*scaler));
}