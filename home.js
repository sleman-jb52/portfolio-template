window.initHome = async function () {
  const homeData = window.siteData.home;
  // ================== HERO =====================
  const hero = homeData;
  document.getElementById("hero-img").src = hero.image;
  document.getElementById("hero-description").textContent = hero.description;

  document.querySelector(".hero-image").style.opacity = "0";
  document.querySelector("#hero-description").style.opacity = "0";
  document.querySelector(".hero-buttons").style.opacity = "0";

  await typeWriterEffect(document.getElementById("hero-name"), hero.name, 90);
  await typeWriterEffect(document.getElementById("hero-role"), hero.role, 100);

  document.querySelector(".hero-image").style.transition = "1s";
  document.querySelector("#hero-description").style.transition = "2s";
  document.querySelector(".hero-buttons").style.transition = "3s";

  setTimeout(() => {
    document.querySelector(".hero-image").style.opacity = "1";
    document.querySelector("#hero-description").style.opacity = "1";
    document.querySelector(".hero-buttons").style.opacity = "1";
  }, 300);

  // ======================== WRITING EFFECTS FUNCTION ======================

  function typeWriterEffect(element, text, speed = 100) {
    let i = 0;
    element.textContent = "";
    const interval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);
  }

  // ================== INJECT TOP PROJECT =====================

  const projects = homeData.topProjects;
  const containerTopProject = document.getElementById("topProjectsContainer");
  containerTopProject.innerHTML = "";
  projects.forEach((project, index) => {
    const isLastOdd =
      projects.length % 2 !== 0 && index === projects.length - 1;
    const aosDirection = isLastOdd
      ? "fade-up"
      : index % 2 === 0
      ? "fade-right"
      : "fade-left";
    const extraClass = isLastOdd ? "full-width" : "";

    const card = `
            <div class="project-card ${extraClass}" data-aos="${aosDirection}">
                <img src="${project.image}" alt="${project.title}" />
                  <div class="project-info-overlay">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-tech">${project.tech}</p>
                    <div class="icons">
                   ${
                     project.link
                       ? ` <a href="${project.link}" target="_blank" title="View Project"><i class="fas fa-link"></i>view project</a>`
                       : ""
                   }
                   ${
                     project.source
                       ? ` <a href="${project.link}" target="_blank" title="View Code"><i class="fab fa-github"></i>view Code</a>`
                       : ""
                   }
                    </div>
                </div>
            </div>
    
    `;

    containerTopProject.innerHTML += card;
  });

  // =============== INJECT MY SKILLS ==============

  const skills = window.siteData.mySkills;
  const containerMySkills = document.querySelector(".skills-flex");
  containerMySkills.innerHTML = "";

  skills.forEach((skill, index) => {
    const count = skills.length;
    let aosDirection = "zoom-in";
    let delay = "";

    if (count <= 3) {
      if (index === 0) aosDirection = "fade-right";
      else if (index == count - 1) aosDirection = "fade-left";
      else aosDirection = "zoom-in";
    }

    if (count >= 4) {
      if (index === 0) aosDirection = "fade-right";
      else if (index == count - 1) aosDirection = "fade-left";
      else {
        aosDirection = "zoom-in";
        delay = "400";
      }
    }

    const card = `
                  <div class = "skill-card" data-aos="${aosDirection}" data-aos-delay="${delay}">
                    <div class="info-card">
                        <i class= "skill-icon ${skill.icon}"></i>
                        <span class="skill-name">${skill.name}</span>
                    </div>
                  </div>
    `;
    containerMySkills.innerHTML += card;
  });

  // =============== TESTIMONIALS ==============

  const testimonials = window.siteData.testimonials;
  const containerTestimonials = document.querySelector(".swiper-wrapper");
  containerTestimonials.innerHTML = "";
  testimonials.forEach((t) => {
    containerTestimonials.innerHTML += `
                        <div class = "swiper-slide">
                          <div class = "testimonial-card">
                            <img src = "${t.image}" alt = "${t.name}" />
                            <p>"${t.feedback}"</p>
                            <h4>${t.name}</h4>
                            <span class = "client-role">${t.role}</span>
                          </div>
                        </div>
    
    `;
  });

  // =========================== FLOATING PARTICLES   ========================

  const canvas = document.getElementById("particles-bg");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector(".cta-section").offsetHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(79,70,229,0.6)";
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
};

// ============== ANYMATION ON SCROLL ============
AOS.init({
  duration: 1500,
  once: true,
});

// ============== INITIALIZE SWIPER ==============

new Swiper(".mySwiper", {
  loop: false,
  speed: 800,
  spaceBetween: 30,

  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  coverflowEffect: {
    rotate: 40,
    stretch: 0,
    depth: 150,
    modifier: 1.5,
    slideShadows: true,
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
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
