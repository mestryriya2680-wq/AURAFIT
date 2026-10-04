let currentSlide = 0;

const slides = document.querySelectorAll(".slide");
const nextButton = document.querySelector(".next-btn");

function nextSlide() {

    // current slide hide
    slides[currentSlide].classList.remove("active");

    // next slide
    currentSlide = currentSlide + 1;

    // last slide नंतर first slide
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    }

    // next slide show
    slides[currentSlide].classList.add("active");
}


    

