// =====================================
// Personal Info : labels + icons
// =====================================
const personalLabels = {
  fullName: "Full Name",
  role: "Role",
  location: "Location",
};
const personalIcons = {
  location: "fas fa-map-marker-alt",
  experience: "fas fa-briefcase",
  languages: "fas fa-language",
  freelance: "fas fa-user-check",
  email: "fas fa-envelope",
  phone: "fas fa-phone",
};
// ============== ABOUT ME ===============

window.initAbout = async function () {
  let aboutData = null;
  if (window.siteData && window.siteData.about) {
    aboutData = window.siteData.about;
  } else {
    try {
      const res = await fetch("../data.json");
      const json = await res.json();
      aboutData = json.about || null;
    } catch (e) {
      console.warn("Failed to load data.json for About:", e);
    }
  }

  // DOM refs
  const introEl = document.getElementById("about-intro");
  const avatarEl = document.getElementById("about-avatar");
  const cvBtn = document.getElementById("cv-btn");

  if (!aboutData) {
    if (introEl) introEl.textContent = "About data not found.";
    return;
  }

  // fill intro
  if (introEl) {
    introEl.textContent = aboutData.intro || "";
  }

  // avatar
  if (avatarEl && aboutData.avatar) {
    avatarEl.src = aboutData.avatar;
  }

  // cv link
  if (cvBtn && aboutData.cvlink) {
    cvBtn.href = aboutData.cvlink;
  }

  renderPersonalInfo(aboutData);
  renderCoreSkills(aboutData);
  renderExperience(aboutData);
  renderAchievements(aboutData);
  renderCertifications(aboutData);
  renderPhilosophy(aboutData);
};
// ============== PERSONAL INFO ===============
function renderPersonalInfo(aboutData) {
  const info = aboutData.personalInfo;
  const grid = document.getElementById("personal-grid");
  grid.innerHTML = "";

  Object.entries(info).forEach(([pKey, pValue]) => {
    const iconClass = personalIcons[pKey];

    grid.innerHTML += `
                          <div class=info-box>
                            <i class = "${iconClass}"></i>
                             <div class = "details">
                               <span class="label">${pKey}</span>
                               <span class ="value">${pValue}</span>
                             </div>
                          </div>
    `;
  });
}

// ============== CORE SKILLS ===============
function renderCoreSkills(aboutData) {
  const skillsData = aboutData.skills;
  if (!skillsData) return;

  const wrapper = document.querySelector(".skills-groups");
  wrapper.innerHTML = "";

  Object.entries(skillsData).forEach(([groupName, skillsArray], index) => {
    if (!skillsData || skillsArray.length === 0) return;

    wrapper.innerHTML += `
                   <div class="skill-group">
              <h4 class="skill-group-title">${groupName}</h4>
              <ul class="skill-list">
                ${skillsArray.map((skill) => `<li>${skill}</li>`).join("")}
              </ul>
              </div>
    `;
  });
}

// ============== EXPERIENCE ===============
function renderExperience(aboutData) {
  if (!aboutData || !aboutData.experience) return;
  const timeline = document.getElementById("experience-timeline");
  timeline.innerHTML = "";
  aboutData.experience.forEach((exp, index) => {
    const side = index % 2 === 0 ? "left" : "right";
    const aosCard = index % 2 === 0 ? "fade-right" : "fade-left";
    const card = `
        <div class="timeline-item ${side}" data-aos="${aosCard}">
          <div class = "timeline-dot"></div>
          <div class ="timeline-card">
            <div class="exp-header">
              <img src="${exp.logo}" alt="${exp.company}" class="exp-logo" />
            </div>
              <h4 class="exp-role">${exp.role}</h4>
              <span class="exp-company">${exp.company}</span>
              <p class="exp-summary">${exp.summary}</p>
              <ul class="exp-details">${exp.details
                .map((d) => `<li><i class="fas fa-check"></i>${d}</li>`)
                .join("")}</ul>
          </div>
        </div>
    `;
    timeline.innerHTML += card;
  });
}

// ============== ACHIEVEMENTS ===============

// ============= Splits a given string into a numeric part and a text part ========
function splitNumberAndText(input) {
  const raw = String(input).trim();

  // text only without numbers
  if (!/\d/.test(raw)) {
    return { number: raw, text: "" };
  }
  const match = raw.match(/^(\d+)([kKmM+]?)(.*)$/);

  if (!match) {
    return { number: raw, text: "" };
  }
  let number = match[1];
  let suffix = match[2];
  let text = match[3].trim();

  if (/^[kKmM]$/.test(suffix)) {
    suffix = suffix.toUpperCase();
  }

  let finalNumber = number;

  if (suffix === "+") {
    finalNumber += "+";
  }

  if (suffix === "K" || suffix === "M") {
    text = (suffix + " " + text).trim();
  }

  return {
    number: finalNumber,
    text: text,
  };
}

function renderAchievements(aboutData) {
  if (!aboutData || !aboutData.Achievements) return;

  const grid = document.getElementById("achievements-grid");
  if (!grid) return;

  const items = aboutData.Achievements;
  grid.innerHTML = "";

  items.forEach((stat) => {
    const item = document.createElement("div");
    item.className = "stat-item";
    item.setAttribute("role", "listitem");

    const { number, text } = splitNumberAndText(String(stat.count));

    // === the Number ===
    const num = document.createElement("div");
    num.className = "stat-number";
    num.textContent = number;

    // === Add mark (+) if was only number ===
    if (/^\d+$/.test(stat.count)) {
      const plus = document.createElement("span");
      plus.className = "stat-plus";
      plus.textContent = "+";
      num.appendChild(plus);
    }

    // === small word after the number ====
    if (text) {
      const small = document.createElement("span");
      small.className = "stat-unit";
      small.textContent = " " + text;
      num.appendChild(small);
    }

    const label = document.createElement("div");
    label.className = "stat-label";
    label.textContent = stat.title;

    item.appendChild(num);
    item.appendChild(label);
    grid.appendChild(item);
  });
}

// ============== CERTIFICATIONS ===============
function renderCertifications(aboutData) {
  if (!aboutData || !aboutData.Certifications) return;

  const grid = document.getElementById("certifications-grid");
  if (!grid) return;

  const items = aboutData.Certifications;

  grid.innerHTML = "";

  items.forEach((cert) => {
    const item = document.createElement("div");
    item.className = "cert-card";
    item.setAttribute("role", "listitem");

    const title = document.createElement("h4");
    title.className = "cert-title";
    title.textContent = cert.title || "Certification";

    const issuer = document.createElement("P");
    issuer.className = "cert-issuer";
    issuer.textContent = cert.issuer || "";

    item.appendChild(title);
    item.appendChild(issuer);

    if (cert.link) {
      const anchor = document.createElement("a");
      anchor.href = cert.link;
      anchor.className = "cert-link";
      anchor.textContent = "view Certificate";
      item.appendChild(anchor);
    }

    grid.appendChild(item);
  });
}

// ============== PHILOSOPHY ===============
function renderPhilosophy(aboutData) {
  const text = aboutData.Philosophy;
  const el = document.getElementById("philosophy-text");
  if (el && text) {
    el.textContent = text;
  }
}

// ============== ANYMATION ON SCROLL ============
AOS.init({
  duration: 1500,
  once: true,
});
