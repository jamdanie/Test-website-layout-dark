/* =========================
   Dark Premium — app.js
   Edit PROJECTS + PROFILE only
   ========================= */

/** ✅ Edit these */
const PROFILE = {
  name: "James Daniels",
  role: "IT • Networking • Systems & UI Builder",
  location: "Tacoma, WA · PNW / Remote",
  email: "jadanie@uw.edu",
  socials: [
    { label: "GitHub", href: "https://github.com/jamdanie" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/james-daniels-/" },
    { label: "Resume", href: "./resume.pdf", note: "PDF" }
  ],
  mailto: {
    subject: "Portfolio inquiry",
    body: "Hi James — I came across your portfolio and would like to connect about potential opportunities."
  }
};

/**
 * ✅ Data-driven projects
 * - title: card title
 * - blurb: short description
 * - tags: used for filters + search
 * - year: quick badge
 * - links: { demo, repo } (either can be null)
 */
const PROJECTS = [
  {
    title: "Networking Lab Environment (GNS3)",
    blurb: "Hands-on routing, switching, and troubleshooting labs with repeatable configurations and documentation.",
    tags: ["Networking", "Labs", "Infrastructure"],
    year: "2026",
    links: {
      demo: null,
      repo: "https://github.com/jamdanie"
    }
  },
  {
    title: "CLI Study Toolkit",
    blurb: "Command-line tool for generating structured study prompts and drills using configurable data files.",
    tags: ["CLI", "Automation", "JavaScript"],
    year: "2025",
    links: {
      demo: null,
      repo: "https://github.com/jamdanie"
    }
  },
  {
    title: "Dark Premium Portfolio",
    blurb: "Single-page portfolio built with HTML, CSS, and JavaScript featuring data-driven projects and smooth UI motion.",
    tags: ["Portfolio", "UI", "CSS", "JavaScript"],
    year: "2026",
    links: {
      demo: "https://jamdanie.github.io/Test-website-layout-dark/",
      repo: "https://github.com/jamdanie/Test-website-layout-dark"
    }
  },
  {
    title: "Systems Documentation Hub",
    blurb: "Centralized notes and diagrams for labs, workflows, and system concepts designed for fast recall.",
    tags: ["Documentation", "Systems", "Workflow"],
    year: "2025",
    links: {
      demo: null,
      repo: "https://github.com/jamdanie"
    }
  },
  {
    title: "UI Motion & Interaction Experiments",
    blurb: "Exploration of subtle animations, hover intent, and scroll-based reveals that enhance UX without hurting performance.",
    tags: ["UI", "Motion", "CSS", "Performance"],
    year: "2026",
    links: {
      demo: null,
      repo: "https://github.com/jamdanie"
    }
  }
];


/* =========================
   Render + UI
   ========================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function iconExternal() {
  return `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14 5h5v5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M10 14L19 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    <path d="M19 14v5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`;
}

function iconCode() {
  return `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M8 9l-3 3 3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M16 9l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M14 7l-4 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
  </svg>`;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function collectAllTags(items) {
  const set = new Set();
  items.forEach(p => p.tags.forEach(t => set.add(t)));
  return Array.from(set).sort((a,b) => a.localeCompare(b));
}

let activeTags = new Set();
let searchQuery = "";

function matches(project) {
  const q = searchQuery.trim().toLowerCase();
  const hay = [
    project.title,
    project.blurb,
    project.year,
    ...(project.tags || [])
  ].join(" ").toLowerCase();

  const qOK = q.length === 0 || hay.includes(q);

  const tagOK = activeTags.size === 0
    ? true
    : project.tags.some(t => activeTags.has(t));

  return qOK && tagOK;
}

function renderProjects() {
  const grid = $("#projectsGrid");
  if (!grid) return;

  const filtered = PROJECTS.filter(matches);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1;">
        <h3 class="h3">No matches</h3>
        <p class="muted">Try a different search or clear filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const demo = p.links?.demo ? `<a class="link" href="${escapeHTML(p.links.demo)}" target="_blank" rel="noopener">${iconExternal()} Demo</a>` : "";
    const repo = p.links?.repo ? `<a class="link" href="${escapeHTML(p.links.repo)}" target="_blank" rel="noopener">${iconCode()} Code</a>` : "";

    return `
      <article class="project reveal">
        <div class="project__inner">
          <div class="project__top">
            <div>
              <h3 class="project__title">${escapeHTML(p.title)}</h3>
              <p class="project__subtitle">${escapeHTML(p.blurb)}</p>
            </div>
            <span class="badge">${escapeHTML(p.year || "")}</span>
          </div>

          <div class="project__meta">
            ${(p.tags || []).map(t => `<span class="badge">${escapeHTML(t)}</span>`).join("")}
          </div>

          <div class="project__links">
            ${demo}
            ${repo}
          </div>
        </div>
      </article>
    `;
  }).join("");

  // Re-attach reveal observer to newly rendered cards
  observeReveals();
}

function renderTagFilters() {
  const row = $("#tagFilters");
  if (!row) return;

  const tags = collectAllTags(PROJECTS);

  const chip = (label, value = label) => {
    const on = activeTags.has(value);
    return `
      <button class="chip ${on ? "is-on" : ""}" data-tag="${escapeHTML(value)}" type="button">
        ${escapeHTML(label)}
      </button>
    `;
  };

  row.innerHTML = [
    chip("All", "__ALL__"),
    ...tags.map(t => chip(t, t))
  ].join("");

  row.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const tag = btn.getAttribute("data-tag");
    if (!tag) return;

    if (tag === "__ALL__") {
      activeTags.clear();
    } else {
      if (activeTags.has(tag)) activeTags.delete(tag);
      else activeTags.add(tag);
    }

    // If user selects any specific tags, "All" is implied off (handled by set)
    renderTagFilters();
    renderProjects();
  }, { once: true }); // we rebuild chips, so attach once per render
}

function wireSearch() {
  const input = $("#projectSearch");
  if (!input) return;

  input.addEventListener("input", () => {
    searchQuery = input.value || "";
    renderProjects();
  });
}

function setYear() {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

/* =========================
   Subtle UX: scroll reveal
   ========================= */

let revealObserver = null;

function observeReveals() {
  const items = $$(".reveal").filter(el => !el.classList.contains("is-in"));
  if (items.length === 0) return;

  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
  }

  items.forEach(el => revealObserver.observe(el));
}

