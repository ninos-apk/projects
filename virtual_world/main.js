function resizeCanvas(){
    const canvas = document.getElementById('myCanvas');

    // Set canvas width and height to 80% of the viewport's width and height
    const width = window.innerWidth;
    const height = window.innerHeight * 0.85;

    canvas.width = width;
    canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let editorVisible = true;
const ctx = myCanvas.getContext("2d");
const graphString = localStorage.getItem("graph");
let graphInfo = graphString? JSON.parse(graphString):null;
if(!graphInfo){
    graphInfo = graphData
}
const graph = graphInfo? Graph.load(graphInfo): new Graph();
const world = new World(graph);
const viewport = new Viewport(myCanvas);
const graphEditor = new GraphEditor(viewport,graph);
let oldGraphHash = graph.hash();
animate();
function animate(){
    viewport.reset();
    if(oldGraphHash!=graph.hash()){
        world.generate();
        oldGraphHash = graph.hash();
    }
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(ctx, viewPoint);
    ctx.globalAlpha = 0.7;
    if(editorVisible){
        graphEditor.display();
    }
    requestAnimationFrame(animate);
}
function dispose(){
    graphEditor.dispose()
}
function save(){
    localStorage.setItem("graph", JSON.stringify(graph))
}

function toggleEditor() {
editorVisible = !editorVisible; 
}
function removeSelectedPoint(){
    if(graphEditor.selected){
        graphEditor.graph.removePoint(graphEditor.selected);
        graphEditor.hovered = null;
        if (graphEditor.selected == graphEditor.selected) {
            graphEditor.selected = null;
        }
    }
}