const back_button = document.getElementById("back-button");
back_button.addEventListener("click", function () {
    window.location.href = "../index.html?backFromProjects=true";
});

function resizeCanvas() {
    const canvas = document.getElementById('myCanvas');
    const width = window.innerWidth;
    const height = window.innerHeight * 0.9;
    canvas.width = width;
    canvas.height = height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const ctx = myCanvas.getContext("2d");

const worldString = localStorage.getItem("world");
const worldInfo = worldString ? JSON.parse(worldString) : null;
let world = worldString ? World.load(worldInfo) : new World(new Graph());

const graph = world.graph;

const viewport = new Viewport(myCanvas, world.zoom, world.offset);

tools = {
    graph: { button: graphBtn, editor: new GraphEditor(viewport, graph), display: false },
    stop: { button: stopBtn, editor: new StopEditor(viewport, world), display: false },
    crossing: { button: crossingBtn, editor: new CrossingEditor(viewport, world), display: false },
    start: { button: startBtn, editor: new StartEditor(viewport, world), display: false },
    target: { button: targetBtn, editor: new TargetEditor(viewport, world), display: false },
    parking: { button: parkingBtn, editor: new ParkingEditor(viewport, world), display: false },
    yield: { button: yieldBtn, editor: new YieldEditor(viewport, world), display: false },
    light: { button: lightBtn, editor: new LightEditor(viewport, world), display: false },
    delete: { button: deleteBtn, editor: new DeleteEditor(viewport, world), display: false },
};

let oldGraphHash = graph.hash();

setMode("graph");
animate();
function animate() {
    viewport.reset();
    if (oldGraphHash != graph.hash()) {
        world.generate();
        oldGraphHash = graph.hash();
    }
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(ctx, viewPoint);
    ctx.globalAlpha = 0.7;
    for (const tool of Object.values(tools)) {
        if (tool.display) {
            tool.editor.display();
        }
    }
    requestAnimationFrame(animate);
}
function dispose() {
    const confirmation = window.confirm("Are you sure you want to delete the entire map?");
    if (confirmation) {
        tools["graph"].editor.dispose();
        world.markings.length = 0;
    } else {
        console.log("Dispose action cancelled.");
    }
}
function save() {
    world.zoom = viewport.zoom;
    world.offset = viewport.offset;
    const element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:application/json;charset=utf-8," +
        encodeURIComponent("const world = World.load(" +
            JSON.stringify(world)
            + ");")
    );
    const fileName = "name.world";
    element.setAttribute("download", fileName);
    element.click();
    localStorage.setItem("world", JSON.stringify(world))
}

function load(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected");
        return;
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (evt) => {
        const fileContent = evt.target.result;
        const jsonString = fileContent.substring(
            fileContent.indexOf("(") + 1,
            fileContent.lastIndexOf(")")
        );
        const jsonData = JSON.parse(jsonString);
        world = World.load(jsonData);
        localStorage.setItem("world", JSON.stringify(world))
        location.reload();
    }
}

function toggleRemoveMarking() {
    disableEditors();
    setMode("removeMarking");
    tools.removeMarking.editor.disable();
    tools.removeMarking.editor.enableRemoveMarking();
    tools.graph.editor.removeActive = true;
}

function setMode(mode) {
    disableEditors();
    tools[mode].button.style.backgroundColor = "rgba(58, 189, 43, 0.66)";
    tools[mode].button.style.filter = "";
    tools[mode].editor.enable();
    tools[mode].display = true;
}
function disableEditors() {
    for (tool of Object.values(tools)) {
        tool.button.style.backgroundColor = "gray";
        tool.button.style.filter = "grayscale(100%)";
        tool.editor.disable();
        tool.display = false;
    }
    tools.graph.editor.removeActive = false;
}
function openOsmPanel() {
    osmPanel.style.display = "block";
}
function closeOsmPanel() {
    osmPanel.style.display = "none";
}
function parseOsmData() {
    if (osmDataContainer.value == "") {
        alert("Paste data first");
        return;
    }
    const result = Osm.parseRoads(JSON.parse(osmDataContainer.value));
    graph.points = result.points;
    graph.segments = result.segments;
    closeOsmPanel();
}