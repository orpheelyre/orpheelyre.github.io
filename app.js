'use strict';

// ═══════════════════════════════════════════════════════════════
//  app.js  —  Window manager, icons, drag, tabs
// ═══════════════════════════════════════════════════════════════

/* ── SVG Icons ────────────────────────────────────────────────── */
const SVG = {
  document: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="1" width="18" height="26" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <path d="M18 1 L22 5 L18 5 Z" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M18 1 L22 5 L22 6 L18 6 L18 1" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <line x1="7"  y1="10" x2="19" y2="10" stroke="var(--icon-stroke)" stroke-width="1"/>
    <line x1="7"  y1="13" x2="19" y2="13" stroke="var(--icon-stroke)" stroke-width="1"/>
    <line x1="7"  y1="16" x2="19" y2="16" stroke="var(--icon-stroke)" stroke-width="1"/>
    <line x1="7"  y1="19" x2="15" y2="19" stroke="var(--icon-stroke)" stroke-width="1"/>
  </svg>`,

  folder: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="10" width="30" height="19" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <path d="M1 10 L1 7 L12 7 L14 10" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>`,

  camera: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="28" height="18" rx="2" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <path d="M10 10 L10 7 L14 7 L16 10" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <circle cx="16" cy="19" r="5" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <circle cx="16" cy="19" r="2"  fill="var(--icon-stroke)"/>
    <circle cx="25" cy="13" r="1.5" fill="var(--icon-stroke)"/>
  </svg>`,

  briefcase: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="13" width="28" height="16" rx="1" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <path d="M11 13 L11 9 L21 9 L21 13" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <line x1="2"  y1="21" x2="30" y2="21" stroke="var(--icon-stroke)" stroke-width="1"/>
    <line x1="16" y1="18" x2="16" y2="24" stroke="var(--icon-stroke)" stroke-width="1.5"/>
  </svg>`,

  gamepad: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12 Q3 12 3 17 L3 19 Q3 24 8 24 L24 24 Q29 24 29 19 L29 17 Q29 12 27 12 Z"
          fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <line x1="8"    y1="18" x2="14"   y2="18"   stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <line x1="11"   y1="15" x2="11"   y2="21"   stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <circle cx="21" cy="15" r="1.5" fill="var(--icon-stroke)"/>
    <circle cx="24" cy="18" r="1.5" fill="var(--icon-stroke)"/>
    <circle cx="21" cy="21" r="1.5" fill="var(--icon-stroke)"/>
    <circle cx="18" cy="18" r="1.5" fill="var(--icon-stroke)"/>
  </svg>`,
};

/* ── Drag State ───────────────────────────────────────────────── */
const drag = {
  active: null,
  moved:  false,
};

document.addEventListener('mousemove', e => {
  if (!drag.active) return;
  const d  = drag.active;
  const dx = e.clientX - d.sx;
  const dy = e.clientY - d.sy;
  if (!drag.moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) drag.moved = true;
  if (!drag.moved) return;

  if (d.type === 'win') {
    d.el.style.left = (d.ox + dx) + 'px';
    d.el.style.top  = Math.max(0, d.oy + dy) + 'px';
  } else if (d.type === 'size') {
    d.el.style.width  = Math.max(280, d.ow + dx) + 'px';
    d.el.style.height = Math.max(160, d.oh + dy) + 'px';
  } else if (d.type === 'icon') {
    const desktop = document.getElementById('desktop');
    const maxX = desktop.offsetWidth  - d.el.offsetWidth;
    const maxY = desktop.offsetHeight - d.el.offsetHeight;
    d.el.style.left = Math.max(0, Math.min(maxX, d.ox + dx)) + 'px';
    d.el.style.top  = Math.max(0, Math.min(maxY, d.oy + dy)) + 'px';
  }
});

document.addEventListener('mouseup', () => {
  if (drag.active?.type === 'icon' && drag.moved) {
    saveIconPos(drag.active.id,
      parseInt(drag.active.el.style.left),
      parseInt(drag.active.el.style.top));
  }
  drag.active = null;
  setTimeout(() => { if (!drag.active) drag.moved = false; }, 0);
});

/* ── Touch support ────────────────────────────────────────────── */
function touchCoord(e) { return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }; }

document.addEventListener('touchmove', e => {
  if (!drag.active) return;
  e.preventDefault();
  document.dispatchEvent(new MouseEvent('mousemove', touchCoord(e)));
}, { passive: false });

document.addEventListener('touchend', () => {
  if (!drag.active) return;
  document.dispatchEvent(new MouseEvent('mouseup'));
});

/* ── Icon positions (localStorage) ───────────────────────────── */
function loadIconPos(id)       { return JSON.parse(localStorage.getItem('icon:' + id) || 'null'); }
function saveIconPos(id, x, y) { localStorage.setItem('icon:' + id, JSON.stringify({ x, y })); }

/* ── Window Manager ───────────────────────────────────────────── */
class WM {
  constructor(desktop) {
    this.desktop  = desktop;
    this.z        = 100;
    this.open     = {};
    this.cascade  = 0;
  }

  show(id, opts) {
    if (this.open[id]) { this.focus(this.open[id]); return; }
    const el = this._build(id, opts);
    this.desktop.appendChild(el);
    this.open[id] = el;
    this.focus(el);
    return el;
  }

  close(id) {
    const el = this.open[id];
    if (!el) return;
    el.remove();
    delete this.open[id];
  }

  focus(el) { el.style.zIndex = ++this.z; }

  _build(id, opts) {
    const off = (this.cascade++ % 7) * 22;
    const x   = (opts.x || 110) + off;
    const y   = (opts.y || 60)  + off;

    const el  = document.createElement('div');
    el.className     = 'window';
    el.id            = 'win-' + id;
    el.dataset.winId = id;
    el.style.left    = x + 'px';
    el.style.top     = y + 'px';
    el.style.width   = (opts.w || 480) + 'px';
    if (opts.h) el.style.height = opts.h + 'px';

    const body = opts.tabs
      ? buildTabs(id, opts.tabs)
      : `<div class="win-pad">${opts.html}</div>`;

    el.innerHTML = `
      <div class="win-bar">
        <button class="win-close" data-id="${id}" title="Close"></button>
        <span class="win-title">${opts.title}</span>
        <button class="win-zoom"  data-id="${id}" title="Zoom"></button>
      </div>
      <div class="win-body">${body}</div>
      <div class="win-sizer" data-id="${id}"></div>
    `;

    el.addEventListener('mousedown', () => this.focus(el));
    return el;
  }
}

/* ── Tab builder ──────────────────────────────────────────────── */
function buildTabs(winId, tabs) {
  const btns = tabs.map((t, i) =>
    `<button class="tab${i === 0 ? ' active' : ''}" data-target="${winId}-${t.id}">${t.label}</button>`
  ).join('');

  const panels = tabs.map((t, i) =>
    `<div class="tab-panel${i === 0 ? ' active' : ''}" id="${winId}-${t.id}">
       ${t.html}
     </div>`
  ).join('');

  return `<div class="tabs-bar">${btns}</div><div class="tabs-panels">${panels}</div>`;
}

/* ── Global event delegation ──────────────────────────────────── */
function startWinDrag(target, cx, cy) {
  const bar = target.closest('.win-bar');
  if (bar && !target.closest('.win-close') && !target.closest('.win-zoom')) {
    const win = bar.closest('.window');
    wm.focus(win);
    drag.active = { type: 'win', el: win, sx: cx, sy: cy,
                    ox: parseInt(win.style.left) || 0,
                    oy: parseInt(win.style.top)  || 0 };
    drag.moved = false;
    return true;
  }
  const sizer = target.closest('.win-sizer');
  if (sizer) {
    const win = sizer.closest('.window');
    wm.focus(win);
    drag.active = { type: 'size', el: win, sx: cx, sy: cy,
                    ow: win.offsetWidth, oh: win.offsetHeight };
    drag.moved = false;
    return true;
  }
  return false;
}

document.addEventListener('mousedown', e => {
  if (startWinDrag(e.target, e.clientX, e.clientY)) e.preventDefault();
});
document.addEventListener('touchstart', e => {
  const t = e.touches[0];
  startWinDrag(e.target, t.clientX, t.clientY);
}, { passive: true });

document.addEventListener('click', e => {
  // Window close
  const closeBtn = e.target.closest('.win-close');
  if (closeBtn) { wm.close(closeBtn.dataset.id); return; }

  // Window zoom
  const zoomBtn = e.target.closest('.win-zoom');
  if (zoomBtn) {
    const win = zoomBtn.closest('.window');
    if (win.dataset.zoomed) {
      win.style.width  = win.dataset.prevW + 'px';
      win.style.height = win.dataset.prevH + 'px';
      delete win.dataset.zoomed;
    } else {
      win.dataset.prevW = win.offsetWidth;
      win.dataset.prevH = win.offsetHeight;
      win.style.width  = '640px';
      win.style.height = '520px';
      win.dataset.zoomed = '1';
    }
    return;
  }

  // Tab switch
  const tab = e.target.closest('.tab');
  if (tab) {
    const bar  = tab.closest('.tabs-bar');
    const body = bar.closest('.win-body');
    bar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    body.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target)?.classList.add('active');
    return;
  }

  // Project card → detail window
  const card = e.target.closest('.project-card');
  if (card) {
    openProjectDetail(card.dataset.projectId);
    return;
  }
});

/* ── Content renderers ────────────────────────────────────────── */
function renderAbout() {
  const interests = SITE.interests.map(i => `<span class="tag">${i}</span>`).join('');
  return `
    <div class="about-name">${SITE.name}</div>
    <div class="about-tagline">${SITE.tagline}</div>
    <div class="about-bio">${SITE.bio}</div>
    <div class="section-head">Academic Interests</div>
    <div class="interest-grid">${interests}</div>
    <div class="section-head">Contact</div>
    <div class="contact-row">&#9993;&nbsp; <a href="mailto:${SITE.email}">${SITE.email}</a></div>
  `;
}

function renderCV() {
  const edu = SITE.education.map(e => `
    <div class="cv-entry">
      <div class="cv-period">${e.period}</div>
      <div>
        <div class="cv-degree">${e.degree}</div>
        <div class="cv-inst">${e.institution}</div>
        ${e.note ? `<div class="cv-note">${e.note}</div>` : ''}
      </div>
    </div>
  `).join('');

  const exp = SITE.experience.map(e => `
    <div class="exp-block">
      <div class="exp-period">${e.period} &mdash; ${e.location}</div>
      <div class="exp-title">${e.title}</div>
      <div class="exp-org">${e.org}</div>
      <ul class="exp-bullets">${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
    </div>
  `).join('');

  const field = (SITE.fieldExperience || []).length
    ? SITE.fieldExperience.map(f => `
        <div class="exp-block">
          <div class="exp-period">${f.period} &mdash; ${f.location}</div>
          <div class="exp-title">${f.title}</div>
          <div class="exp-org">${f.org}</div>
          <ul class="exp-bullets">${f.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>
      `).join('')
    : '<p class="empty">Field and lab experience entries coming soon.</p>';

  const skills = SITE.skills.map(s => `<span class="tag">${s}</span>`).join('');

  return {
    tabs: [
      { id: 'edu',    label: 'Education',    html: `<div class="win-pad">${edu}</div>` },
      { id: 'exp',    label: 'Experience',   html: `<div class="win-pad">${exp}</div>` },
      { id: 'field',  label: 'Field & Lab',  html: `<div class="win-pad">${field}</div>` },
      { id: 'skills', label: 'Skills',       html: `<div class="win-pad"><div class="skills-list">${skills}</div></div>` },
    ],
  };
}

function renderPublications() {
  const papers = SITE.publications.length
    ? SITE.publications.map(p => `
        <div class="entry">
          <div class="entry-title">
            ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">&ldquo;${p.title}&rdquo;</a>`
                    : `&ldquo;${p.title}&rdquo;`}
          </div>
          <div class="entry-meta">${p.venue} &nbsp;&middot;&nbsp; ${p.status} &nbsp;&middot;&nbsp; ${p.date}</div>
        </div>
      `).join('')
    : '<p class="empty">No papers yet.</p>';

  // Conferences and exhibitions merged
  const confs = SITE.conferences.map(c => `
    <div class="entry">
      <div class="entry-title entry-conf">
        ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener">&ldquo;${c.title}&rdquo;</a>`
                : `&ldquo;${c.title}&rdquo;`}
      </div>
      <div class="entry-meta">${c.venue} &nbsp;&middot;&nbsp; ${c.year} &nbsp;&middot;&nbsp; ${c.type}</div>
    </div>
  `).join('');

  const exh = SITE.exhibitions.map(e => `
    <div class="entry">
      <div class="entry-title">
        ${e.url ? `<a href="${e.url}" target="_blank" rel="noopener">&ldquo;${e.title}&rdquo;</a>`
                : `&ldquo;${e.title}&rdquo;`}
      </div>
      <div class="entry-meta">${e.venue}, ${e.location} &nbsp;&middot;&nbsp; ${e.year} &nbsp;&middot;&nbsp; ${e.type}</div>
    </div>
  `).join('');

  const combined = (confs || exh)
    ? confs + (confs && exh ? '<div class="entry-divider"></div>' : '') + exh
    : '<p class="empty">Nothing here yet.</p>';

  return {
    tabs: [
      { id: 'papers', label: 'Academic Publications & Public Anthropology', html: `<div class="win-pad">${papers}</div>` },
      { id: 'pres',   label: 'Presentations & Exhibitions',                  html: `<div class="win-pad">${combined}</div>` },
    ],
  };
}

function renderProjects() {
  const cats = [
    { id: 'games',    label: 'Games'    },
    { id: 'design',   label: 'Design'   },
    { id: 'research', label: 'Research' },
  ];

  const tabs = cats.map(cat => {
    const items = SITE.projects.filter(p => p.category === cat.id);
    const html = items.length
      ? items.map(p => `
          <div class="project-card" data-project-id="${p.id}">
            <div class="project-title">${p.title} <span class="project-open-hint">↗</span></div>
            ${p.role ? `<div class="project-role">${p.role}</div>` : ''}
            <div class="project-desc">${p.description}</div>
            <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            <div class="project-status">${p.status}</div>
          </div>
        `).join('')
      : '<p class="empty">Nothing here yet.</p>';

    return { id: cat.id, label: cat.label, html: `<div class="win-pad">${html}</div>` };
  });

  return { tabs };
}

/* ── Project detail window (fetches markdown) ─────────────────── */
function openProjectDetail(id) {
  const p = SITE.projects.find(proj => proj.id === id);
  if (!p) return;

  const winId = 'proj-' + id;
  if (wm.open[winId]) { wm.focus(wm.open[winId]); return; }

  const el = wm.show(winId, {
    title: p.title,
    html:  '<p class="empty" style="padding:20px 0">Loading&hellip;</p>',
    w: 560, h: 500,
  });

  if (!p.mdFile) return;

  fetch(p.mdFile)
    .then(r => { if (!r.ok) throw new Error(); return r.text(); })
    .then(md => {
      const win = document.getElementById('win-' + winId);
      if (win) win.querySelector('.win-pad').innerHTML =
        `<div class="md-content">${marked.parse(md)}</div>`;
    })
    .catch(() => {
      const win = document.getElementById('win-' + winId);
      if (win) win.querySelector('.win-pad').innerHTML =
        `<p class="empty">Create <code>${p.mdFile}</code> to add content here.</p>`;
    });
}

/* ── Desktop icon definitions ─────────────────────────────────── */
function makeIconDefs() {
  const rX  = Math.max(window.innerWidth  - 110, 500);
  const bH  = window.innerHeight - 20;   // desktop height

  // DOM order matters for mobile layout:
  // folders first → MDs → social (at end, goes to social-dock on mobile)
  return [
    // ── Right top: folders ───────────────────────────────────
    {
      id: 'publications', label: 'Publications', icon: SVG.folder,
      x: rX, y: 50,
      action: () => {
        const p = renderPublications();
        wm.show('publications', { title: 'Publications', tabs: p.tabs, w: 540, h: 440 });
      },
    },
    {
      id: 'projects', label: 'Projects', icon: SVG.folder,
      x: rX, y: 170,
      action: () => {
        const p = renderProjects();
        wm.show('projects', { title: 'Projects', tabs: p.tabs, w: 520, h: 420 });
      },
    },
    // ── Left top: md files ───────────────────────────────────
    {
      id: 'about', label: 'about.md', icon: SVG.document,
      x: 30, y: 50,
      action: () => wm.show('about', { title: 'about.md', html: renderAbout(), w: 420, h: 460 }),
    },
    {
      id: 'cv', label: 'cv.md', icon: SVG.document,
      x: 30, y: 170,
      action: () => {
        const cv = renderCV();
        wm.show('cv', { title: 'cv.md', tabs: cv.tabs, w: 540, h: 480 });
      },
    },
    // ── Right bottom: social (stacked from bottom) ───────────
    ...SITE.social.map((s, i) => ({
      id:     s.id,
      label:  s.label,
      icon:   SVG[s.icon] || SVG.document,
      social: true,
      x:      rX,
      y:      bH - 110 - (SITE.social.length - 1 - i) * 110,
      action: () => window.open(s.url, '_blank', 'noopener,noreferrer'),
    })),
  ];
}

/* ── Create a desktop icon element ───────────────────────────── */
function createIcon(def) {
  const el = document.createElement('div');
  el.className      = 'icon';
  el.id             = 'icon-' + def.id;
  el.dataset.iconId = def.id;
  if (def.social) el.dataset.iconType = 'social';

  const saved = loadIconPos(def.id);
  el.style.left = (saved ? saved.x : def.x) + 'px';
  el.style.top  = (saved ? saved.y : def.y) + 'px';

  el.innerHTML = `
    <div class="icon-img">${def.icon}</div>
    <div class="icon-label">${def.label}</div>
  `;

  function startIconDrag(cx, cy) {
    drag.active = {
      type: 'icon', id: def.id, el,
      sx: cx, sy: cy,
      ox: parseInt(el.style.left) || 0,
      oy: parseInt(el.style.top)  || 0,
    };
    drag.moved = false;
    el.classList.add('pressed');
  }

  el.addEventListener('mousedown', e => { startIconDrag(e.clientX, e.clientY); e.preventDefault(); });
  el.addEventListener('touchstart', e => {
    if (window.innerWidth > 768) startIconDrag(e.touches[0].clientX, e.touches[0].clientY);
    el.classList.add('pressed');
  }, { passive: true });

  el.addEventListener('mouseup', () => {
    el.classList.remove('pressed');
    if (!drag.moved) def.action();
  });
  el.addEventListener('touchend', () => {
    el.classList.remove('pressed');
    if (window.innerWidth <= 768 || !drag.moved) def.action();
    drag.active = null; drag.moved = false;
  });

  return el;
}

/* ── Clock ────────────────────────────────────────────────────── */
function updateClock() {
  const now = new Date();
  const el  = document.getElementById('clock');
  if (el) el.textContent =
    now.getHours().toString().padStart(2,'0') + ':' +
    now.getMinutes().toString().padStart(2,'0');
}

/* ── Theme toggle ─────────────────────────────────────────────── */
document.getElementById('theme-btn').addEventListener('click', () => {
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', html.dataset.theme);
});
(function () {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.dataset.theme = saved;
})();

/* ── Init ─────────────────────────────────────────────────────── */
let wm;

document.addEventListener('DOMContentLoaded', () => {
  const desktop = document.getElementById('desktop');
  wm = new WM(desktop);

  const defs    = makeIconDefs();
  const isMobile = window.innerWidth <= 768;

  // Social icons go into a dock div (handles the 2+1 grid on mobile)
  const socialDock = document.createElement('div');
  socialDock.className = 'social-dock';

  defs.forEach(def => {
    const el = createIcon(def);
    if (def.social) socialDock.appendChild(el);
    else            desktop.appendChild(el);
  });

  desktop.appendChild(socialDock);

  updateClock();
  setInterval(updateClock, 15000);
});
