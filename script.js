/* ---------------- CONFIG ---------------- */
const slides = [
  { src: "images/photo1.jpeg", caption: "THE FOAM ROOM" },
  { src: "images/photo2.jpeg", caption: "MIRROR INSTALLATION" },
  { src: "images/photo3.jpeg", caption: "ALUMINUM SERIES" }
];

// DOM
const track    = document.getElementById("track");
const caption  = document.getElementById("caption");

/* --------------- Build track (with clones for infinite loop) --------------- */
function makeSlide(data, extraClass = "") {
  const el = document.createElement("div");
  el.className = `slide ${extraClass}`.trim();
  el.style.backgroundImage = `url('${data.src}')`;
  el.dataset.caption = data.caption || "";
  return el;
}

track.innerHTML = "";
// leading clone of last, real slides, trailing clone of first
track.appendChild(makeSlide(slides[slides.length - 1], "clone"));
slides.forEach(s => track.appendChild(makeSlide(s)));
track.appendChild(makeSlide(slides[0], "clone"));

/* ---------------- State ---------------- */
let index = 1;                             // start at first real slide
let x = -index * window.innerWidth;        // current translateX
let isDown = false;
let startX = 0;
let lastTouchX = null;
let autoTimer = null;

function setTransform(px, animate = false) {
  track.style.transition = animate ? "transform .6s ease" : "none";
  track.style.transform = `translate3d(${px}px,0,0)`;
}
setTransform(x);
updateCaptionImmediate();

/* ---------------- Resize ---------------- */
window.addEventListener("resize", () => {
  x = -index * window.innerWidth;
  setTransform(x);
});

/* ---------------- Drag / Swipe ---------------- */
function pointerDown(clientX) {
  isDown = true; startX = clientX;
  track.classList.add("dragging");
  cancelAuto();
}
function pointerMove(clientX) {
  if (!isDown) return;
  const delta = clientX - startX;
  setTransform(x + delta);
}
function pointerUp(clientX) {
  if (!isDown) return;
  isDown = false; track.classList.remove("dragging");
  const delta = clientX - startX;
  const threshold = window.innerWidth * 0.15;
  if (delta < -threshold) goTo(index + 1);
  else if (delta > threshold) goTo(index - 1);
  else setTransform(x, true); // snap back
  startAuto();
}

// Mouse
track.addEventListener("mousedown", e => pointerDown(e.clientX));
window.addEventListener("mousemove", e => pointerMove(e.clientX));
window.addEventListener("mouseup",   e => pointerUp(e.clientX));

// Touch
track.addEventListener("touchstart", e => {
  lastTouchX = e.touches[0].clientX;
  pointerDown(lastTouchX);
}, { passive: true });
track.addEventListener("touchmove", e => {
  lastTouchX = e.touches[0].clientX;
  pointerMove(lastTouchX);
}, { passive: true });
track.addEventListener("touchend", () => pointerUp(lastTouchX ?? 0), { passive: true });

// Prevent default drag
track.addEventListener("dragstart", e => e.preventDefault());

/* ---------------- Navigation / Looping ---------------- */
function goTo(newIndex) {
  index = newIndex;
  x = -index * window.innerWidth;

  // start image transition
  setTransform(x, true);

  // fade out caption to sync with slide motion
  caption.classList.remove("fade-in");
  caption.classList.add("fade-out");

  // after the slide finishes, fix loop + update caption, then fade in
  track.addEventListener("transitionend", () => {
    // loop correction when landing on clones
    if (index === 0) {
      index = slides.length;
      x = -index * window.innerWidth;
      setTransform(x, false);
    } else if (index === slides.length + 1) {
      index = 1;
      x = -index * window.innerWidth;
      setTransform(x, false);
    }

    updateCaptionImmediate();             // set new text
    caption.classList.remove("fade-out");
    caption.classList.add("fade-in");
  }, { once: true });
}

function updateCaptionImmediate() {
  const realIdx = ((index - 1 + slides.length) % slides.length);
  caption.textContent = slides[realIdx].caption || "";
}

/* ---------------- Autoplay ---------------- */
function startAuto() {
  cancelAuto();
  autoTimer = setInterval(() => goTo(index + 1), 5000);
}
function cancelAuto() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}
startAuto();

/* ---------------- Keyboard (optional) ---------------- */
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") { cancelAuto(); goTo(index + 1); startAuto(); }
  if (e.key === "ArrowLeft")  { cancelAuto(); goTo(index - 1); startAuto(); }
});
