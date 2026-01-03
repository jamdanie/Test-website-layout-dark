// Minimal JS: active nav on scroll + tiny motion polish
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const links = Array.from(document.querySelectorAll(".nav-link"));
  const sections = links
    .map(a => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  // Active link based on scroll position
  const setActive = () => {
    const y = window.scrollY + 140; // offset for topbar padding
    let activeIndex = 0;

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      if (s.offsetTop <= y) activeIndex = i;
    }

    links.forEach((a, i) => a.classList.toggle("is-active", i === activeIndex));
  };

  // Smooth scroll (native) + fallback focus
  links.forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Keep URL clean-ish without hard jumps
      history.replaceState(null, "", id);
    });
  });

  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("load", setActive);

  // Subtle parallax on hero image (very light)
  const heroImg = document.querySelector(".hero-img");
  if (heroImg) {
    let raf = 0;
    const onMove = (ev) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (ev.clientX / w - 0.5) * 6;  // small
      const y = (ev.clientY / h - 0.5) * 6;  // small

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        heroImg.style.transform =
          `translateX(-50%) translateY(${(-y).toFixed(2)}px)`;
      });
    };

    // Only on pointer-fine devices (avoid mobile weirdness)
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", () => {
        heroImg.style.transform = "translateX(-50%) translateY(0px)";
      });
    }
  }
})();
