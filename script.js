// Get elements
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
let startTime;

// Clone first slide for seamless looping
const firstClone = slideElements[0].cloneNode(true);
slides.appendChild(firstClone);

// Show a specific slide
function showSlide(index) {
  slides.style.transition = "transform 1s ease";
  slides.style.transform = `translateX(-${index * 100}%)`;
  title.textContent = slideElements[index % totalSlides].dataset.title;
}

// Move to next slide
function nextSlide() {
  currentIndex++;
  showSlide(currentIndex);

  // If we've reached the cloned slide, jump back to start
  if (currentIndex === totalSlides) {
    setTimeout(() => {
      slides.style.transition = "none";
      currentIndex = 0;
      slides.style.transform = `translateX(0)`;
      title.textContent = slideElements[currentIndex].dataset.title;
    }, 1000); // matches transition time
  }
}

// Auto-slide every 5s
let interval = setInterval(nextSlide, 5000);

// Pause auto-slide
function pauseAutoSlide() {
  clearInterval(interval);
  interval = setInterval(nextSlide, 5000);
}

// Handle dragging/swiping start
function touchStart(index) {
  return function (event) {
    isDragging = true;
    startTime = Date.now();
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    slides.style.transition = "none";
  };
}

// Handle dragging/swiping move
function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

// Handle dragging/swiping end
function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;

  // If moved enough in one direction, change slide
  if (movedBy < -100) {
    currentIndex++;
  }
  if (movedBy > 100) {
    currentIndex--;
  }

  if (currentIndex < 0) currentIndex = totalSlides - 1;
  if (currentIndex >= totalSlides) currentIndex = 0;

  showSlide(currentIndex);
  prevTranslate = -currentIndex * window.innerWidth;
  pauseAutoSlide();
}

// Utility: Get X position from mouse or touch
function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

// Animation frame update for smooth dragging
function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

// Apply transform
function setSliderPosition() {
  slides.style.transform = `translateX(${currentTranslate}px)`;
}

// Event listeners
slides.addEventListener("click", () => {
  if (!isDragging) {
    nextSlide();
    pauseAutoSlide();
  }
});

slideElements.forEach((slide, index) => {
  const slideNode = slide;
  // Touch events
  slideNode.addEventListener("touchstart", touchStart(index));
  slideNode.addEventListener("touchmove", touchMove);
  slideNode.addEventListener("touchend", touchEnd);
  // Mouse events
  slideNode.addEventListener("mousedown", touchStart(index));
  slideNode.addEventListener("mousemove", touchMove);
  slideNode.addEventListener("mouseup", touchEnd);
  slideNode.addEventListener("mouseleave", () => {
    if (isDragging) touchEnd();
  });
});

// Initialize
showSlide(currentIndex);
