fetch("../data.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const contact = data.contact;
    document.querySelector(".section-title").textContent = contact.title;
    document.querySelector(".section-description").textContent =
      contact.description;
    document.querySelector("#contact-email").textContent = contact.email;
    document.querySelector("#contact-phone").textContent = contact.phone;
    document.querySelector("#contact-location").textContent = contact.location;

    const socialContainer = document.querySelector(".contact-socials");

    contact.socials.forEach((social) => {
      const link = document.createElement("a");
      link.href = social.url;
      link.target = "_blank";

      const icon = document.createElement("i");
      icon.className = social.icon;
      icon.style.marginRight = "8px";

      link.appendChild(icon);
      link.appendChild(document.createTextNode(social.platform));
      socialContainer.appendChild(link);
    });
  });
