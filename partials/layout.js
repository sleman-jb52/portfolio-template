async function loadLayout() {
  // === Loading Footer and navbar ===

  const [navbarRes, footerRes, dataRes] = await Promise.all([
    fetch("../partials/navbar.html"),
    fetch("../partials/footer.html"),
    fetch("../data.json"),
  ]);

  const navbarHTML = await navbarRes.text();
  const footerHTML = await footerRes.text();
  const data = await dataRes.json();

  //   === insert content in page ====

  document.getElementById("navbar").innerHTML = navbarHTML;
  document.getElementById("footer").innerHTML = footerHTML;

  activateNavLinks();

  //   === Navbar ===
  document.querySelector(".logo").textContent = data.navbar.text;

  // ===== change navbar background on scroll ===

  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  });

  // ===== active the menu on mobial ====

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // === Footer ===
  document.getElementById("footer-Name").textContent = data.footer.name;
  document.getElementById("footer-role").textContent = data.footer.role;
  document.getElementById("footer-location").textContent = data.footer.location;
  document.getElementById("footerNameCopy").textContent = data.footer.location;

  window.siteData = data;
  if (typeof initHome === "function") {
    initHome();
  }
  if (typeof window.initAbout === "function") {
    window.initAbout();
  }
  if (typeof window.renderProjectHero === "function") {
    window.renderProjectHero();
  }
}
loadLayout();

function activateNavLinks() {
  const currentPage = window.location.pathname.split("/").pop() || "home.html";

  const links = document.querySelectorAll(".nav-link");

  links.forEach((link) => {
    const href = link.getAttribute("href");

    link.classList.remove("active");

    if (href.endsWith(currentPage)) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
