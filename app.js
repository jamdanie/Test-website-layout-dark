// app.js
// - Phase 1: load projects from /data/projects.json and render to #projectsGrid
// - UI: mobile menu toggle for topbar

async function loadProjects() {
  const res = await fetch("./data/projects.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch projects.json (${res.status})`);
  const data = await res.json();
  return Array.isArray(data.projects) ? data.projects : [];
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[m]));
}

function renderProjects(projects) {
  const grid = document.querySelector("#projectsGrid");
  if (!grid) return;

  if (!projects.length) {
    grid.innerHTML = `<p style="opacity:.75;margin:0;">No projects found in <code>data/projects.json</code>.</p>`;
    return;
  }

  // Featured first, then by title
  const sorted = [...projects].sort((a, b) => {
    const af = a.featured ? 0 : 1;
    const bf = b.featured ? 0 : 1;
    if (af !== bf) return af - bf;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });

  grid.innerHTML =
