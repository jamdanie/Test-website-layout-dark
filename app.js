(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const setActive = () => {
    const y = window.scrollY + 140;
    let active = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= y) active = i;
    }
    links.forEach((a, i) => a.classList.toggle("is-active", i === active));
  };

  links.forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("load", setActive);
})();
