function getProjectFromURL() {
  return (
    new URLSearchParams(window.location.search).get("id") ||
    new URLSearchParams(window.location.search).get("pid")
  );
}
// =========================== HERO PROJECT ===========================
window.renderProjectHero = function () {
  const projects = siteData && siteData.projects ? siteData.projects : [];

  const id = getProjectFromURL();
  if (!id || projects.length === 0) return;
  const project = projects.find((p) => p.id === id || p.slug === id);
  if (!project) return;

  // cover image
  const heroImage = document.getElementById("hero-cover");

  if (heroImage && project.heroImage) {
    heroImage.style.backgroundImage = `url('${project.heroImage}')`;
  }

  // meta & title & subtitle
  const metaEl = document.getElementById("project-meta");
  if (metaEl)
    metaEl.textContent = [
      project.client || project.company,
      project.category || project.type,
    ]
      .filter(Boolean)
      .join(" . ");

  const titleEl = document.getElementById("project-title");
  if (titleEl) titleEl.textContent = project.title || "Untitled project";

  const subEl = document.getElementById("project-subtitle");
  if (subEl) subEl.textContent = project.subtitle || project.tagline || "";

  // tags
  const techEl = document.getElementById("project-tags");
  if (techEl) techEl.innerHTML = "";
  (project.tech || []).forEach((t) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = t;
    techEl.appendChild(span);
  });

  // quick info
  const clientEl = document.getElementById("project-client");
  if (clientEl)
    clientEl.textContent = project.details.client || project.company || "-";
  const dateEl = document.getElementById("project-data");
  if (dateEl) dateEl.textContent = project.details.date || project.year || "-";
  const catEl = document.getElementById("project-category");
  if (catEl)
    catEl.textContent = project.details.category || project.type || "-";

  // CTAs
  const live = document.getElementById("viewLive-btn");
  if (live) {
    if (project.links.liveDemo) {
      live.href = project.links.liveDemo;
      live.removeAttribute("aria-hidden");
      live.style.display = "";
    } else {
      live.style.display = "none";
    }
  }

  const source = document.getElementById("viewSource-btn");
  if (source) {
    if (project.links.sourceCode) {
      source.href = project.links.sourceCode;
      source.style.display = "";
    } else {
      source.style.display = "none";
    }
  }
  renderProjectOverview(project);
  renderScreenshots(project);
  renderFeatures(project);
  renderClallenges(project);
  renderWhatILearned(project);
  renderProjectCTA(project);
};

