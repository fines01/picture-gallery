// Global variables
let pictures = [];
let galleryInterval;
// Variable to change image-size view, default view is "M" ((Desktop- Add mediaqueries for mobile).
let sizeView = 'm';

// Get file-names from file "img" and store the values in "pictures". (if possible & how?)
getImages();

// HTML templates

function pictureBoxTemplate(i) {
    return /*html*/ `
        <div class="picture-box">
            <img src="${pictures[i]}" alt="" class="gallery-picture ${sizeView}" onclick="openPictureView(${i})" >
        </div>
    `;
}

function galleryViewTemplate(i) {
    return /*html*/ `
        <div class="overlay-card">
            <img onclick="previousPicture(${i})" class="icon" src="img/arrow-left.png" alt="previous picture icon" id="previous">
            <img class="" src="${pictures[i]}" alt="" id="picture">
            <img onclick="nextPicture(${i})" class="icon" src="img/arrow-right.png" alt="next picture icon" id="next">
        </div>
        <div class="control-buttons">
            <img onclick="diashowBackwards(${i-1})" class="icon" src="img/play-backwards.png" alt="play gallery backwards button">
            <img onclick="stopDiashow()" class="icon" src="img/square.png" alt="stop gallery button">
            <img onclick="diashowForwards(${i+1})" class="icon" src="img/play-forwards.png" alt="play gallery forward button">
        </div>
    `;
}

// Function render() executes on load of the body
function render() {
    let gallery = document.getElementById('gallery');
    // clear inner HTML
    gallery.innerHTML = '';
    // iterate through "pictures" and generate HTML
    for (let i = 0; i < pictures.length; i++) {
        gallery.innerHTML += pictureBoxTemplate(i);
    }
}

// get pictures from folder "gallery" and save them in array "pictures"
// (because of laziness: pictures in gallery folder are named 1 - n.png. r.n.)
function getImages() {
    for (let i = 1; i < 28; i++) {
        pictures.push(`img/gallery/${i}.jpg`);
    }
}

// open picture (and gallery-view)
function openPictureView(i) {
    let bg = document.getElementById('overlay');
    // show overlay
    overlay.classList.remove('toggle-element');
    overlay.innerHTML = galleryViewTemplate(i);
}

function closePictureView() {
    document.getElementById('overlay').classList.add('toggle-element');
    stopDiashow();
}

// Change size - view
function changeImgSize(size) {
    // A: (Option: size direkt als [px] zahl ??bergeben)
    // B: via extra Klassen
    sizeView = size;
    render();
}

function nextPicture(i) {
    // stop propagation--> prevent click event from outer/parent element to take place (close overlay)
    if (event) { // event: bei click-event ??bergeben, aber zB bei callback Aufruf der Funktion nicht
        event.stopPropagation(); //"event is deprecated", alternative? 
        // Solution: https://stackoverflow.com/questions/58341832/event-is-deprecated-what-should-be-used-instead addEventListener() Funktion zu einem spezifischen Element hinzuf??gen und event-Parameter ??bergeben.
    }
    // open next picture
    if (i >= pictures.length - 1) {
        i = 0;
    } else {
        i++;
    }
    openPictureView(i);
    return i;
}

function previousPicture(i) {
    if (event) { // event: see above
        event.stopPropagation();
    }
    // open previous picture
    if (i <= 0) {
        i = pictures.length - 1;
    } else {
        i--;
    }
    openPictureView(i);
    return i;
}

function diashowForwards(i = 0) {
    event.stopPropagation();
    // only one interval should be running at a time, stop intervals that are already running.
    stopDiashow();
    // open selected target image (default = 0)
    openPictureView(i);
    galleryInterval = setInterval(
        function () {
            i = nextPicture(i); // 
        } ,2000);
}

function diashowBackwards(i) {
    event.stopPropagation();
    stopDiashow();
    openPictureView(i);
    // set interval and assign it to a variable so that it can be targeted (&cleared) later 
    galleryInterval = setInterval(
        function () {
            i = previousPicture(i);
        }, 2000);
}

function stopDiashow() {
    // prevent click-event from overlay
    event.stopPropagation();
    //clear interval
    window.clearInterval(galleryInterval);
}

function setActiveLink(x){
    let links = document.getElementsByClassName('resize-link');
    for(let i =0; i< links.length; i++) {
        links[i].classList.remove('active-link');
    }
    links[x].classList.add('active-link');
}

function toggleMenu() {
    let navbar = document.getElementById('navbar');
    navbar.classList.toggle('show-responsive-menu');
}

// JavaScript media queries

// create conditions that target certain viewports
let mediaQueryS = window.matchMedia('(max-width: 800px)');
let mediaQueryM = window.matchMedia('(max-width: 1100px)');
//let mediaQueryL = window.matchMedia('(min-width: 1300px)');
// add event listeners with callback
mediaQueryS.addEventListener('change', function() {
     if (mediaQueryS.matches) {
         setActiveLink(0);
         changeImgSize('s');
     } 
     else if (mediaQueryM.matches) {
        setActiveLink(1);
        changeImgSize('m');
    } 
});
// Problem: changes only on resize

