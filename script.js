// Global variables
let pictures = [];
let galleryInterval;
// Variable to change image-size view, default view is "M" ((Desktop- Add mediaqueries for mobile).
let sizeView = 'm';

// Get file-names from file "img" and store the values in "pictures". (if possible & how?)
getImages();

// Function render() executes on load of the body
function render() {
    let gallery = document.getElementById('gallery');

    // clear inner HTML
    gallery.innerHTML = '';

    // iterate through "pictures" and generate HTML
    for (let i = 0; i < pictures.length; i++) {
        // function pictureBoxTemplate()
        gallery.innerHTML += /*html*/ `
        <div class="picture-box">
            <img src="${pictures[i]}" alt="" class="gallery-picture ${sizeView}" onclick="openPictureView(${i})" >
        </div>
        `;
    }
}

// vorläufige Funktion zum ausprobieren (later: get img names from folder if possible?)
function getImages() {
    for (let i = 1; i < 28; i++) {
        pictures.push(`img/gallery/${i}.jpg`);
    }
}

// open picture (and gallery-view)
function openPictureView(i) {
    let bg = document.getElementById('overlay');
    // show Overlay
    overlay.classList.remove('toggle-element');

    // generate HTML --> function galleryViewTemplate()
    overlay.innerHTML = /*html*/ `
        <div class="overlay-card">
            <img onclick="previousPicture(${i})" class="icon" src="img/arrow-left.png" alt="next picture icon" id="previous">
            <img class="" src="${pictures[i]}" alt="" id="picture">
            <img onclick="nextPicture(${i})" class="icon" src="img/arrow-right.png" alt="previous picture icon" id="next">
        </div>
        <div class="control-buttons">
            <img onclick="galleryPlayBackward(${i-1})" class="icon" src="img/play-backwards.png" alt="play gallery backwards button">
            <img onclick="stopGalleryRun()" class="icon" src="img/square.png" alt="stop gallery btuuon">
            <img onclick="galleryPlayForward(${i+1})" class="icon" src="img/play-forwards.png" alt="play gallery forward button">
        </div>
    `;
}

function closePictureView() {
    document.getElementById('overlay').classList.add('toggle-element');
    stopGalleryRun();
}

// Change size - view
function changeImgSize(size) {
    // A: (Option: size direkt als [px] zahl übergeben)
    // B: via extra Klassen
    sizeView = size;
    render();
}

function nextPicture(i) {
    // stop propagation? prevent click event from outer/parent element to take place (close overlay)
    if (event) { // event: bei click-event übergeben, aber bei automatischem Aufruf der Funktion nicht
        event.stopPropagation(); //"event is deprecated", but what would be the alternative? 
        // Solution: https://stackoverflow.com/questions/58341832/event-is-deprecated-what-should-be-used-instead addEventListener() Funktion zu einem spezifischen Element hinzufügen und event-Parameter übergeben.
    }

    // open next picture
    if (i >= pictures.length - 1) {
        i = 0;
    } else {
        i++;
    }
    openPictureView(i); // Prf? Da overlay auch wieder wieder bearbeitet wird (classList.add etc. zum Einblenden) in zwei Funktionen unterteilen?
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

function galleryPlayForward(i = 0) {
    event.stopPropagation();
    // only one interval should be running at a time, stop intervals that are already running.
    stopGalleryRun();
    // open selected target image (default = 0)
    openPictureView(i);

    galleryInterval = setInterval(
        function () {
            i = nextPicture(i); // i as updated and returned from function "nextPicture()"
        } ,2000);
}

function galleryPlayBackward(i) {
    event.stopPropagation();
    stopGalleryRun();
    openPictureView(i);

    // set interval and assign it to a variable so that it can be targeted (&cleared) later 
    galleryInterval = setInterval(
        function () {
            i = previousPicture(i);
        }, 2000);
}

function stopGalleryRun() {
    // prevent click-event from overlay
    event.stopPropagation(),
    //clear interval
    window.clearInterval(galleryInterval);
}

// ToDo: Denglisch beheben, Kommentare, aufräumen