/* =========================
   Active nav + progress bar
   ========================= */

function wireScrollProgress() {
  const bar = $("#progressBar");
  if (!bar) return;

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const pct = max <= 0 ? 0 : (doc.scrollTop / max) * 100;
    bar.style.width = `${pct}%`;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function wireActiveNav() {
  const links = $$(".nav__link");
  const sections = ["about", "projects", "skills", "contact"].map(id => document.getElementById(id)).filter(Boolean);

  if (sections.length === 0 || links.length === 0) return;

  const byId = new Map(links.map(a => [a.getAttribute("href")?.replace("#",""), a]));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(a => a.classList.remove("is-active"));
      const id = entry.target.id;
      const link = byId.get(id);
      if (link) link.classList.add("is-active");
    });
  }, { threshold: 0.35 });

  sections.forEach(s => obs.observe(s));
}

/* =========================
   Mobile nav toggle
   ========================= */

function wireMobileNav() {
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close on link click
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  });
}

/* =========================
   Accent toggle (premium pop)
   ========================= */

function wireAccentToggle() {
  const btn = $("#themeToggle");
  if (!btn) return;

  const KEY = "dp-accent";
  const root = document.documentElement;

  function apply(mode) {
    // Mode A: violet/cyan/pink (default)
    // Mode B: emerald/sky/amber (alt)
    if (mode === "B") {
      root.style.setProperty("--a1", "#22c55e"); // emerald
      root.style.setProperty("--a2", "#38bdf8"); // sky
      root.style.setProperty("--a3", "#f59e0b"); // amber
      btn.setAttribute("aria-pressed", "true");
    } else {
      root.style.setProperty("--a1", "#7c3aed");
      root.style.setProperty("--a2", "#06b6d4");
      root.style.setProperty("--a3", "#ff3ea5");
      btn.setAttribute("aria-pressed", "false");
    }
    localStorage.setItem(KEY, mode);
  }

  const saved = localStorage.getItem(KEY) || "A";
  apply(saved);

  btn.addEventListener("click", () => {
    const cur = localStorage.getItem(KEY) || "A";
    apply(cur === "A" ? "B" : "A");
  });
}

/* =========================
   Contact links
   ========================= */

function wireContact() {
  const wrap = $("#contactLinks");
  if (!wrap) return;

  const mail = new URL(`mailto:${PROFILE.email}`);
  if (PROFILE.mailto?.subject) mail.searchParams.set("subject", PROFILE.mailto.subject);
  if (PROFILE.mailto?.body) mail.searchParams.set("body", PROFILE.mailto.body);

  const buttons = [
    { label: "Email me", href: mail.toString(), primary: true },
    ...PROFILE.socials.map(s => ({ label: s.label, href: s.href, note: s.note }))
  ];

  wrap.innerHTML = buttons.map(b => {
    const cls = b.primary ? "btn btn--primary" : "btn btn--soft";
    const note = b.note ? ` <span class="muted tiny">(${escapeHTML(b.note)})</span>` : "";
    return `<a class="${cls}" href="${escapeHTML(b.href)}" target="${b.href.startsWith("mailto:") ? "_self" : "_blank"}" rel="noopener">${escapeHTML(b.label)}${note}</a>`;
  }).join("");
}

/* =========================
   Init
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  // Small personalization: update title/brand text quickly
  document.title = `${PROFILE.name} — Dark Premium Portfolio`;
  const brandTextEls = $$(".brand__text");
  brandTextEls.forEach(el => el.textContent = PROFILE.name.replace(/\s+/g, ""));

  setYear();

  renderTagFilters();
  wireSearch();
  renderProjects();

  observeReveals();

  wireScrollProgress();
  wireActiveNav();
  wireMobileNav();
  wireAccentToggle();
  wireContact();
});
