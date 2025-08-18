const slides = document.querySelector('.slides');
const slideElements = document.querySelectorAll('.slide');
const title = document.getElementById('picture-title');

let currentIndex = 0;
let totalSlides = slideElements.length;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;

// Clone first slide for seamless looping
const firstClone = slideElements[0].cloneNode(true);
slides.appendChild(firstClone);

function showSlide(index) {
  slides.style.transition = "transform 1s ease";
  slides.style.transform = `translateX(-${index * 100}%)`;
  title.textContent = slideElements[index % totalSlides].dataset.title;
}

function nextSlide() {
  currentIndex++;
  showSlide(currentIndex);

  if (currentIndex === totalSlides) {
    setTimeout(() => {
      slides.style.transition = "none";
      currentIndex = 0;
      slides.style.transform = `translateX(0)`;
      title.textContent = slideElements[currentIndex].dataset.title;
    }, 1000);
  }
}

let interval = setInterval(nextSlide, 5000);
function pauseAutoSlide() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 5000);
}

// Drag/Swipe helpers
function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}
function touchStart() {
  return function (event) {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    slides.style.transition = "none";
  };
}
function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}
function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100) currentIndex++;
  if (movedBy > 100) currentIndex--;

  if (currentIndex < 0) currentIndex = totalSlides - 1;
  if (currentIndex >= totalSlides) currentIndex = 0;

  showSlide(currentIndex);
  prevTranslate = -currentIndex * window.innerWidth;
  pauseAutoSlide();
}
function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}
function setSliderPosition() {
  slides.style.transform = `translateX(${currentTranslate}px)`;
}

// Listeners
slides.addEventListener("click", () => { if (!isDragging) { nextSlide(); pauseAutoSlide(); }});
slideElements.forEach((slide, index) => {
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchmove", touchMove);
  slide.addEventListener("touchend", touchEnd);
  slide.addEventListener("mousedown", touchStart(index));
  slide.addEventListener("mousemove", touchMove);
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mouseleave", () => { if (isDragging) touchEnd(); });
});

// Init
showSlide(currentIndex);
