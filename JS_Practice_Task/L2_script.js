/* SLIDES WITH TITLE + SUBTITLE */
const slides = [
    {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        title: "Maldives",
        subtitle: "Crystal-clear waters and heaven-like serenity"
    },
    {
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        title: "Switzerland",
        subtitle: "Snowy Alps and beautiful landscapes"
    },
    {
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        title: "Iceland",
        subtitle: "Land of fire, ice, and adventure"
    },
    {
        url: "https://images.unsplash.com/photo-1526779259212-939e64788e3c",
        title: "Japan",
        subtitle: "Experience culture and cherry blossoms"
    }
];

let index = 0;
let sliderImage = document.getElementById("sliderImage");
let captionBox = document.getElementById("captionBox");
let captionTitle = document.getElementById("captionTitle");
let captionSubtitle = document.getElementById("captionSubtitle");
let dotsContainer = document.getElementById("dotsContainer");
let progressBar = document.getElementById("progress");
let slider = document.getElementById("slider");

/* CREATE DOTS */
slides.forEach((_, i) => {
    let dot = document.createElement("span");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
});

let dots = document.querySelectorAll(".dots span");

function showSlide(i) {
    sliderImage.style.opacity = "0";

    setTimeout(() => {
        sliderImage.src = slides[i].url;
        captionTitle.textContent = slides[i].title;
        captionSubtitle.textContent = slides[i].subtitle;
        sliderImage.style.transform = "scale(1.03)";
        captionBox.classList.remove("show");

        setTimeout(() => {
            sliderImage.style.opacity = "1";
            sliderImage.style.transform = "scale(1)";
            captionBox.classList.add("show");
        }, 200);
    }, 200);

    updateDots(i);
    restartProgressBar();
}

function updateDots(i) {
    dots.forEach(d => d.classList.remove("active-dot"));
    dots[i].classList.add("active-dot");
}

function next() {
    index = (index + 1) % slides.length;
    showSlide(index);
}

function prev() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
}

function goToSlide(i) {
    index = i;
    showSlide(i);
}

document.getElementById("nextBtn").addEventListener("click", next);
document.getElementById("prevBtn").addEventListener("click", prev);

/* AUTO TIMER WITH PROGRESS BAR */
let auto = setInterval(next, 3000);

function restartProgressBar() {
    progressBar.style.width = "0%";
    setTimeout(() => progressBar.style.width = "100%", 20);
}

/* Pause on hover */
slider.addEventListener("mouseenter", () => {
    clearInterval(auto);
    progressBar.style.width = "0%";
});

slider.addEventListener("mouseleave", () => {
    auto = setInterval(next, 3000);
    restartProgressBar();
});

/* Keyboard */
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
});

/* Touch swipe */
let startX = 0;

slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
});

slider.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) next();
    if (endX - startX > 50) prev();
});

/* Parallax Light Effect */
slider.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    slider.style.setProperty("--x", `${x}px`);
    slider.style.setProperty("--y", `${y}px`);
});

/* Initial load */
showSlide(index);
restartProgressBar();
