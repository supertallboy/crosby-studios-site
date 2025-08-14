// Get elements
const slides = document.querySelector('.slides');
const slideElements = document.querySelectorAll('.slide');
const title = document.getElementById('picture-title');

let currentIndex = 0;
let totalSlides = slideElements.length;

// Clone first slide for smooth looping
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

  // If we've reached the cloned slide, jump back to start
  if (currentIndex === totalSlides) {
    setTimeout(() => {
      slides.style.transition = "none";
      currentIndex = 0;
      slides.style.transform = `translateX(0)`;
      title.textContent = slideElements[currentIndex].dataset.title;
    }, 1000); // matches the CSS transition time
  }
}

// Auto-slide every 5s
let interval = setInterval(nextSlide, 5000);

// Click anywhere on slides to advance
slides.addEventListener('click', () => {
  clearInterval(interval); // pause auto-slide
  nextSlide();
  interval = setInterval(nextSlide, 5000); // resume auto-slide
});
