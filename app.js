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

  trash: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="12" width="18" height="16" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <rect x="4" y="8"  width="24" height="5"  fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <rect x="12" y="4" width="8"  height="5"  fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <line x1="12" y1="15" x2="12" y2="25" stroke="var(--icon-stroke)" stroke-width="1"/>
    <line x1="16" y1="15" x2="16" y2="25" stroke="var(--icon-stroke)" stroke-width="1"/>
    <line x1="20" y1="15" x2="20" y2="25" stroke="var(--icon-stroke)" stroke-width="1"/>
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

document.addEventListener('mouseup', e => {
  if (drag.active?.type === 'icon' && drag.moved) {
    const { id, el } = drag.active;
    const binIcon = id !== 'bin' && document.getElementById('icon-bin');
    if (binIcon) {
      const r = binIcon.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right &&
          e.clientY >= r.top  && e.clientY <= r.bottom) {
        dropIntoBin(id, el.querySelector('.icon-label')?.textContent || id, el.dataset.iconKey, el);
        drag.active = null;
        setTimeout(() => { drag.moved = false; }, 0);
        return;
      }
    }
    saveIconPos(id, parseInt(el.style.left), parseInt(el.style.top));
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
    if (this.open[id]) { this.focus(this.open[id]); return this.open[id]; }
    const el = this._build(id, opts);
    this.desktop.appendChild(el);
    this.open[id] = el;
    this.focus(el);
    return el;
  }

  close(id) {
    const el = this.open[id];
    if (!el) return;
    if (id === 'now') {
      stopNowPenguinAnimation();
      nowEditing = false;
    }
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

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('now-lock-input')) {
    e.target.closest('.now-lock-pad')?.querySelector('.now-lock-ok')?.click();
    return;
  }
  if (e.key === 'Enter' && e.target.classList.contains('cv-lock-input')) {
    e.target.dataset.submit = '1';
    e.target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    e.target.closest('.cv-lock-pad')?.querySelector('.cv-lock-ok')?.click();
  }
});

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

  // Now window actions
  const nowAction = e.target.closest('[data-now-action]');
  if (nowAction) {
    const action = nowAction.dataset.nowAction;
    if (action === 'edit') {
      openNowEditPasswordPrompt();
    } else if (action === 'cancel') {
      nowEditing = false;
      openNowWindow();
    } else if (action === 'save') {
      saveNowData(readNowFormData());
      nowEditing = false;
      openNowWindow();
    } else if (action === 'reset') {
      localStorage.removeItem(NOW_STORAGE_KEY);
      nowEditing = false;
      openNowWindow();
    }
    return;
  }

  // now password — OK / Cancel
  if (e.target.closest('.now-lock-ok')) {
    const input = document.querySelector('.now-lock-input');
    const expected = String(SITE.nowEditPassword || '6476');
    if ((input?.value || '') === expected) {
      wm.close('now-lock');
      nowEditing = true;
      openNowWindow();
    } else {
      document.querySelector('.now-lock-error')?.classList.add('visible');
      input?.select();
    }
    return;
  }
  if (e.target.closest('.now-lock-cancel')) { wm.close('now-lock'); return; }

  // Bin item actions
  const binAction = e.target.closest('.bin-item-action');
  if (binAction) {
    if (binAction.dataset.binAction === 'restore') restoreIcon(binAction.dataset.binId);
    if (binAction.dataset.binAction === 'cv-lock') openCvPasswordPrompt();
    return;
  }

  // cv password — OK button
  if (e.target.closest('.cv-lock-ok') || e.target.closest('.cv-lock-input[data-submit]')) {
    const input = document.querySelector('.cv-lock-input');
    if (input?.value === (SITE.cvPassword || '')) {
      wm.close('cv-lock');
      playSound('unlock');
      const cv = renderCV();
      wm.show('cv', { title: 'cv.md', tabs: cv.tabs, w: 520, h: 460 });
    } else {
      document.querySelector('.cv-lock-error')?.classList.add('visible');
      input?.select();
    }
    return;
  }
  if (e.target.closest('.cv-lock-cancel')) { wm.close('cv-lock'); return; }

  // Empty Bin → always fails with a Mac-style error
  if (e.target.closest('.trash-empty-btn')) {
    wm.show('bin-error', {
      title: 'Error',
      html: `<div class="mac-error">
        <div class="mac-error-msg">The Bin cannot be emptied because all of the items in it are locked.</div>
        <div class="mac-error-actions"><button class="bin-error-ok">OK</button></div>
      </div>`,
      w: 310, h: 148,
    });
    return;
  }
  if (e.target.closest('.bin-error-ok')) { wm.close('bin-error'); return; }
});

