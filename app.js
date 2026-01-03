// app.js — Phase 1: load projects from /data/projects.json and render to #projectsGrid

async function loadProjects() {
  // Same-origin fetch from GitHub Pages
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

  // Featured first (true), then alphabetical by title
  const sorted = [...projects].sort((a, b) => {
    const af = a.featured ? 0 : 1;
    const bf = b.featured ? 0 : 1;
    if (af !== bf) return af - bf;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });

  grid.innerHTML = sorted.map(p => {
    const title = escapeHtml(p.title || "Untitled Project");
    const desc = escapeHtml(p.description || "");
    const tags = Array.isArray(p.tags) ? p.tags : [];
    const repo = p.repo ? String(p.repo) : "";
    const live = p.live ? String(p.live) : "";

    return `
      <article class="card ${p.featured ? "featured" : ""}">
        <h3>${title}</h3>
        ${desc ? `<p>${desc}</p>` : ""}

        ${tags.length ? `
          <div class="tags">
            ${tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
          </div>
        ` : ""}

        ${(repo || live) ? `
          <div class="links">
            ${repo ? `<a href="${repo}" target="_blank" rel="noreferrer">Repo</a>` : ""}
            ${live ? `<a href="${live}" target="_blank" rel="noreferrer">Live</a>` : ""}
          </div>
        ` : ""}
      </article>
    `;
  }).join("");
}

function showProjectsError(message) {
  const grid = document.querySelector("#projectsGrid");
  if (!grid) return;
  grid.innerHTML = `
    <div class="card">
      <h3>Projects unavailable</h3>
      <p style="margin:0;opacity:.8;">${escapeHtml(message)}</p>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const projects = await loadProjects();
    renderProjects(projects);
  } catch (err) {
    console.error(err);
    showProjectsError("Couldn’t load data/projects.json. Check that the file exists and is deployed.");
  }
});
