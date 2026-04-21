'use strict';

// ═══════════════════════════════════════════════════════════════
//  app.js  —  Window manager, icons, drag, tabs
// ═══════════════════════════════════════════════════════════════

/* ── SVG Icons ────────────────────────────────────────────────── */
// All icons use CSS variables --icon-fill / --icon-stroke so they
// respond to theme changes and selection states automatically.

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
  active: null,   // { type, el, id?, sx, sy, ox, oy, ow?, oh? }
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
  const prev = drag.active;
  drag.active = null;
  setTimeout(() => { if (!drag.active) drag.moved = false; }, 0);
});

/* ── Touch support (tablet / large-screen touch) ─────────────── */
function touchCoord(e) { return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY }; }

document.addEventListener('touchmove', e => {
  if (!drag.active) return;
  e.preventDefault();
  const t = touchCoord(e);
  const synth = new MouseEvent('mousemove', t);
  document.dispatchEvent(synth);
}, { passive: false });

document.addEventListener('touchend', e => {
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
    this.open     = {};   // id → element
    this.cascade  = 0;
  }

  show(id, opts) {
    if (this.open[id]) { this.focus(this.open[id]); return; }
    const el = this._build(id, opts);
    this.desktop.appendChild(el);
    this.open[id] = el;
    this.focus(el);
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
    el.className    = 'window';
    el.dataset.winId = id;
    el.style.left   = x + 'px';
    el.style.top    = y + 'px';
    el.style.width  = (opts.w || 480) + 'px';
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

/* ── Global drag delegation (mouse + touch) ───────────────────── */
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
  // Close button
  const closeBtn = e.target.closest('.win-close');
  if (closeBtn) { wm.close(closeBtn.dataset.id); return; }

  // Zoom button
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

  // Tab switching
  const tab = e.target.closest('.tab');
  if (tab) {
    const bar    = tab.closest('.tabs-bar');
    const body   = bar.closest('.win-body');
    bar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    body.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(tab.dataset.target);
    if (panel) panel.classList.add('active');
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
    <div class="contact-row">
      <span>&#9993;</span>
      <a href="mailto:${SITE.email}">${SITE.email}</a>
    </div>
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
    <div style="margin-bottom:14px">
      <div class="exp-period">${e.period} — ${e.location}</div>
      <div class="exp-title">${e.title}</div>
      <div class="exp-org">${e.org}</div>
      <ul class="exp-bullets">
        ${e.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  const skills = SITE.skills.map(s => `<span class="tag">${s}</span>`).join('');

  return `
    <div class="cv-section">
      <div class="section-head">Education</div>${edu}
    </div>
    <div class="cv-section">
      <div class="section-head">Experience</div>${exp}
    </div>
    <div class="cv-section">
      <div class="section-head">Research Toolkits</div>
      <div class="skills-list">${skills}</div>
    </div>
  `;
}

function renderPublications() {
  const papers = SITE.publications.length
    ? SITE.publications.map(p => `
        <div class="entry">
          <div class="entry-title">
            ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">"${p.title}"</a>`
                    : `"${p.title}"`}
          </div>
          <div class="entry-meta">${p.venue} &nbsp;·&nbsp; ${p.status} &nbsp;·&nbsp; ${p.date}</div>
        </div>
      `).join('')
    : '<p class="empty">No papers yet.</p>';

  const confs = SITE.conferences.length
    ? SITE.conferences.map(c => `
        <div class="entry">
          <div class="entry-title">
            ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener">"${c.title}"</a>`
                    : `"${c.title}"`}
          </div>
          <div class="entry-meta">${c.venue} &nbsp;·&nbsp; ${c.year} &nbsp;·&nbsp; ${c.type}</div>
        </div>
      `).join('')
    : '<p class="empty">No conference presentations yet.</p>';

  const exh = SITE.exhibitions.length
    ? SITE.exhibitions.map(e => `
        <div class="entry">
          <div class="entry-title">
            ${e.url ? `<a href="${e.url}" target="_blank" rel="noopener">${e.title}</a>`
                    : e.title}
            <span style="font-style:normal;font-size:11px;color:var(--c-text-muted)"> — ${e.type}</span>
          </div>
          <div class="entry-events">
            ${e.events.map(ev => `<span>${ev.name} ${ev.year}, ${ev.location}</span>`).join('')}
          </div>
        </div>
      `).join('')
    : '<p class="empty">No exhibitions yet.</p>';

  return {
    tabs: [
      { id: 'papers', label: 'Papers',      html: papers },
      { id: 'conf',   label: 'Conferences', html: confs  },
      { id: 'exh',    label: 'Exhibitions', html: exh    },
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
          <div class="project-card">
            <div class="project-title">
              ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.title}</a>`
                      : p.title}
            </div>
            <div class="project-desc">${p.description}</div>
            <div class="project-tags">
              ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
            <div class="project-status">${p.status}</div>
          </div>
        `).join('')
      : '<p class="empty">Nothing here yet.</p>';

    return { id: cat.id, label: cat.label, html };
  });

  return { tabs };
}

/* ── Desktop icon definitions ─────────────────────────────────── */
function makeIconDefs(wm) {
  const defs = [
    {
      id:    'about',
      label: 'about.md',
      icon:  SVG.document,
      x: 50, y: 90,
      action: () => wm.show('about', {
        title: 'about.md',
        html:  renderAbout(),
        w: 420, h: 460,
      }),
    },
    {
      id:    'cv',
      label: 'cv.md',
      icon:  SVG.document,
      x: 50, y: 200,
      action: () => wm.show('cv', {
        title: 'cv.md',
        html:  renderCV(),
        w: 520, h: 540,
      }),
    },
    {
      id:    'publications',
      label: 'Publications',
      icon:  SVG.folder,
      x: 180, y: 90,
      action: () => {
        const p = renderPublications();
        wm.show('publications', { title: 'Publications', tabs: p.tabs, w: 520, h: 420 });
      },
    },
    {
      id:    'projects',
      label: 'Projects',
      icon:  SVG.folder,
      x: 180, y: 200,
      action: () => {
        const p = renderProjects();
        wm.show('projects', { title: 'Projects', tabs: p.tabs, w: 520, h: 420 });
      },
    },
  ];

  // Social icons — right column, uses window.innerWidth for reliable positioning
  const rightEdge = Math.max(window.innerWidth - 110, 500);
  SITE.social.forEach((s, i) => {
    defs.push({
      id:     s.id,
      label:  s.label,
      icon:   SVG[s.icon] || SVG.document,
      x:      rightEdge,
      y:      90 + i * 110,
      action: () => window.open(s.url, '_blank', 'noopener,noreferrer'),
    });
  });

  return defs;
}

/* ── Create a desktop icon element ───────────────────────────── */
function createIcon(def) {
  const el = document.createElement('div');
  el.className     = 'icon';
  el.dataset.iconId = def.id;

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

  el.addEventListener('mousedown', e => {
    startIconDrag(e.clientX, e.clientY);
    e.preventDefault();
  });

  el.addEventListener('touchstart', e => {
    // Only set up drag on non-mobile; mobile just uses touchend as tap
    if (window.innerWidth > 768) {
      startIconDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
    el.classList.add('pressed');
  }, { passive: true });

  el.addEventListener('mouseup', () => {
    el.classList.remove('pressed');
    if (!drag.moved) def.action();
  });

  el.addEventListener('touchend', () => {
    el.classList.remove('pressed');
    // On mobile, always fire action on tap (no drag to check)
    if (window.innerWidth <= 768) {
      def.action();
    } else if (!drag.moved) {
      def.action();
    }
    drag.active = null;
    drag.moved  = false;
  });

  return el;
}

/* ── Clock ────────────────────────────────────────────────────── */
function updateClock() {
  const now = new Date();
  const h   = now.getHours().toString().padStart(2, '0');
  const m   = now.getMinutes().toString().padStart(2, '0');
  const el  = document.getElementById('clock');
  if (el) el.textContent = h + ':' + m;
}

/* ── Theme toggle ─────────────────────────────────────────────── */
document.getElementById('theme-btn').addEventListener('click', () => {
  const html  = document.documentElement;
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('theme', html.dataset.theme);
});

// Restore saved theme
(function () {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.dataset.theme = saved;
})();

/* ── Init ─────────────────────────────────────────────────────── */
let wm;

document.addEventListener('DOMContentLoaded', () => {
  const desktop = document.getElementById('desktop');
  wm = new WM(desktop);

  const icons = makeIconDefs(wm);
  icons.forEach(def => desktop.appendChild(createIcon(def)));

  updateClock();
  setInterval(updateClock, 15000);
});