/* ── Content renderers ────────────────────────────────────────── */
const NOW_STORAGE_KEY = 'now:override';

const PENGUIN_FRAMES = [
  String.raw` /\_/\
(=>m<=)
 (")(")`,
  String.raw` /\_/\
(=>m<=)
 (")(")~`,
  String.raw` /\_/\
~(=>m<=)
 (")(")`,
];

let nowPenguinTimer = null;
let nowPenguinFrame = 0;
let nowEditing = false;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

function linesToArray(value) {
  return String(value || '')
    .split('\n')
    .map(v => v.trim())
    .filter(Boolean);
}

function normalizeNowData(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const devlogSource = Array.isArray(src.devlog) ? src.devlog : (Array.isArray(src.lately) ? src.lately : []);
  return {
    updated: String(src.updated || 'Recently'),
    status: String(src.status || 'Thinking, writing, and making.'),
    focus: Array.isArray(src.focus) ? src.focus.map(v => String(v)).filter(Boolean) : [],
    devlog: devlogSource.map(v => String(v)).filter(Boolean),
  };
}

function getNowData() {
  const base = normalizeNowData(SITE.now);
  try {
    const raw = localStorage.getItem(NOW_STORAGE_KEY);
    if (!raw) return base;
    const override = JSON.parse(raw);
    const overrideDevlog = Array.isArray(override?.devlog)
      ? override.devlog
      : (Array.isArray(override?.lately) ? override.lately : base.devlog);
    return normalizeNowData({
      updated: typeof override?.updated === 'string' ? override.updated : base.updated,
      status: typeof override?.status === 'string' ? override.status : base.status,
      focus: Array.isArray(override?.focus) ? override.focus : base.focus,
      devlog: overrideDevlog,
    });
  } catch (_) {
    return base;
  }
}

function saveNowData(data) {
  localStorage.setItem(NOW_STORAGE_KEY, JSON.stringify(normalizeNowData(data)));
}

function readNowFormData() {
  return normalizeNowData({
    updated: document.getElementById('now-input-updated')?.value || '',
    status: document.getElementById('now-input-status')?.value || '',
    focus: linesToArray(document.getElementById('now-input-focus')?.value || ''),
    devlog: linesToArray(document.getElementById('now-input-devlog')?.value || ''),
  });
}

function stopNowPenguinAnimation() {
  if (nowPenguinTimer) {
    clearInterval(nowPenguinTimer);
    nowPenguinTimer = null;
  }
}

function startNowPenguinAnimation() {
  stopNowPenguinAnimation();
  const el = document.getElementById('now-penguin-frame');
  if (!el) return;
  el.textContent = PENGUIN_FRAMES[0];
  nowPenguinFrame = 1;
  nowPenguinTimer = setInterval(() => {
    const frameEl = document.getElementById('now-penguin-frame');
    if (!frameEl) { stopNowPenguinAnimation(); return; }
    frameEl.textContent = PENGUIN_FRAMES[nowPenguinFrame];
    nowPenguinFrame = (nowPenguinFrame + 1) % PENGUIN_FRAMES.length;
  }, 260);
}

function renderNow() {
  const nowData = getNowData();
  const focusHtml = nowData.focus.map(item => `<li>${escapeHtml(item)}</li>`).join('') || '<li>Click Edit to add focus items.</li>';
  const devlogHtml = nowData.devlog.map(item => `<li>${escapeHtml(item)}</li>`).join('') || '<li>Click Edit to add devlog items.</li>';
  const editControls = nowEditing
    ? `<button class="now-btn" data-now-action="save">Save</button>
       <button class="now-btn" data-now-action="cancel">Cancel</button>
       <button class="now-btn" data-now-action="reset">Reset</button>`
    : `<button class="now-btn" data-now-action="edit">Edit</button>`;

  const body = nowEditing
    ? `<div class="now-edit-grid">
         <label class="now-label" for="now-input-updated">Updated</label>
         <input id="now-input-updated" class="now-input" type="text" value="${escapeHtml(nowData.updated)}" />
         <label class="now-label" for="now-input-status">Status</label>
         <textarea id="now-input-status" class="now-textarea" rows="3">${escapeHtml(nowData.status)}</textarea>
         <label class="now-label" for="now-input-focus">Current Focus (one line each)</label>
         <textarea id="now-input-focus" class="now-textarea" rows="4">${escapeHtml(nowData.focus.join('\n'))}</textarea>
         <label class="now-label" for="now-input-devlog">Devlog (one line each)</label>
         <textarea id="now-input-devlog" class="now-textarea" rows="4">${escapeHtml(nowData.devlog.join('\n'))}</textarea>
       </div>`
    : `<div class="now-updated">Updated: ${escapeHtml(nowData.updated)}</div>
       <div class="now-status">${escapeHtml(nowData.status)}</div>
       <div class="now-block-title">Current Focus</div>
       <ul class="now-list">${focusHtml}</ul>
       <div class="now-block-title">Devlog</div>
       <ul class="now-list">${devlogHtml}</ul>`;

  return `
    <div class="now-wrap">
      <pre id="now-penguin-frame" class="now-penguin-ascii" aria-label="Animated ASCII cat"></pre>
      <div class="now-actions">${editControls}</div>
      ${body}
    </div>
  `;
}

