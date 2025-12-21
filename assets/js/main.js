document.addEventListener("DOMContentLoaded", () => {
  loadBackToTop();

  const isFirstVisit = !sessionStorage.getItem("visited");
  if (isFirstVisit) {
    document.body.classList.add("loading");
    injectLoader();
    sessionStorage.setItem("visited", "true");
  }
});

function loadBackToTop() {
  if (document.getElementById("backToTop")) return;

  fetch("../../partials/back_to_top.html")
    .then((res) => res.text())
    .then((html) => {
      document.body.insertAdjacentHTML("beforeend", html);
      initBackToTop();
    })
    .catch((err) => {
      console.error("BackToTop load error", err);
    });
}
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  const isMobile = window.innerWidth <= 786;
  const isShortPage = document.body.scrollHeight < window.innerHeight * 1.5;

  // Desktop
  if (!isMobile && isShortPage) {
    btn.remove();
    return;
  }
  const scrollTrigger = isMobile ? 200 : 400;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > scrollTrigger);
  });
  btn.addEventListener("click", () => {
    btn.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      btn.classList.remove("active");
    }, 300);
  });
}

// =========== LOAD PAGE LOADER ==============
function injectLoader() {
  fetch("../../partials/loader.html")
    .then((res) => res.text())
    .then((html) => {
      document.body.insertAdjacentHTML("afterbegin", html);
      requestAnimationFrame(() => {
        starRealProgress();
      });
    });
}
let progress = 0;
function starRealProgress() {
  const circle = document.querySelector(".circle-progress");
  const percenText = document.getElementById("progress-percent");
  const circumference = 502;
  const interval = setInterval(() => {
    progress += Math.random() * 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      finishLoading();
    }
    const offset = circumference - (progress / 100) * circumference;
    circle.style.strokeDashoffset = offset;
    percenText.textContent = `${Math.floor(progress)}%`;
  }, 120);
}
function finishLoading() {
  setTimeout(() => {
    hideLoader();
  }, 500);
}
// hidden loader
function hideLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  loader.classList.add("hidden");
  document.body.classList.remove("loading");

  setTimeout(() => {
    loader.remove();
  }, 600);
}
