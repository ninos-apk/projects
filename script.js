document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('mode-toggle');

    // Check for saved mode in localStorage
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggleSwitch.checked = true;
    }

    toggleSwitch.addEventListener('change', function () {
        if (toggleSwitch.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'enabled');
            changeColor('white');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'disabled');
            changeColor('black');
        }
    });
});

changeColor = (color) =>{
const shapes = ['path', 'rect', 'circle'];
const svgs = document.querySelectorAll('svg');
// Loop through each SVG element
svgs.forEach(svg => {
    // Get all path elements inside the SVG
    
    for(const shape of shapes){
        const attrs = svg.querySelectorAll(shape);
        attrs.forEach(attr => {
            // Check if the path has a stroke attribute
            if (attr.getAttribute('stroke')) {
                // Change the stroke color to white
                attr.setAttribute('stroke', color);
            }
        });
    }
});

}
changeColor('black');