// ========================== PROJECT OVERVIEW =========================
function renderProjectOverview(project) {
  if (!project) return;

  // overview text
  const overviewEl = document.getElementById("projectOverview");

  if (overviewEl) {
    overviewEl.textContent = project.overview || "No Overview available";
  }

  // details
  const detailsEl = document.getElementById("projectDetails");
  if (!detailsEl || !project.details) return;
  detailsEl.innerHTML = ""; // clean first

  Object.entries(project.details).forEach(([key, value]) => {
    const li = document.createElement("li");
    li.className = "detail-item";
    li.innerHTML = `
        <span class ="details-key">${key}</span>
        <span class="details-value">${value}</span>
    `;
    detailsEl.appendChild(li);
  });
}
// ========================== PROJECT SCREENSHOTS ======================
function renderScreenshots(project) {
  const shots = project.screenshots;
  if (!shots || shots.length === 0) {
    grid.innerHTML = `
      <p class="no-shots-msg">No screenshots available for this project.</p>
    `;
    return;
  }
  const screenshotsWrapper = document.getElementById("screenshots-wrapper");

  shots.forEach((shot, index) => {
    const item = `
      <div class = "swiper-slide">
        <a href="${shot.src}" class="glightbox" data-gallery="screen-gallery" data-title="${shot.caption}">
          <div class="shot-item">
            <img src="${shot.src}" alt="${shot.caption}" >
            <div class="shot-overlay">
            <i class="zoom-icon fa-solid fa-magnifying-glass-plus"></i>
            </div>
          </div>
        </a>
      </div>
    `;
    screenshotsWrapper.insertAdjacentHTML("beforeend", item);
  });

  window.gallery = GLightbox({
    selector: ".glightbox",
    loop: true,
    touchNavigation: true,
    openEffect: "zoom",
    zoomable: true,
    draggable: true,
    preload: true,
    openEffect: "zoom",
    closeEffect: "fade",
    slideEffect: "slide",

    moreText: "",
  });
  gallery.on("open", () => {
    const container = document.querySelector(".glightbox-container");

    if (!container) return;

    let counter = container.querySelector(".glightbox-counter");

    if (!counter) {
      counter = document.createElement("div");
      counter.className = "glightbox-counter";
      container.appendChild(counter);
    }

    const total = gallery.elements.length;
    counter.textContent = `1 \ ${total}`;
  });
  gallery.on("slide_changed", ({ current }) => {
    const counter = document.querySelector(
      ".glightbox-container .glightbox-counter"
    );

    if (!counter) return;

    const index = current.index + 1;
    const total = gallery.elements.length;
    counter.textContent = `${index} / ${total}`;
  });
}
// ========================== FEATURES =================================
function renderFeatures(project) {
  const featuresGrid = document.getElementById("features-grid");

  // Safety check
  if (!featuresGrid || !project.features || project.features.length === 0) {
    return;
  }

  // Clear previous content
  featuresGrid.innerHTML = "";

  // Icon map (UI controlled)
  const featuresIcons = [
    "fas fa-magic",
    "fas fa-moon",
    "fas fa-layer-group",
    "fas fa-search",
    "fas fa-mobile-alt",
  ];

  //  Loop through features
  project.features.forEach((featuresText, index) => {
    const iconClass =
      featuresIcons[index] || featuresIcons[featuresIcons.length - 1];

    const featureItem = document.createElement("div");
    featureItem.className = "feature-item";
    featureItem.innerHTML = `
        <div class="feature-icon">
        <i class="${iconClass}"></i>
        </div>
        <div class="feature-content">
          <h4 class="feature-content-title">${featuresText}</h4>
        </div>
      `;
    featuresGrid.appendChild(featureItem);
  });
}
// ========================== CHALLENGES ===============================
function renderClallenges(project) {
  const challengesSection = document.getElementById("project-challenges");
  const challengesList = document.getElementById("challenges-list");
  if (
    !challengesSection ||
    !challengesList ||
    !project.challenges ||
    project.challenges.length === 0
  ) {
    // Hide section if no challenges
    if (challengesSection) {
      challengesSection.style.display = "none";
    }
    return;
  }
  // clear previous content
  challengesList.innerHTML = "";
  // loop through challenges
  project.challenges.forEach((challengesText) => {
    const li = document.createElement("li");
    li.className = "challenge-item";
    li.textContent = challengesText;
    challengesList.appendChild(li);
  });
}
// ========================== WHAT I LEARNED ===============================
function renderWhatILearned(project) {
  const learnedSection = document.getElementById("project-learned");
  const learnedList = document.getElementById("learned-list");
  if (
    !learnedSection ||
    !learnedList ||
    !project.whatILearned ||
    project.whatILearned.length === 0
  ) {
    if (learnedSection) {
      learnedSection.style.display = "none";
    }
    return;
  }
  learnedList.innerHTML = "";
  project.whatILearned.forEach((learnedText) => {
    const li = document.createElement("li");
    li.className = "learned-item";
    li.textContent = learnedText;

    learnedList.appendChild(li);
  });
}
//  ========================== BOTTOM CTA ======================
function renderProjectCTA(project) {
  const ctaSection = document.getElementById("project-cta");
  const ctaAction = document.getElementById("project-cta-action");

  if (!ctaSection || !ctaAction) return;
  const links = project.links || {};

  let hasAnyAction = false;

  ctaAction.innerHTML = "";

  // view live
  if (links.liveDemo) {
    const liveBtn = document.createElement("a");
    liveBtn.href = links.liveDemo;
    liveBtn.target = "_blank";
    liveBtn.rel = "noopener";
    liveBtn.className = "cta-btn";
    liveBtn.textContent = "View Live";

    ctaAction.appendChild(liveBtn);
    hasAnyAction = true;
  }

  // source code
  if (links.sourceCode) {
    const sourceBtn = document.createElement("a");
    sourceBtn.href = links.sourceCode;
    sourceBtn.target = "_blank";
    sourceBtn.rel = "noopener";
    sourceBtn.className = "cta-btn";
    sourceBtn.textContent = "source Code";

    ctaAction.appendChild(sourceBtn);
    hasAnyAction = true;
  }

  // Back to projcets (internal link)
  const backBtn = document.createElement("a");
  backBtn.href = "../projects/projects.html";
  backBtn.className = "cta-btn";
  backBtn.textContent = "Back To Projects";

  ctaAction.appendChild(backBtn);
  hasAnyAction = true;

  // Hide Section if Nothing to show
  if (!hasAnyAction) {
    ctaSection.style.display = "none";
  }

  if (typeof AOS !== "undefined") {
    requestAnimationFrame(() => {
      setTimeout(() => {
        AOS.refresh();
      }, 50);
    });
  }
}

new Swiper(".screenshots-swiper", {
  loop: true,
  rewind: true,
  grabCursor: true,
  slidesPerView: 1.2,
  centeredSlides: true,
  spaceBetween: 24,
  speed: 800,

  resistanceRatio: 0.6,
  watchSlidesProgress: true,
  autoplay: {
    delay: 3000,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  breakpoints: {
    0: { slidesPerView: 1 },
    480: { slidesPerView: 1 },
    640: { slidesPerView: 1.5 },
    768: { slidesPerView: 2 },
    1024: { slidesPerView: 2.2 },
  },
  on: {
    init() {
      const swiperEl = this.el;

      swiperEl.addEventListener("mouseenter", () => {
        this.autoplay.stop();
      });

      swiperEl.addEventListener("mouseleave", () => {
        this.autoplay.start();
      });
    },
  },
});

AOS.init({
  duration: 1500,
  once: true,
  easing: "ese-out-cubic",
});
