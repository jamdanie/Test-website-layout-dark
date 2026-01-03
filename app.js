// app.js
// - Loads projects from /data/projects.json and renders to #projectsGrid
// - Toggles the in-frame hamburger panel

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

  const sorted = [...projects].sort((a, b) => {
    const af = a.featured ? 0 : 1;
    const bf = b.featured ? 0 : 1;
    if (af !== bf) return af - bf;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });

  grid.innerHTML = sorted.map((p) => {
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
    <article class="card">
      <h3>Projects unavailable</h3>
      <p style="margin:0;opacity:.85;">${escapeHtml(message)}</p>
    </article>
  `;
}

function setupDockMenu() {
  const btn = document.getElementById("dockMenuBtn");
  const panel = document.getElementById("dockPanel");
  if (!btn || !panel) return;

  const close = () => {
    btn.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  };

  btn.addEventListener("click", () => {
    const open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    panel.hidden = open;
  });

  // Close when clicking a link in the panel
  panel.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    close();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Close if clicking outside panel/button
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (panel.hidden) return;
    if (panel.contains(t) || btn.contains(t)) return;
    close();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  setupDockMenu();

  try {
    const projects = await loadProjects();
    renderProjects(projects);
  } catch (err) {
    console.error(err);
    showProjectsError("Couldn’t load data/projects.json. Check that it exists and is deployed.");
  }
});
