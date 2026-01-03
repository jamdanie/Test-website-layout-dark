// minimal: gentle float on top peek only
(() => {
  const el = document.querySelector(".peek-top");
  if (!el) return;

  let t = 0;
  const tick = () => {
    t += 0.02;
    const y = Math.sin(t) * 6;     // subtle
    el.style.transform = `translateY(${y}px)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
