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

tools = {
  graph: {button: graphBtn, editor:new GraphEditor(viewport,graph), display:false},
  stop: {button: stopBtn, editor: new StopEditor(viewport,world), display:false},
  crossing: {button: crossingBtn, editor: new CrossingEditor(viewport,world), display:false},
  start: {button: startBtn, editor: new StartEditor(viewport,world), display:false}  
};

let oldGraphHash = graph.hash();

setMode("graph");
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
    for(const tool of Object.values(tools)){
        if(tool.display){
            tool.editor.display();
        }
    }
    requestAnimationFrame(animate);
}
function dispose(){
    tools["graph"].editor.dispose()
    world.markings.length = 0;
}
function save(){
    localStorage.setItem("graph", JSON.stringify(graph))
}

function removeSelectedPoint(){
    graphEditor = tools["graph"].editor
    if(graphEditor.selected){
        graphEditor.hovered =  graphEditor.selected
        graphEditor.selected = null;
        return;
    }
    if(graphEditor.hovered){
        graphEditor.graph.removePoint(graphEditor.hovered);
        graphEditor.hovered = null;
    }
}

function setMode(mode){
    disableEditors();
    tools[mode].button.style.backgroundColor = "white";
    tools[mode].button.style.filter = "";
    tools[mode].editor.enable();
    tools[mode].display = true;
}
function disableEditors(){
    for(tool of Object.values(tools)){
        tool.button.style.backgroundColor = "gray";
        tool.button.style.filter = "grayscale(100%)";
        tool.editor.disable();
        tool.display = false;
    }
}
