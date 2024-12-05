document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('body').style.opacity = 1
    const links = document.querySelectorAll('.nav-link');
    const contentDiv = document.getElementById('content');
    function loadContent(link) {

        // Remove styles from previously clicked link
        links.forEach(otherLink => {
            otherLink.querySelector('.icon').style = '';
            otherLink.querySelector('.text').style = '';
        });
        // Apply styles for the clicked link
        link.querySelector('.icon').style.transform = 'translateY(-25px)';
        link.querySelector('.text').style.opacity = 1;

        const url = link.getAttribute('href'); // Get the hash from the link
        window.location.hash = url;
        // Fetch the content of the target page
        fetch(url)
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.text();
            })
            .then(data => {
            contentDiv.innerHTML = data; // Replace the content
            if(url === 'home.html'){
                buildCalendar(contentDiv.querySelector('#calendar'));
            }
            })
            .catch(error => {
            console.error('Error fetching the page:', error);
            contentDiv.innerHTML = '<p>Sorry, something went wrong!</p>';
            });
    }

    links.forEach(link => {
        link.addEventListener('click', event => {
        event.preventDefault(); // Prevent the default navigation
        loadContent(link);
        });
    });

    const hash = window.location.hash.slice(1) || 'home.html'; // Get the hash from the URL
    loadContent(document.querySelector(`a[href="${hash}"]`));
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
