fetch("../data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load JSON");
    }
    return response.json();
  })
  .then((data) => {
    renderProjects(data.projects);
  })
  .catch((error) => {
    console.error(error);
  });

function renderProjects(projects) {
  const grid = document.getElementById("projects-grid");

  if (!grid || projects.length === 0) {
    grid.innerHTML = `<p>No Projects available.</p>`;
    return;
  }
  grid.innerHTML = "";
  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "project-image";

    const img = document.createElement("img");
    img.src = project.thumbnail || "img/placeholder.jpg";
    img.alt = project.title || "project image";
    img.loading = "lazy";
    imageWrap.appendChild(img);

    const content = document.createElement("div");
    content.className = "project-content";

    const title = document.createElement("h3");
    title.className = "project-title";
    title.textContent = project.title || "Untitled Project";

    const desc = document.createElement("p");
    desc.className = "project-description";
    desc.textContent = project.description || "";

    const link = document.createElement("a");
    link.className = "project-link";
    link.href = `${PROJECT_PAGE_URL}?id=${project.id}`;
    link.textContent = "View Project ->";

    content.append(title, desc, link);
    card.append(imageWrap, content);
    grid.appendChild(card);
  });
}
