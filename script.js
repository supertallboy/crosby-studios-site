const slides = document.querySelector('.slides');
const slideElements = document.querySelectorAll('.slide');
const title = document.getElementById('picture-title');

let currentIndex = 0;
let totalSlides = slideElements.length;

// Update title initially
title.textContent = slideElements[currentIndex].dataset.title;

function showSlide(index) {
  slides.style.transform = `translateX(-${index * 100}%)`;
  title.textContent = slideElements[index].dataset.title;
}

// Auto-slide every 5 seconds
setInterval(() => {
  currentIndex = (currentIndex + 1) % totalSlides;
  showSlide(currentIndex);
}, 5000);

// Click to advance
slides.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % totalSlides;
  showSlide(currentIndex);
});
