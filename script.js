const navbarHTML = `
<ul>
    <li class="list">
        <a href="index.html">
            <span class="icon home">
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M80 212v236a16 16 0 0016 16h96V328a24 24 0 0124-24h80a24 24 0 0124 24v136h96a16 16 0 0016-16V212" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256M400 179V64h-48v69" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>
            </span>
            <span class="text text-home">Home</span>
        </a>
    </li>
    <li class="list">
        <a href="projects.html">
            <span class="icon projects">
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><rect x="64" y="64" width="80" height="80" rx="40" ry="40" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><rect x="216" y="64" width="80" height="80" rx="40" ry="40" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><rect x="368" y="64" width="80" height="80" rx="40" ry="40" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><rect x="64" y="216" width="80" height="80" rx="40" ry="40" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><rect x="216" y="216" width="80" height="80" rx="40" ry="40" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><rect x="368" y="216" width="80" height="80" rx="40" ry="40" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><rect x="64" y="368" width="80" height="80" rx="40" ry="40" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><rect x="216" y="368" width="80" height="80" rx="40" ry="40" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><rect x="368" y="368" width="80" height="80" rx="40" ry="40" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>
            </span>
            <span class="text text-projects">Projects</span>
        </a>
    </li>
    <li class="list">
        <a href="about.html">
            <span class="icon about">
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><rect x="96" y="48" width="320" height="416" rx="48" ry="48" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M176 128h160M176 208h160M176 288h80"/></svg>
            </span>
            <span class="text text-about">About</span>
        </a>
    </li>
    <li class="list">
        <a href="contact.html">
            <span class="icon contact">
                <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><circle cx="128" cy="256" r="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="384" cy="112" r="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><circle cx="384" cy="400" r="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M169.83 279.53l172.34 96.94M342.17 135.53l-172.34 96.94"/></svg>
            </span>
            <span class="text text-contact">Contact</span>
        </a>
    </li>
    <li class="list list-switch">
        <label class="switch">
            <input id="mode-toggle" type="checkbox" checked>
            <span class="slider round"></span>
        </label>
    </li>
</ul>

`

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('body').style.opacity = 1
    // Select the placeholder element
    const navPlaceholder = document.getElementById('nav-placeholder');
    navPlaceholder.innerHTML = navbarHTML;

    const toggleSwitch = document.getElementById('mode-toggle');
    if (toggleSwitch.checked && localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        localStorage.setItem('dark-mode', 'enabled');
        changeColor('white');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('dark-mode', 'disabled');
        changeColor('black');
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
    // Check for saved mode in localStorage
    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.body.classList.add('dark-mode');
        toggleSwitch.checked = true;
        changeColor('white');
    }else{
        toggleSwitch.checked = false;
        changeColor('black');
    }
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