function openNowWindow() {
  if (!wm) return;
  const existing = wm.open?.now;
  if (existing) {
    existing.querySelector('.win-body').innerHTML = `<div class="win-pad">${renderNow()}</div>`;
    wm.focus(existing);
    startNowPenguinAnimation();
    return;
  }
  wm.show('now', { title: 'now.txt', html: renderNow(), w: 320, h: 320, x: 350, y: 72 });
  startNowPenguinAnimation();
}

function openNowEditPasswordPrompt() {
  if (wm.open['now-lock']) { wm.focus(wm.open['now-lock']); return; }
  wm.show('now-lock', {
    title: 'now.txt',
    html: `<div class="win-pad now-lock-pad">
      <div class="now-lock-msg">Admin password required to edit this file.</div>
      <input class="now-lock-input" type="password" placeholder="Password" />
      <div class="now-lock-error">Incorrect password.</div>
      <div class="now-lock-actions">
        <button class="now-lock-cancel">Cancel</button>
        <button class="now-lock-ok">Unlock</button>
      </div>
    </div>`,
    w: 280, h: 175,
  });
  setTimeout(() => document.querySelector('.now-lock-input')?.focus(), 50);
}

function renderAbout() {
  const interests = SITE.interests.map(i => `<span class="tag">${i}</span>`).join('');
  const bioHtml = [SITE.bio, SITE.bioSecond]
    .filter(Boolean)
    .map(p => `<p>${p}</p>`)
    .join('');
  return `
    <div class="about-name">${SITE.name}</div>
    <div class="about-tagline">${SITE.tagline}</div>
    <div class="about-bio">${bioHtml}</div>
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
      { id: 'edu',    label: 'Education',                html: edu },
      { id: 'exp',    label: 'Work Experience',         html: exp },
      { id: 'field',  label: 'Fieldwork and Laboratory', html: field },
      { id: 'skills', label: 'Research Toolkit',        html: `<div class="skills-list">${skills}</div>` },
    ],
  };
}

function renderPublications() {
  const papers = SITE.publications.length
    ? SITE.publications.map(p => `
        <div class="entry">
          <div class="entry-type-badge">${p.type}</div>
          <div class="entry-title">
            ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">&ldquo;${p.title}&rdquo;</a>`
                    : `&ldquo;${p.title}&rdquo;`}
          </div>
          <div class="entry-meta">${p.venue} &nbsp;&middot;&nbsp; ${p.date}</div>
        </div>
      `).join('')
    : '<p class="empty">No papers yet.</p>';

  const confs = SITE.conferences.length
    ? SITE.conferences.map(c => `
        <div class="entry">
          <div class="entry-title">
            ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener">&ldquo;${c.title}&rdquo;</a>`
                    : `&ldquo;${c.title}&rdquo;`}
          </div>
          <div class="entry-meta">${c.venue} &nbsp;&middot;&nbsp; ${c.year} &nbsp;&middot;&nbsp; ${c.type}</div>
        </div>
      `).join('')
    : '<p class="empty">Nothing here yet.</p>';

  return {
    tabs: [
      { id: 'papers', label: 'Publications', html: papers },
      { id: 'pres',   label: 'Conferences', html: confs  },
    ],
  };
}

function renderProjects() {
  const cats = [
    { id: 'video-games',   label: 'Video Games'   },
    { id: 'mr-experience', label: 'MR Experience' },
    { id: 'research',      label: 'Research'      },
    { id: 'artwork',       label: 'Artwork'        },
  ];

  const tabs = cats.map(cat => {
    const items = SITE.projects.filter(p => p.category === cat.id);
    const html = items.length
      ? items.map(p => `
          <div class="project-card" data-project-id="${p.id}">
            <div class="project-title">${p.title} <span class="project-open-hint">↗</span></div>
            ${p.role ? `<div class="project-role">${p.role}</div>` : ''}
            ${p.orgLine ? `<div class="project-org">${p.orgLine}</div>` : ''}
            <div class="project-desc">${p.description}</div>
            <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            <div class="project-status">${p.status}</div>
          </div>
        `).join('')
      : '<p class="empty">Nothing here yet.</p>';

    return { id: cat.id, label: cat.label, html };
  });

  return { tabs };
}

/* ── Sound effects (Web Audio API) ───────────────────────────── */
function playSound(type) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'drop') {
      // Low descending thud
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.connect(gain);
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now); osc.stop(now + 0.22);

    } else if (type === 'restore') {
      // Short ascending pop
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.connect(gain);
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now); osc.stop(now + 0.14);

    } else if (type === 'unlock') {
      // Two-note chime: C5 then E5
      [523, 659].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'square';
        o.connect(g); g.connect(ctx.destination);
        const t = now + i * 0.13;
        o.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.1, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        o.start(t); o.stop(t + 0.14);
      });
    }
    setTimeout(() => ctx.close(), 800);
  } catch (_) {}
}

/* ── Bin helpers ──────────────────────────────────────────────── */
// Dropped desktop icons live in-memory only, so a page refresh resets them.
const runtimeBinItems = [];
const restoredHiddenIds = new Set();

function getBinItems() { return runtimeBinItems; }
function addBinItem(id, label, iconKey) {
  if (!runtimeBinItems.some(i => i.id === id)) runtimeBinItems.push({ id, label, iconKey: iconKey || 'document' });
}
function dropIntoBin(id, label, iconKey, el) {
  addBinItem(id, label, iconKey);
  el.remove();
  playSound('drop');
  const win = document.getElementById('win-bin');
  if (win) win.querySelector('.win-body').innerHTML = renderBin();
}

function restoreIcon(id) {
  const idx = runtimeBinItems.findIndex(i => i.id === id);
  if (idx !== -1) runtimeBinItems.splice(idx, 1);

  const hiddenIds = SITE.hiddenIcons || [];
  if (hiddenIds.includes(id)) restoredHiddenIds.add(id);

  const def = makeIconDefs().find(d => d.id === id);
  if (def && !document.getElementById('icon-' + id)) {
    const desktop = document.getElementById('desktop');
    const el = createIcon(def);
    if (def.social) document.querySelector('.social-dock')?.appendChild(el);
    else            desktop.appendChild(el);
  }

  playSound('restore');
  const win = document.getElementById('win-bin');
  if (win) win.querySelector('.win-body').innerHTML = renderBin();
}

function openCvPasswordPrompt() {
  if (wm.open['cv-lock']) { wm.focus(wm.open['cv-lock']); return; }
  wm.show('cv-lock', {
    title: 'cv.md',
    html: `<div class="win-pad cv-lock-pad">
      <div class="cv-lock-msg">This document is locked.</div>
      <input class="cv-lock-input" type="password" placeholder="Password" />
      <div class="cv-lock-error">Incorrect password.</div>
      <div class="cv-lock-actions">
        <button class="cv-lock-cancel">Cancel</button>
        <button class="cv-lock-ok">Open</button>
      </div>
    </div>`,
    w: 260, h: 170,
  });
  // Autofocus input after window renders
  setTimeout(() => document.querySelector('.cv-lock-input')?.focus(), 50);
}

/* ── Bin window ───────────────────────────────────────────────── */
function renderBin() {
  const notes   = SITE.trash || [];
  const dropped = getBinItems();
  const hidden  = (SITE.hiddenIcons || [])
    .filter(id => !restoredHiddenIds.has(id))
    .map(id => {
    const def = makeIconDefs().find(d => d.id === id);
    return { id, label: def?.label || id, iconKey: def?.iconKey || 'document' };
  });

  // Notes from data.js → shown as .txt files with text preview
  const noteRows = notes.map(n => `
    <div class="bin-item">
      <div class="bin-item-file">
        <span class="bin-doc-icon">${SVG.document}</span>
        <span class="bin-filename">${n.id || 'note'}.${n.ext || 'txt'}</span>
      </div>
      ${n.text ? `<div class="bin-note-text">${n.text}</div>` : ''}
    </div>`);

  // Dropped icons → restorable by click
  const droppedRows = dropped.map(d => `
    <div class="bin-item bin-item-action" data-bin-action="restore" data-bin-id="${d.id}">
      <div class="bin-item-file">
        <span class="bin-doc-icon">${SVG[d.iconKey] || SVG.document}</span>
        <span class="bin-filename">${d.label}</span>
      </div>
    </div>`);

  // Hidden icons — cv needs password, others can be restored
  const hiddenRows = hidden.map(h => {
    const isCv = h.id === 'cv';
    const action = isCv ? 'cv-lock' : 'restore';
    return `<div class="bin-item bin-item-action" data-bin-action="${action}" data-bin-id="${h.id}">
      <div class="bin-item-file">
        <span class="bin-doc-icon">${SVG[h.iconKey] || SVG.document}</span>
        <span class="bin-filename">${h.label}${isCv ? ' 🔒' : ''}</span>
      </div>
    </div>`;
  });

  const iconRows = [...droppedRows, ...hiddenRows];

  const allHtml = [...noteRows, ...droppedRows, ...hiddenRows].join('');
  const hasItems = noteRows.length > 0 || iconRows.length > 0;

  return `<div class="win-pad">
    ${hasItems ? allHtml : '<p class="empty">Bin is empty.</p>'}
    <div class="trash-actions">
      <button class="trash-empty-btn">Empty Bin</button>
    </div>
  </div>`;
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
  const rX  = Math.max(window.innerWidth  - 108, 500);
  const bH  = window.innerHeight - 28;  // desktop height (below 28px menubar)

  return [
    // ── Right top: folders ───────────────────────────────────
    {
      id: 'publications', label: 'Publications', icon: SVG.folder, iconKey: 'folder',
      x: rX, y: 40,
      action: () => {
        const p = renderPublications();
        wm.show('publications', { title: 'Publications', tabs: p.tabs, w: 480, h: 400 });
      },
    },
    {
      id: 'projects', label: 'Projects', icon: SVG.folder, iconKey: 'folder',
      x: rX, y: 130,
      action: () => {
        const p = renderProjects();
        wm.show('projects', { title: 'Projects', tabs: p.tabs, w: 480, h: 400 });
      },
    },
    // ── Left top: md files ───────────────────────────────────
    {
      id: 'about', label: 'about.md', icon: SVG.document, iconKey: 'document',
      x: 30, y: 40,
      action: () => wm.show('about', { title: 'about.md', html: renderAbout(), w: 400, h: 440 }),
    },
    {
      id: 'cv', label: 'cv.md', icon: SVG.document, iconKey: 'document',
      x: 30, y: 130,
      action: () => {
        const cv = renderCV();
        wm.show('cv', { title: 'cv.md', tabs: cv.tabs, w: 520, h: 460 });
      },
    },
    // ── Left bottom: bin ─────────────────────────────────────
    {
      id: 'bin', label: 'Bin', icon: SVG.trash, iconKey: 'trash',
      x: 30, y: bH - 100,
      action: () => wm.show('bin', { title: 'Bin', html: renderBin(), w: 320, h: 280 }),
    },
    // ── Right bottom: social (stacked from bottom) ───────────
    ...SITE.social.map((s, i) => ({
      id:      s.id,
      label:   s.label,
      icon:    SVG[s.icon] || SVG.document,
      iconKey: s.icon,
      social:  true,
      x:      rX,
      y:      bH - 90 - (SITE.social.length - 1 - i) * 90,
      action: () => window.open(s.url, '_blank', 'noopener,noreferrer'),
    })),
  ];
}

/* ── Create a desktop icon element ───────────────────────────── */
function createIcon(def) {
  const el = document.createElement('div');
  el.className       = 'icon';
  el.id              = 'icon-' + def.id;
  el.dataset.iconId  = def.id;
  el.dataset.iconKey = def.iconKey || 'document';
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
document.getElementById('start-btn')?.addEventListener('click', () => {
  openNowWindow();
});

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

  const defs = makeIconDefs();

  // Legacy persisted bin data is no longer used (refresh should restore desktop icons).
  localStorage.removeItem('bin:items');

  // Only site-defined hidden icons stay in the bin across refreshes.
  const binnedIds = new Set([...(SITE.hiddenIcons || [])]);

  const socialDock = document.createElement('div');
  socialDock.className = 'social-dock';

  defs.forEach(def => {
    if (binnedIds.has(def.id)) return;  // skip binned/hidden icons
    const el = createIcon(def);
    if (def.social) socialDock.appendChild(el);
    else            desktop.appendChild(el);
  });

  desktop.appendChild(socialDock);

  // Auto-open about window on load
  wm.show('about', { title: 'about.md', html: renderAbout(), w: 420, h: 460 });
  openNowWindow();

  updateClock();
  setInterval(updateClock, 15000);
});
