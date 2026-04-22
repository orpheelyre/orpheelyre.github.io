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

  terminal: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="3" width="28" height="22" fill="var(--icon-fill)" stroke="var(--icon-stroke)" stroke-width="1.5"/>
    <rect x="2" y="3" width="28" height="6" fill="var(--icon-stroke)"/>
    <polyline points="6,16 10,19 6,22" fill="none" stroke="var(--icon-stroke)" stroke-width="1.5" stroke-linejoin="round"/>
    <line x1="13" y1="22" x2="22" y2="22" stroke="var(--icon-stroke)" stroke-width="1.5"/>
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
    playSound('place');
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
      nowUploadedPictureData = '';
      nowPictureRemoved = false;
      releaseNowPreviewObjectUrl();
    }
    if (id === 'devlog') devlogEditing = false;
    if (id === 'guestbook') guestbookDrawCtx = null;
    if (id === 'admin') { if (adminCatTimer) { clearInterval(adminCatTimer); adminCatTimer = null; } }
    if (id === 'sync-notice' && syncNoticeTimer) {
      clearTimeout(syncNoticeTimer);
      syncNoticeTimer = null;
    }
    el.remove();
    delete this.open[id];
  }

  focus(el) { el.style.zIndex = ++this.z; }

  _build(id, opts) {
    const isMobile = window.innerWidth <= 768;
    const off = (this.cascade++ % (isMobile ? 4 : 7)) * (isMobile ? 14 : 22);

    let w = opts.w || 480;
    let h = opts.h || 360;
    if (isMobile) {
      w = Math.min(w, Math.max(260, window.innerWidth - 16));
      h = Math.min(h, Math.max(180, window.innerHeight - 44));
    }

    let x = (opts.x || 110) + off;
    let y = (opts.y || 60)  + off;
    if (isMobile) {
      const minX = 6;
      const minY = 36;
      const maxX = Math.max(minX, window.innerWidth - w - 6);
      const maxY = Math.max(minY, window.innerHeight - h - 6);
      x = Math.max(minX, Math.min(maxX, x));
      y = Math.max(minY, Math.min(maxY, y));
    }

    const el  = document.createElement('div');
    el.className     = 'window';
    el.id            = 'win-' + id;
    el.dataset.winId = id;
    el.style.left    = x + 'px';
    el.style.top     = y + 'px';
    el.style.width   = w + 'px';
    if (opts.h || isMobile) el.style.height = h + 'px';

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
    e.target.closest('.cv-lock-pad')?.querySelector('.cv-lock-ok')?.click();
  }
  if (e.key === 'Enter' && e.target.classList.contains('gb-msg')) {
    submitGuestbook();
  }
  if (e.key === 'Enter' && e.target.classList.contains('admin-pw-input')) {
    document.querySelector('#win-admin .admin-login-btn')?.click();
  }
});

document.addEventListener('click', async e => {
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
      if (win.dataset.prevX) win.style.left = win.dataset.prevX + 'px';
      if (win.dataset.prevY) win.style.top  = win.dataset.prevY + 'px';
      delete win.dataset.mobileFullscreen;
      delete win.dataset.zoomed;
    } else {
      win.dataset.prevW = win.offsetWidth;
      win.dataset.prevH = win.offsetHeight;
      win.dataset.prevX = parseInt(win.style.left) || 0;
      win.dataset.prevY = parseInt(win.style.top)  || 0;
      if (window.innerWidth <= 768) {
        win.dataset.mobileFullscreen = '1';
        win.style.left   = '0px';
        win.style.top    = '28px';
        win.style.width  = '100vw';
        win.style.height = 'calc(100vh - 28px)';
      } else {
        win.style.width  = '640px';
        win.style.height = '520px';
      }
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
      nowEditing = true;
      openNowWindow();
    } else if (action === 'cancel') {
      nowEditing = false;
      releaseNowPreviewObjectUrl();
      nowUploadedPictureData = '';
      nowPictureRemoved = false;
      openNowWindow();
    } else if (action === 'save') {
      if (!(await saveNowData(readNowFormData()))) return;
      nowEditing = false;
      releaseNowPreviewObjectUrl();
      nowUploadedPictureData = '';
      nowPictureRemoved = false;
      openNowWindow();
      refreshDevlogWindow();
    } else if (action === 'reset') {
      if (!(await resetNowData())) return;
      nowEditing = false;
      releaseNowPreviewObjectUrl();
      nowUploadedPictureData = '';
      nowPictureRemoved = false;
      openNowWindow();
      refreshDevlogWindow();
    }
    return;
  }

  // Devlog window actions
  const devlogAction = e.target.closest('[data-devlog-action]');
  if (devlogAction) {
    const action = devlogAction.dataset.devlogAction;
    if (action === 'edit') {
      devlogEditing = true;
      openDevlogWindow();
    } else if (action === 'cancel') {
      devlogEditing = false;
      refreshDevlogWindow();
    } else if (action === 'save') {
      if (!(await saveNowData(readDevlogFormData()))) return;
      devlogEditing = false;
      refreshDevlogWindow();
    }
    return;
  }

  // now password — OK / Cancel
  if (e.target.closest('.now-lock-ok')) {
    const lockWin = e.target.closest('.window');
    const lockId = lockWin?.dataset.winId || 'now-lock';
    const input = lockWin?.querySelector('.now-lock-input');
    const entered = String(input?.value || '');
    const expected = String(SITE.nowEditPassword || '').trim();
    if ((expected && entered === expected) || (!expected && entered)) {
      setNowAdminSessionPassword(entered);
      wm.close(lockId);
      if (lockId === 'devlog-lock') {
        devlogEditing = true;
        openDevlogWindow();
      } else {
        nowEditing = true;
        openNowWindow();
      }
    } else {
      lockWin?.querySelector('.now-lock-error')?.classList.add('visible');
      input?.select();
    }
    return;
  }
  if (e.target.closest('.now-lock-cancel')) {
    const lockWin = e.target.closest('.window');
    wm.close(lockWin?.dataset.winId || 'now-lock');
    return;
  }

  // Bin item actions
  const binAction = e.target.closest('.bin-item-action');
  if (binAction) {
    if (binAction.dataset.binAction === 'restore') restoreIcon(binAction.dataset.binId);
    if (binAction.dataset.binAction === 'cv-lock') openCvPasswordPrompt();
    return;
  }

  // cv password — OK button
  if (e.target.closest('.cv-lock-ok')) {
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
  if (e.target.closest('.sync-notice-ok')) {
    wm.close('sync-notice');
    if (syncNoticeTimer) {
      clearTimeout(syncNoticeTimer);
      syncNoticeTimer = null;
    }
    return;
  }

  // Guestbook: mood toggle
  const gbMoodBtn = e.target.closest('.gb-mood');
  if (gbMoodBtn) {
    gbMoodBtn.closest('.gb-moods')?.querySelectorAll('.gb-mood').forEach(b => b.classList.remove('active'));
    gbMoodBtn.classList.add('active');
    return;
  }
  if (e.target.closest('.gb-send')) { submitGuestbook(); return; }

  // Admin login / logout
  if (e.target.closest('.admin-login-btn')) {
    const input = document.querySelector('#win-admin .admin-pw-input');
    const entered = String(input?.value || '').trim();
    const expected = String(SITE.nowEditPassword || '').trim();
    if ((expected && entered === expected) || (!expected && entered)) {
      setNowAdminSessionPassword(entered);
      setAdminLoggedIn(true);
    } else {
      const st = document.getElementById('admin-status');
      if (st) { st.textContent = 'wrong password.'; st.style.color = 'var(--c-error, #c00)'; }
      input?.select();
    }
    return;
  }
  if (e.target.closest('.admin-logout-btn')) {
    setAdminLoggedIn(false);
    return;
  }

  // Guestbook admin: delete
  const gbDel = e.target.closest('.gb-admin-del');
  if (gbDel) { deleteGuestbookEntry(gbDel.dataset.gbid); return; }

  // Guestbook admin: pin
  const gbPin = e.target.closest('.gb-admin-pin');
  if (gbPin) { pinGuestbookEntry(gbPin.dataset.gbid); return; }

  // Sticky note unpin (admin)
  const stickyUnpin = e.target.closest('.sticky-unpin');
  if (stickyUnpin) { unpinGuestbookEntry(stickyUnpin.dataset.gbid); return; }
  if (e.target.closest('.gb-clr')) {
    const cv = document.getElementById('gb-canvas');
    if (cv && guestbookDrawCtx) {
      guestbookDrawCtx.fillStyle = '#fff';
      guestbookDrawCtx.fillRect(0, 0, cv.width, cv.height);
    }
    return;
  }
});

/* ── Content renderers ────────────────────────────────────────── */
const NOW_STORAGE_KEY = 'now:override';
const NOW_SYNC = (() => {
  const cfg = SITE?.nowSync && typeof SITE.nowSync === 'object' ? SITE.nowSync : {};
  const provider = String(cfg.provider || '').toLowerCase() || 'endpoint';
  const rawUrl = String(cfg.rawUrl || '').trim();
  const writeUrl = String(cfg.writeUrl || '').trim();
  const pollMs = Math.max(5000, Number(cfg.pollMs) || 15000);
  const enabled = Boolean(rawUrl);
  return {
    enabled,
    provider,
    rawUrl,
    writeUrl,
    canWrite: Boolean(writeUrl),
    pollMs,
  };
})();

const GUESTBOOK_SYNC = (() => {
  const cfg = SITE?.guestbookSync && typeof SITE.guestbookSync === 'object' ? SITE.guestbookSync : {};
  const readUrl  = String(cfg.readUrl  || '').trim();
  const writeUrl = String(cfg.writeUrl || '').trim();
  return {
    readUrl, writeUrl,
    enabled:  Boolean(readUrl),
    canWrite: Boolean(writeUrl),
    pollMs: Math.max(5000, Number(cfg.pollMs) || 12000),
  };
})();

const CAT_FRAMES = {
  grumpy: [
    String.raw` /\_/\
(=>m<=)
 (")(")`,
    String.raw` /\_/\
(=>m<=)
 (")(")~`,
    String.raw` /\_/\
~(=>m<=)
 (")(")`,
  ],
  happy: [
    String.raw` /\_/\
(=^w^=)
 (")(")`,
    String.raw` /\_/\
(=^w^=)
 (")(")~`,
    String.raw` /\_/\
~(=^w^=)
 (")(")`,
  ],
};

let nowPenguinTimer = null;
let nowPenguinFrame = 0;
let nowCatMood = 'grumpy';
let nowCatMoodTimer = null;
let nowEditing = false;
let devlogEditing = false;
let nowUploadedPictureData = '';
let nowPreviewObjectUrl = '';
let nowPictureRemoved = false;
let nowSharedData = null;
let nowSharedDataHash = '';
let nowSyncPollTimer = null;
let nowSyncBusy = false;
let nowAdminSessionPassword = '';
let syncNoticeTimer = null;
let guestbookEntries = [];
let guestbookPollTimer = null;
let guestbookDrawCtx = null;
let adminLoggedIn = sessionStorage.getItem('admin') === '1';
let adminCatTimer = null;
const activePinned = new Map(); // id → DOM element
const ADMIN_CAT_FRAMES = [
  '/\\_/\\\n(=^.^=)\n(")(")\u007e',
  '/\\_/\\\n(=-.-=)\n(")(")\u007e',
  '/\\_/\\\n(=^.^=)\n(")(")\u007e',
  '/\\_/\\\n(=^w^=)\n(")(")\u007e',
];

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

function releaseNowPreviewObjectUrl() {
  if (nowPreviewObjectUrl) {
    URL.revokeObjectURL(nowPreviewObjectUrl);
    nowPreviewObjectUrl = '';
  }
}

function downscaleDataUrl(dataUrl, maxSide = 1600, quality = 0.82) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const maxDim = Math.max(img.width, img.height);
      if (!maxDim || maxDim <= maxSide) { resolve(dataUrl); return; }
      const scale = maxSide / maxDim;
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(dataUrl); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

function getNzDateLabel(date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-NZ', {
      timeZone: 'Pacific/Auckland',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).formatToParts(date);
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';
    return `${day} ${month} ${year}`.trim();
  } catch (_) {
    return '21 April 2026';
  }
}

function formatIsoDateToNzLabel(iso) {
  const d = new Date(`${iso}T00:00:00+12:00`);
  return Number.isNaN(d.getTime()) ? iso : getNzDateLabel(d);
}

function parseDatedDevlogLine(line) {
  const value = String(line || '').trim();
  if (!value) return null;

  let m = value.match(/^(\d{1,2}\s+[A-Za-z]+\s+\d{4})\s*[-–—:|]\s*(.+)$/);
  if (!m) m = value.match(/^(\d{1,2}\s+[A-Za-z]+\s+\d{4})\s+(.+)$/);
  if (m) return { date: m[1].trim(), text: m[2].trim() };

  m = value.match(/^(\d{4}-\d{2}-\d{2})\s*[-–—:|]\s*(.+)$/);
  if (!m) m = value.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)$/);
  if (m) return { date: formatIsoDateToNzLabel(m[1].trim()), text: m[2].trim() };

  return null;
}

function normalizeDevlogEntry(entry) {
  if (typeof entry === 'string') {
    const parsed = parseDatedDevlogLine(entry);
    if (parsed?.text) return parsed;
    const text = entry.trim();
    return text ? { date: getNzDateLabel(), text } : null;
  }
  if (entry && typeof entry === 'object') {
    const text = String(entry.text || entry.value || '').trim();
    if (!text) return null;
    const parsed = parseDatedDevlogLine(text);
    if (!entry.date && parsed?.text) return parsed;
    const date = String(entry.date || '').trim() || getNzDateLabel();
    return { date, text };
  }
  return null;
}

function parseDevlogLines(value) {
  return linesToArray(value).map(line => {
    const parsed = parseDatedDevlogLine(line);
    if (parsed?.text) return parsed;
    return { date: getNzDateLabel(), text: line };
  });
}

function devlogToEditorLines(entries) {
  return entries.map(e => `${e.date} ${e.text}`).join('\n');
}

function normalizeNowData(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const devlogSource = Array.isArray(src.devlog) ? src.devlog : (Array.isArray(src.lately) ? src.lately : []);
  const pictureRemoved = src.pictureRemoved === true;
  const picture = pictureRemoved ? '' : (typeof src.picture === 'string' ? src.picture.trim() : '');
  const pictureAlt = String(src.pictureAlt || 'Picture of the day');
  const updatedAuto = src.updatedAuto !== false;
  const updated = updatedAuto ? getNzDateLabel() : String(src.updated || getNzDateLabel());
  return {
    updated,
    updatedAuto,
    by: String(src.by || 'anyone can edit'),
    status: String(src.status || 'Thinking, writing, and making.'),
    focus: Array.isArray(src.focus) ? src.focus.map(v => String(v)).filter(Boolean) : [],
    devlog: devlogSource.map(normalizeDevlogEntry).filter(Boolean),
    picture,
    pictureRemoved,
    pictureAlt,
  };
}

function nowSyncWriteReady() {
  return Boolean(NOW_SYNC.enabled && NOW_SYNC.canWrite);
}

function getNowAdminSessionPassword() {
  return String(nowAdminSessionPassword || '').trim();
}

function setNowAdminSessionPassword(value) {
  nowAdminSessionPassword = String(value || '').trim();
}

function showSyncNotice(message = 'Saved to now.live.') {
  if (!wm) return;
  const html = `<div class="mac-error mac-notice">
    <div class="mac-error-msg">${escapeHtml(message)}</div>
    <div class="mac-error-actions"><button class="bin-error-ok sync-notice-ok">OK</button></div>
  </div>`;
  const existing = wm.open?.['sync-notice'];
  if (existing) {
    existing.querySelector('.win-body').innerHTML = `<div class="win-pad">${html}</div>`;
    wm.focus(existing);
  } else {
    wm.show('sync-notice', { title: 'Notice', html, w: 280, h: 138 });
  }
  if (syncNoticeTimer) clearTimeout(syncNoticeTimer);
  syncNoticeTimer = setTimeout(() => {
    wm?.close?.('sync-notice');
    syncNoticeTimer = null;
  }, 1600);
}

function readNowDataFromLocal(base) {
  try {
    const raw = localStorage.getItem(NOW_STORAGE_KEY);
    if (!raw) return null;
    const override = JSON.parse(raw);
    const overrideDevlog = Array.isArray(override?.devlog)
      ? override.devlog
      : (Array.isArray(override?.lately) ? override.lately : base.devlog);
    return normalizeNowData({
      updatedAuto: typeof override?.updatedAuto === 'boolean' ? override.updatedAuto : base.updatedAuto,
      updated: typeof override?.updated === 'string' ? override.updated : base.updated,
      by: typeof override?.by === 'string' ? override.by : base.by,
      status: typeof override?.status === 'string' ? override.status : base.status,
      focus: Array.isArray(override?.focus) ? override.focus : base.focus,
      devlog: overrideDevlog,
      pictureRemoved: override?.pictureRemoved === true,
      picture: override?.pictureRemoved === true
        ? ''
        : ((typeof override?.picture === 'string' && override.picture.trim()) ? override.picture : base.picture),
      pictureAlt: (typeof override?.pictureAlt === 'string' && override.pictureAlt.trim())
        ? override.pictureAlt
        : base.pictureAlt,
    });
  } catch (_) {
    return null;
  }
}

function applyNowSharedData(data, { persistLocal = true, refresh = true } = {}) {
  const normalized = normalizeNowData(data);
  const nextHash = JSON.stringify(normalized);
  const changed = nextHash !== nowSharedDataHash;
  nowSharedData = normalized;
  nowSharedDataHash = nextHash;
  if (persistLocal) {
    try { localStorage.setItem(NOW_STORAGE_KEY, nextHash); } catch (_) {}
  }
  if (changed && refresh) {
    if (!nowEditing && wm?.open?.now) openNowWindow();
    if (!devlogEditing && wm?.open?.devlog) refreshDevlogWindow();
  }
  return changed;
}

function getNowData() {
  const base = normalizeNowData(SITE.now);
  if (nowSharedData) return normalizeNowData(nowSharedData);
  const local = readNowDataFromLocal(base);
  if (local) {
    applyNowSharedData(local, { persistLocal: false, refresh: false });
    return local;
  }
  applyNowSharedData(base, { persistLocal: false, refresh: false });
  return base;
}

async function fetchNowDataFromRemote() {
  if (!NOW_SYNC.enabled) return null;
  const url = `${NOW_SYNC.rawUrl}${NOW_SYNC.rawUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load shared now.live');
  const body = await res.json();
  return normalizeNowData(body);
}

async function publishNowDataToEndpoint(data) {
  if (!nowSyncWriteReady()) throw new Error('Live write endpoint is not configured.');
  const password = getNowAdminSessionPassword();
  if (!password) throw new Error('Admin session expired. Unlock edit and save again.');
  const res = await fetch(NOW_SYNC.writeUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      password,
      data: normalizeNowData(data),
      source: 'now.live',
    }),
  });
  let payload = null;
  try { payload = await res.json(); } catch (_) {}
  if (!res.ok || payload?.ok === false) {
    const message = String(payload?.error || `Live publish failed (${res.status}).`);
    throw new Error(message);
  }
  return normalizeNowData(payload?.data || data);
}

async function syncNowDataFromRemote() {
  if (!NOW_SYNC.enabled || nowSyncBusy) return;
  nowSyncBusy = true;
  try {
    const remote = await fetchNowDataFromRemote();
    if (remote) applyNowSharedData(remote, { persistLocal: true, refresh: true });
  } catch (_) {
    // Keep local view as fallback when remote is unreachable.
  } finally {
    nowSyncBusy = false;
  }
}

async function saveNowData(data, options = {}) {
  const successMessage = String(options.successMessage || 'Saved to now.live.');
  const normalized = normalizeNowData(data);
  if (!NOW_SYNC.enabled || !nowSyncWriteReady()) {
    applyNowSharedData(normalized, { persistLocal: true, refresh: false });
    if (NOW_SYNC.enabled && !nowSyncWriteReady()) {
      alert('Live endpoint is not configured. Saved locally only.');
    }
    if (!NOW_SYNC.enabled) showSyncNotice('Saved locally.');
    return true;
  }
  try {
    const published = await publishNowDataToEndpoint(normalized);
    applyNowSharedData(published, { persistLocal: true, refresh: false });
    showSyncNotice(successMessage);
    return true;
  } catch (err) {
    try { localStorage.setItem(NOW_STORAGE_KEY, JSON.stringify(normalized)); } catch (_) {}
    alert(`${err?.message || 'Live publish failed.'} Saved locally only.`);
    return false;
  }
}

async function resetNowData() {
  const base = normalizeNowData(SITE.now);
  if (!NOW_SYNC.enabled) {
    nowSharedData = null;
    nowSharedDataHash = '';
    try { localStorage.removeItem(NOW_STORAGE_KEY); } catch (_) {}
    showSyncNotice('Restored local defaults.');
    return true;
  }
  return saveNowData(base, { successMessage: 'Restored now.live defaults.' });
}

function initNowSync() {
  const initial = getNowData();
  applyNowSharedData(initial, { persistLocal: true, refresh: false });
  if (!NOW_SYNC.enabled) return;
  syncNowDataFromRemote();
  if (!nowSyncPollTimer) {
    nowSyncPollTimer = setInterval(() => { syncNowDataFromRemote(); }, NOW_SYNC.pollMs);
  }
}

function readNowFormData() {
  const current = getNowData();
  const manualPicture = String(document.getElementById('now-input-picture')?.value || '').trim();
  return normalizeNowData({
    updatedAuto: true,
    by: document.getElementById('now-input-by')?.value || '',
    status: document.getElementById('now-input-status')?.value || '',
    focus: linesToArray(document.getElementById('now-input-focus')?.value || ''),
    devlog: current.devlog,
    pictureRemoved: nowPictureRemoved,
    picture: nowPictureRemoved ? '' : (nowUploadedPictureData || manualPicture),
    pictureAlt: document.getElementById('now-input-picture-alt')?.value || '',
  });
}

function readDevlogFormData() {
  const current = getNowData();
  return normalizeNowData({
    updatedAuto: true,
    by: current.by,
    status: current.status,
    focus: current.focus,
    picture: current.picture,
    pictureRemoved: current.pictureRemoved,
    pictureAlt: current.pictureAlt,
    devlog: parseDevlogLines(document.getElementById('devlog-input-lines')?.value || ''),
  });
}

function bindNowEditMediaControls() {
  const fileInput = document.getElementById('now-input-photo-file');
  const urlInput = document.getElementById('now-input-picture');
  const preview = document.getElementById('now-photo-preview');
  const hint = document.getElementById('now-photo-hint');
  const removeBtn = document.getElementById('now-remove-photo');
  const removedInput = document.getElementById('now-input-picture-removed');
  if (!fileInput || !urlInput || !preview) return;

  const defaultHint = nowSyncWriteReady()
    ? 'Image uploads publish live after Save succeeds.'
    : 'Image upload is saved in this browser on this device.';
  const setHint = text => { if (hint) hint.textContent = text; };
  const currentInput = String(urlInput.value || '').trim();
  nowPictureRemoved = removedInput?.value === '1';
  if (currentInput.startsWith('data:image/')) nowUploadedPictureData = currentInput;

  const syncPreview = () => {
    const src = nowPictureRemoved ? '' : (nowUploadedPictureData || (urlInput.value || '').trim());
    if (src) {
      preview.src = src;
      preview.hidden = false;
      setHint(defaultHint);
    } else {
      preview.removeAttribute('src');
      preview.hidden = true;
      setHint(defaultHint);
    }
  };

  preview.addEventListener('error', () => {
    setHint('Preview failed. Please use PNG, JPG, WEBP, or GIF.');
  });
  preview.addEventListener('load', () => {
    setHint(defaultHint);
  });

  urlInput.addEventListener('input', () => {
    nowUploadedPictureData = '';
    nowPictureRemoved = false;
    if (removedInput) removedInput.value = '';
    releaseNowPreviewObjectUrl();
    syncPreview();
  });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    const mime = String(file.type || '').toLowerCase();
    const name = String(file.name || '').toLowerCase();
    const hasImageExt = /\.(png|jpe?g|webp|gif)$/.test(name);
    if (!mime.startsWith('image/') && !hasImageExt) {
      setHint('This file is not an image.');
      return;
    }
    if (mime && !['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'].includes(mime)) {
      setHint('Unsupported format. Please upload PNG, JPG, WEBP, or GIF.');
      return;
    }
    releaseNowPreviewObjectUrl();
    nowPreviewObjectUrl = URL.createObjectURL(file);
    preview.src = nowPreviewObjectUrl;
    preview.hidden = false;
    nowPictureRemoved = false;
    if (removedInput) removedInput.value = '';
    setHint('Loaded local image. Preparing image for save...');
    const reader = new FileReader();
    reader.onload = async () => {
      let dataUrl = String(reader.result || '');
      if (!dataUrl.startsWith('data:image/')) {
        setHint('Could not read this image.');
        return;
      }
      if (dataUrl.length > 450000) dataUrl = await downscaleDataUrl(dataUrl);
      nowUploadedPictureData = dataUrl;
      setHint('Image ready. Click Save to keep it.');
    };
    reader.readAsDataURL(file);
  });
  removeBtn?.addEventListener('click', () => {
    nowUploadedPictureData = '';
    nowPictureRemoved = true;
    if (removedInput) removedInput.value = '1';
    releaseNowPreviewObjectUrl();
    urlInput.value = '';
    fileInput.value = '';
    preview.removeAttribute('src');
    preview.hidden = true;
    setHint('Photo removed.');
  });
  syncPreview();
}

function stopNowPenguinAnimation() {
  if (nowPenguinTimer) {
    clearInterval(nowPenguinTimer);
    nowPenguinTimer = null;
  }
  if (nowCatMoodTimer) {
    clearTimeout(nowCatMoodTimer);
    nowCatMoodTimer = null;
  }
  nowCatMood = 'grumpy';
}

function setNowCatMood(mood, fallbackMs = 0) {
  nowCatMood = mood;
  if (nowCatMoodTimer) {
    clearTimeout(nowCatMoodTimer);
    nowCatMoodTimer = null;
  }
  if (fallbackMs > 0) {
    nowCatMoodTimer = setTimeout(() => {
      nowCatMood = 'grumpy';
      nowCatMoodTimer = null;
    }, fallbackMs);
  }
}

function bindNowCatInteractions(el) {
  if (!el) return;
  el.onpointerenter = () => setNowCatMood('happy');
  el.onpointerleave = () => setNowCatMood('grumpy');
  el.onpointerdown = () => setNowCatMood('happy');
  el.onpointerup = () => setNowCatMood('happy', 1200);
  el.onpointercancel = () => setNowCatMood('grumpy');
  el.onmousedown = () => setNowCatMood('happy');
  el.onmouseup = () => setNowCatMood('happy', 1200);
  el.ontouchstart = () => setNowCatMood('happy');
  el.ontouchend = () => setNowCatMood('happy', 1200);
}

function startNowPenguinAnimation() {
  stopNowPenguinAnimation();
  const el = document.getElementById('now-penguin-frame');
  if (!el) return;
  bindNowCatInteractions(el);
  el.textContent = CAT_FRAMES.grumpy[0];
  nowPenguinFrame = 1;
  nowPenguinTimer = setInterval(() => {
    const frameEl = document.getElementById('now-penguin-frame');
    if (!frameEl) { stopNowPenguinAnimation(); return; }
    const frames = CAT_FRAMES[nowCatMood] || CAT_FRAMES.grumpy;
    frameEl.textContent = frames[nowPenguinFrame];
    nowPenguinFrame = (nowPenguinFrame + 1) % frames.length;
  }, 260);
}

function renderNow() {
  const nowData = getNowData();
  const focusHtml = nowData.focus.map(item => `<li>${escapeHtml(item)}</li>`).join('') || '<li>Click Edit to add focus items.</li>';
  const pictureHtml = nowData.picture
    ? `<figure class="now-photo">
         <img src="${escapeHtml(nowData.picture)}" alt="${escapeHtml(nowData.pictureAlt || 'Picture of the day')}" loading="lazy" />
         <figcaption>${escapeHtml(nowData.pictureAlt || 'Picture of the day')}</figcaption>
       </figure>`
    : '';
  const editControls = nowEditing
    ? `<button class="now-btn" data-now-action="save">Save</button>
       <button class="now-btn" data-now-action="cancel">Cancel</button>
       <button class="now-btn" data-now-action="reset">Reset</button>`
    : adminLoggedIn
      ? `<button class="now-btn" data-now-action="edit">Edit</button>`
      : '';

  const body = nowEditing
    ? `<div class="now-edit-grid">
         <input id="now-input-picture-removed" type="hidden" value="${nowData.pictureRemoved ? '1' : ''}" />
         <div class="now-hint">Updated is automatic in NZ time: ${escapeHtml(nowData.updated)}</div>
         ${NOW_SYNC.enabled ? `<div class="now-hint">${nowSyncWriteReady() ? 'Live sync is on. Save publishes for everyone.' : 'Live sync read is on. writeUrl not configured yet.'}</div>` : ''}
         <label class="now-label" for="now-input-by">By</label>
         <input id="now-input-by" class="now-input" type="text" value="${escapeHtml(nowData.by)}" />
         <label class="now-label" for="now-input-status">Status</label>
         <textarea id="now-input-status" class="now-textarea" rows="3">${escapeHtml(nowData.status)}</textarea>
         <label class="now-label" for="now-input-picture">Picture Of The Day URL</label>
         <input id="now-input-picture" class="now-input" type="text" value="${escapeHtml(nowData.picture)}" />
         <label class="now-label" for="now-input-photo-file">Or Upload Picture</label>
         <input id="now-input-photo-file" class="now-file" type="file" accept="image/png,image/jpeg,image/jpg,image/webp,image/gif" />
         <button id="now-remove-photo" class="now-btn now-btn-inline" type="button">Remove Photo</button>
         <label class="now-label" for="now-input-picture-alt">Picture Caption</label>
         <input id="now-input-picture-alt" class="now-input" type="text" value="${escapeHtml(nowData.pictureAlt)}" />
         <img id="now-photo-preview" class="now-photo-preview" alt="Picture preview" hidden />
         <div id="now-photo-hint" class="now-hint">${nowSyncWriteReady() ? 'Image uploads publish live after Save succeeds.' : 'Image upload is saved in this browser on this device.'}</div>
         <label class="now-label" for="now-input-focus">Current Focus (one line each)</label>
         <textarea id="now-input-focus" class="now-textarea" rows="4">${escapeHtml(nowData.focus.join('\n'))}</textarea>
       </div>`
    : `<div class="now-updated">Updated: ${escapeHtml(nowData.updated)}</div>
       <div class="now-by">By: ${escapeHtml(nowData.by)}</div>
       <div class="now-status">${escapeHtml(nowData.status)}</div>
       ${pictureHtml}
       <div class="now-block-title">Current Focus</div>
       <ul class="now-list">${focusHtml}</ul>`;

  return `
    <div class="now-wrap">
      <pre id="now-penguin-frame" class="now-penguin-ascii" aria-label="Animated ASCII cat. Hover to pat."></pre>
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
    if (nowEditing) bindNowEditMediaControls();
    startNowPenguinAnimation();
    return;
  }
  wm.show('now', { title: 'now.live', html: renderNow(), w: 340, h: 360, x: 350, y: 72 });
  if (nowEditing) bindNowEditMediaControls();
  startNowPenguinAnimation();
}

function openNowEditPasswordPrompt() {
  if (wm.open['now-lock']) { wm.focus(wm.open['now-lock']); return; }
  wm.show('now-lock', {
    title: 'now.live',
    html: `<div class="now-lock-pad">
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
  setTimeout(() => document.querySelector('#win-now-lock .now-lock-input')?.focus(), 50);
}

function openDevlogEditPasswordPrompt() {
  if (wm.open['devlog-lock']) { wm.focus(wm.open['devlog-lock']); return; }
  wm.show('devlog-lock', {
    title: 'devlog.md',
    html: `<div class="now-lock-pad">
      <div class="now-lock-msg">Admin password required to update this file.</div>
      <input class="now-lock-input" type="password" placeholder="Password" />
      <div class="now-lock-error">Incorrect password.</div>
      <div class="now-lock-actions">
        <button class="now-lock-cancel">Cancel</button>
        <button class="now-lock-ok">Unlock</button>
      </div>
    </div>`,
    w: 280, h: 175,
  });
  setTimeout(() => document.querySelector('#win-devlog-lock .now-lock-input')?.focus(), 50);
}

function renderDevlog() {
  const nowData = getNowData();
  const controls = devlogEditing
    ? `<button class="now-btn" data-devlog-action="save">Save</button>
       <button class="now-btn" data-devlog-action="cancel">Cancel</button>`
    : adminLoggedIn
      ? `<button class="now-btn" data-devlog-action="edit">Update</button>`
      : '';
  const body = devlogEditing
    ? `<div class="now-edit-grid">
         <div class="now-hint">One line per update. Format: 21 April 2026 your note</div>
         ${NOW_SYNC.enabled ? `<div class="now-hint">${nowSyncWriteReady() ? 'Live sync is on. Save publishes for everyone.' : 'Live sync read is on. writeUrl not configured yet.'}</div>` : ''}
         <textarea id="devlog-input-lines" class="now-textarea" rows="10">${escapeHtml(devlogToEditorLines(nowData.devlog))}</textarea>
       </div>`
    : (nowData.devlog.length
      ? nowData.devlog.map((entry, idx) => `
        <div class="devlog-entry">
          <div class="devlog-index">${escapeHtml(entry.date)} · #${idx + 1}</div>
          <div class="devlog-text">${escapeHtml(entry.text)}</div>
        </div>
      `).join('')
      : '<p class="empty">No devlog entries yet.</p>');
  return `<div class="devlog-wrap"><div class="now-actions">${controls}</div>${body}</div>`;
}

function openDevlogWindow() {
  if (!wm) return;
  const existing = wm.open?.devlog;
  if (existing) {
    existing.querySelector('.win-body').innerHTML = `<div class="win-pad">${renderDevlog()}</div>`;
    wm.focus(existing);
    return;
  }
  wm.show('devlog', { title: 'devlog.md', html: renderDevlog(), w: 400, h: 360, x: 82, y: 220 });
}

function refreshDevlogWindow() {
  const win = wm?.open?.devlog;
  if (!win) return;
  win.querySelector('.win-body').innerHTML = `<div class="win-pad">${renderDevlog()}</div>`;
}

/* ── Guestbook ────────────────────────────────────────────────── */
function renderGuestbookEntries() {
  if (!guestbookEntries.length) {
    return '<div class="gb-empty">No entries yet. Be the first.</div>';
  }
  return guestbookEntries.map(e => `
    <div class="gb-entry">
      <div class="gb-entry-hd">&gt;&nbsp;${escapeHtml(e.ts || e.timestamp || '')}&nbsp;&bull;&nbsp;${escapeHtml(e.name)}&nbsp;<span class="gb-mood-stamp">${escapeHtml(e.mood || '')}</span>${adminLoggedIn ? `<span class="gb-admin-btns"><button class="gb-admin-pin" data-gbid="${escapeHtml(String(e.id))}">pin</button><button class="gb-admin-del" data-gbid="${escapeHtml(String(e.id))}">del</button></span>` : ''}</div>
      <div class="gb-entry-body">${escapeHtml(e.message)}</div>
      ${e.drawing ? `<div class="gb-entry-draw"><img src="${escapeHtml(e.drawing)}" alt="" class="gb-draw-img" /></div>` : ''}
    </div>
  `).join('');
}

function renderGuestbook() {
  return `
    <div class="gb-wrap">
      <div class="gb-terminal" id="gb-terminal">${renderGuestbookEntries()}</div>
      <div class="gb-form">
        <div class="gb-row">
          <input class="gb-input gb-name" type="text" placeholder="name" maxlength="40" autocomplete="off" />
          <input class="gb-input gb-msg"  type="text" placeholder="say something..." maxlength="300" autocomplete="off" />
        </div>
        <div class="gb-row gb-footer">
          <div class="gb-moods">
            <button class="gb-mood active" data-gm=":)">:)</button>
            <button class="gb-mood"        data-gm=":(">:(</button>
            <button class="gb-mood"        data-gm="!?">!?</button>
          </div>
          <label class="gb-draw-label"><input type="checkbox" id="gb-draw-chk" />&nbsp;draw</label>
          <button class="gb-send">&rarr;&nbsp;send</button>
        </div>
        <div class="gb-canvas-wrap" id="gb-canvas-wrap" style="display:none">
          <canvas id="gb-canvas" class="gb-canvas"></canvas>
          <button class="gb-clr">clear</button>
        </div>
      </div>
    </div>
  `;
}

function openGuestbookWindow() {
  if (!wm) return;
  if (wm.open?.guestbook) { wm.focus(wm.open.guestbook); return; }
  wm.show('guestbook', { title: 'guestbook.live', html: renderGuestbook(), w: 460, h: 420 });
  setTimeout(() => bindGuestbookCanvas(), 30);
}

function refreshGuestbookTerminal() {
  const t = document.getElementById('gb-terminal');
  if (t) t.innerHTML = renderGuestbookEntries();
}

function bindGuestbookCanvas() {
  const check = document.getElementById('gb-draw-chk');
  const wrap  = document.getElementById('gb-canvas-wrap');
  if (!check || !wrap) return;
  check.addEventListener('change', () => {
    wrap.style.display = check.checked ? 'block' : 'none';
    if (check.checked) initGuestbookCanvas();
  });
}

function initGuestbookCanvas() {
  const canvas = document.getElementById('gb-canvas');
  if (!canvas || guestbookDrawCtx) return;
  canvas.width  = canvas.parentElement?.offsetWidth || 300;
  canvas.height = 72;
  guestbookDrawCtx = canvas.getContext('2d');
  guestbookDrawCtx.fillStyle = '#ffffff';
  guestbookDrawCtx.fillRect(0, 0, canvas.width, canvas.height);

  let drawing = false, lx = 0, ly = 0;
  const getPos = e => {
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width, sy = canvas.height / r.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
  };
  const start = e => { drawing = true; const p = getPos(e); lx = p.x; ly = p.y; e.preventDefault(); };
  const move  = e => {
    if (!drawing) return;
    const p = getPos(e);
    guestbookDrawCtx.beginPath();
    guestbookDrawCtx.moveTo(lx, ly);
    guestbookDrawCtx.lineTo(p.x, p.y);
    guestbookDrawCtx.strokeStyle = '#000';
    guestbookDrawCtx.lineWidth = 2;
    guestbookDrawCtx.lineCap = 'round';
    guestbookDrawCtx.stroke();
    lx = p.x; ly = p.y;
    e.preventDefault();
  };
  const stop = () => { drawing = false; };

  canvas.addEventListener('mousedown',  start);
  canvas.addEventListener('mousemove',  move);
  canvas.addEventListener('mouseup',    stop);
  canvas.addEventListener('mouseleave', stop);
  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove',  move,  { passive: false });
  canvas.addEventListener('touchend',   stop);
}

function showStickyNote(entry) {
  const desktop = document.getElementById('desktop');
  if (!desktop) return;
  const note = document.createElement('div');
  note.className = 'sticky-note is-falling';

  const rot = (Math.random() * 8 - 4).toFixed(1);
  note.style.setProperty('--rot', rot + 'deg');

  const startX = Math.min(
    Math.floor(Math.random() * Math.max(60, desktop.offsetWidth - 220) + 30),
    desktop.offsetWidth - 190
  );
  const startY = 30 + Math.floor(Math.random() * 40);
  note.style.left = startX + 'px';
  note.style.top  = startY + 'px';
  note.style.zIndex = 9000;

  const fallDist = desktop.offsetHeight - startY + 10;
  const fallDur  = (2.5 + Math.random() * 2).toFixed(1);
  note.style.setProperty('--fall-dist', fallDist + 'px');
  note.style.setProperty('--fall-dur', fallDur + 's');

  const ts  = entry.ts || entry.timestamp || '';
  const msg = (entry.message || '').length > 90 ? entry.message.slice(0, 90) + '\u2026' : (entry.message || '');
  note.innerHTML = `
    <button class="sticky-close" aria-label="Close">\u00d7</button>
    <div class="sticky-who">${escapeHtml(entry.name)}&nbsp;${escapeHtml(entry.mood || '')}</div>
    ${ts ? `<div class="sticky-ts">${escapeHtml(ts)}</div>` : ''}
    <div class="sticky-txt">${escapeHtml(msg)}</div>
    ${entry.drawing ? '<div class="sticky-draw">\u270f drawing</div>' : ''}
  `;
  desktop.appendChild(note);

  note.addEventListener('animationend', () => note.remove());

  note.querySelector('.sticky-close').addEventListener('click', () => note.remove());

  let dragging = false, ox = 0, oy = 0;
  note.addEventListener('pointerdown', e => {
    if (e.target.closest('.sticky-close')) return;
    // Freeze at current visual position
    const deskRect = desktop.getBoundingClientRect();
    const noteRect = note.getBoundingClientRect();
    note.classList.remove('is-falling');
    note.classList.add('is-caught');
    note.style.left = (noteRect.left - deskRect.left) + 'px';
    note.style.top  = (noteRect.top  - deskRect.top)  + 'px';
    note.style.transform = `rotate(${rot}deg)`;
    note.style.zIndex = 9001;

    dragging = true;
    ox = e.clientX - (noteRect.left - deskRect.left);
    oy = e.clientY - (noteRect.top  - deskRect.top);
    note.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  note.addEventListener('pointermove', e => {
    if (!dragging) return;
    note.style.left = (e.clientX - ox) + 'px';
    note.style.top  = (e.clientY - oy) + 'px';
  });
  note.addEventListener('pointerup', () => { dragging = false; });
}

async function submitGuestbook() {
  if (!GUESTBOOK_SYNC.canWrite) return;
  const nameEl = document.querySelector('#win-guestbook .gb-name');
  const msgEl  = document.querySelector('#win-guestbook .gb-msg');
  const active = document.querySelector('#win-guestbook .gb-mood.active');
  const drawChk = document.getElementById('gb-draw-chk');

  const name    = String(nameEl?.value || '').trim() || 'anon';
  const message = String(msgEl?.value  || '').trim();
  const mood    = active?.dataset.gm || ':)';
  if (!message) { msgEl?.focus(); return; }

  let drawing = null;
  if (drawChk?.checked && guestbookDrawCtx) {
    const cv = document.getElementById('gb-canvas');
    if (cv) {
      let d = cv.toDataURL('image/jpeg', 0.65);
      if (d.length > 50000) d = await downscaleDataUrl(d, 240, 0.55);
      drawing = d;
    }
  }

  const btn = document.querySelector('#win-guestbook .gb-send');
  if (btn) btn.textContent = '\u2026';

  try {
    const res = await fetch(GUESTBOOK_SYNC.writeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mood, message, drawing }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) throw new Error(data.error || 'Failed to send.');

    if (nameEl) nameEl.value = '';
    if (msgEl)  msgEl.value  = '';
    if (drawChk?.checked && guestbookDrawCtx) {
      const cv = document.getElementById('gb-canvas');
      if (cv) { guestbookDrawCtx.fillStyle = '#fff'; guestbookDrawCtx.fillRect(0, 0, cv.width, cv.height); }
    }

    const entry = data.entry || { name, mood, message, drawing, timestamp: getNzDateLabel() };
    guestbookEntries.unshift(entry);
    refreshGuestbookTerminal();
    showStickyNote(entry);
  } catch (err) {
    alert(err.message || 'Could not send.');
  } finally {
    if (btn) btn.innerHTML = '&rarr;&nbsp;send';
  }
}

async function fetchGuestbookFromRemote() {
  if (!GUESTBOOK_SYNC.enabled) return;
  try {
    const res = await fetch(`${GUESTBOOK_SYNC.readUrl}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data.entries)) {
      guestbookEntries = data.entries;
      refreshGuestbookTerminal();
    }
    if (Array.isArray(data.pinned)) syncPinnedNotes(data.pinned);
  } catch (_) {}
}

function initGuestbookSync() {
  fetchGuestbookFromRemote();
  if (!guestbookPollTimer && GUESTBOOK_SYNC.enabled) {
    guestbookPollTimer = setInterval(fetchGuestbookFromRemote, GUESTBOOK_SYNC.pollMs);
  }
}

/* ── Admin ────────────────────────────────────────────────────── */
function renderAdminLogin() {
  if (adminLoggedIn) {
    return `<div class="admin-wrap">
      <pre class="admin-cat" id="admin-cat">${ADMIN_CAT_FRAMES[0]}</pre>
      <div class="admin-status admin-ok">\u2713 logged in</div>
      <button class="admin-logout-btn">logout</button>
    </div>`;
  }
  return `<div class="admin-wrap">
    <pre class="admin-cat" id="admin-cat">${ADMIN_CAT_FRAMES[0]}</pre>
    <div class="admin-status" id="admin-status">&nbsp;</div>
    <input type="password" class="admin-pw-input" placeholder="password" autocomplete="current-password" />
    <button class="admin-login-btn">\u2192 enter</button>
  </div>`;
}

function openAdminLoginWindow() {
  if (!wm) return;
  if (wm.open?.['admin']) {
    const existing = wm.open['admin'];
    existing.querySelector('.win-body').innerHTML = `<div class="win-pad">${renderAdminLogin()}</div>`;
    wm.focus(existing);
    setTimeout(() => { startAdminCatAnimation(); if (!adminLoggedIn) document.querySelector('#win-admin .admin-pw-input')?.focus(); }, 30);
    return;
  }
  wm.show('admin', { title: '42 inches to mars!', html: renderAdminLogin(), w: 210, h: 210 });
  setTimeout(() => { startAdminCatAnimation(); if (!adminLoggedIn) document.querySelector('#win-admin .admin-pw-input')?.focus(); }, 50);
}

function startAdminCatAnimation() {
  if (adminCatTimer) clearInterval(adminCatTimer);
  let frame = 0;
  adminCatTimer = setInterval(() => {
    const cat = document.getElementById('admin-cat');
    if (!cat) { clearInterval(adminCatTimer); adminCatTimer = null; return; }
    frame = (frame + 1) % ADMIN_CAT_FRAMES.length;
    cat.textContent = ADMIN_CAT_FRAMES[frame];
  }, 550);
}

function setAdminLoggedIn(val) {
  adminLoggedIn = val;
  if (val) {
    sessionStorage.setItem('admin', '1');
  } else {
    sessionStorage.removeItem('admin');
    setNowAdminSessionPassword('');
    nowEditing = false;
    devlogEditing = false;
  }
  if (wm?.open?.['admin']) openAdminLoginWindow();
  if (wm?.open?.now) openNowWindow();
  if (wm?.open?.devlog) openDevlogWindow();
  if (wm?.open?.guestbook) refreshGuestbookTerminal();
  // Sync unpin button on existing pinned notes immediately (no fetch needed)
  activePinned.forEach((el, id) => {
    const existing = el.querySelector('.sticky-unpin');
    if (val && !existing) {
      const btn = document.createElement('button');
      btn.className = 'sticky-unpin';
      btn.dataset.gbid = id;
      btn.textContent = 'unpin';
      el.appendChild(btn);
    } else if (!val && existing) {
      existing.remove();
    }
  });
}

/* ── Guestbook admin actions ──────────────────────────────────── */
async function deleteGuestbookEntry(id) {
  if (!GUESTBOOK_SYNC.canWrite || !adminLoggedIn) return;
  try {
    const res = await fetch(GUESTBOOK_SYNC.writeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id, password: getNowAdminSessionPassword() || SITE.nowEditPassword }),
    });
    const data = await res.json();
    if (data.ok) {
      guestbookEntries = guestbookEntries.filter(e => String(e.id) !== String(id));
      refreshGuestbookTerminal();
    }
  } catch (_) {}
}

async function pinGuestbookEntry(id) {
  if (!GUESTBOOK_SYNC.canWrite || !adminLoggedIn) return;
  try {
    const res = await fetch(GUESTBOOK_SYNC.writeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pin', id, password: getNowAdminSessionPassword() || SITE.nowEditPassword }),
    });
    const data = await res.json();
    if (data.ok && data.entry) {
      // Clear any existing pinned notes first (one at a time)
      activePinned.forEach(el => el.remove());
      activePinned.clear();
      const el = showPinnedNote(data.entry);
      if (el) activePinned.set(String(id), el);
    }
  } catch (_) {}
}

async function unpinGuestbookEntry(id) {
  if (!GUESTBOOK_SYNC.canWrite || !adminLoggedIn) return;
  try {
    const res = await fetch(GUESTBOOK_SYNC.writeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unpin', id, password: getNowAdminSessionPassword() || SITE.nowEditPassword }),
    });
    const data = await res.json();
    if (data.ok) {
      activePinned.get(String(id))?.remove();
      activePinned.delete(String(id));
    }
  } catch (_) {}
}

/* ── Pinned sticky notes ──────────────────────────────────────── */
function showPinnedNote(entry) {
  const desktop = document.getElementById('desktop');
  if (!desktop) return null;
  const note = document.createElement('div');
  note.className = 'sticky-note is-pinned';
  note.style.zIndex = 9000;
  const rot = (Math.random() * 4 - 2).toFixed(1);
  note.style.setProperty('--rot', rot + 'deg');
  const ts  = entry.ts || entry.timestamp || '';
  const msg = (entry.message || '').length > 120 ? entry.message.slice(0, 120) + '\u2026' : (entry.message || '');
  note.innerHTML = `
    <div class="sticky-pin-mark">\u{1F4CC}</div>
    <div class="sticky-who">${escapeHtml(entry.name)}&nbsp;${escapeHtml(entry.mood || '')}</div>
    ${ts ? `<div class="sticky-ts">${escapeHtml(ts)}</div>` : ''}
    <div class="sticky-txt">${escapeHtml(msg)}</div>
    ${entry.drawing ? `<img src="${escapeHtml(entry.drawing)}" alt="" class="gb-draw-img" style="margin-top:4px;width:100%" />` : ''}
    ${adminLoggedIn ? `<button class="sticky-unpin" data-gbid="${escapeHtml(String(entry.id))}">unpin</button>` : ''}
  `;
  desktop.appendChild(note);
  return note;
}

function syncPinnedNotes(pinned) {
  const incoming = new Set(pinned.map(p => String(p.id)));
  activePinned.forEach((el, id) => {
    if (!incoming.has(id)) { el.remove(); activePinned.delete(id); }
  });
  pinned.forEach(entry => {
    if (!activePinned.has(String(entry.id))) {
      const el = showPinnedNote(entry);
      if (el) activePinned.set(String(entry.id), el);
    }
  });
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
            ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.title}</a>`
                    : `${p.title}`}
          </div>
          <div class="entry-meta">${p.venue} &nbsp;&middot;&nbsp; ${p.date}</div>
        </div>
      `).join('')
    : '<p class="empty">No papers yet.</p>';

  const confs = SITE.conferences.length
    ? SITE.conferences.map(c => `
        <div class="entry">
          <div class="entry-title">
            ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener">${c.title}</a>`
                    : `${c.title}`}
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
    { id: 'research',      label: 'Research'      },
    { id: 'mr-experience', label: 'MR Experience' },
    { id: 'video-games',   label: 'Video Games'   },
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

    } else if (type === 'place') {
      // Gentle place-down click for normal icon drops
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.connect(gain);
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(170, now + 0.08);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now); osc.stop(now + 0.1);

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
    html: `<div class="cv-lock-pad">
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
      id: 'publications', label: 'publication', icon: SVG.folder, iconKey: 'folder',
      x: rX, y: 40,
      action: () => {
        const p = renderPublications();
        wm.show('publications', { title: 'publication', tabs: p.tabs, w: 480, h: 400 });
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
    {
      id: 'devlog', label: 'devlog.md', icon: SVG.document, iconKey: 'document',
      x: 30, y: 220,
      action: () => openDevlogWindow(),
    },
    {
      id: 'guestbook', label: 'guestbook', icon: SVG.terminal, iconKey: 'terminal',
      x: 30, y: 310,
      action: () => openGuestbookWindow(),
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

  let ignoreMouseUntil = 0;

  el.addEventListener('mousedown', e => {
    if (Date.now() < ignoreMouseUntil) return;
    startIconDrag(e.clientX, e.clientY);
    e.preventDefault();
  });
  const MOBILE_ICON_LONG_PRESS_MS = 320;
  const MOBILE_ICON_TAP_MOVE_PX = 10;
  let touchDragTimer = null;
  let touchStartPoint = null;
  let touchTapCanceled = false;
  let touchDragStarted = false;

  function clearTouchDragTimer() {
    if (!touchDragTimer) return;
    clearTimeout(touchDragTimer);
    touchDragTimer = null;
  }

  function resetTouchIconState() {
    clearTouchDragTimer();
    touchStartPoint = null;
    touchTapCanceled = false;
    touchDragStarted = false;
  }

  el.addEventListener('touchstart', e => {
    const t = e.touches && e.touches[0];
    if (!t) return;

    if (window.innerWidth > 768) {
      startIconDrag(t.clientX, t.clientY);
      return;
    }

    ignoreMouseUntil = Date.now() + 700;
    resetTouchIconState();
    touchStartPoint = { x: t.clientX, y: t.clientY };
    el.classList.add('pressed');
    touchDragTimer = setTimeout(() => {
      if (!touchStartPoint) return;
      startIconDrag(touchStartPoint.x, touchStartPoint.y);
      touchDragStarted = true;
    }, MOBILE_ICON_LONG_PRESS_MS);
  }, { passive: true });

  el.addEventListener('touchmove', e => {
    if (window.innerWidth > 768) return;
    if (!touchStartPoint || touchDragStarted) return;
    const t = e.touches && e.touches[0];
    if (!t) return;
    const dx = t.clientX - touchStartPoint.x;
    const dy = t.clientY - touchStartPoint.y;
    if (Math.abs(dx) > MOBILE_ICON_TAP_MOVE_PX || Math.abs(dy) > MOBILE_ICON_TAP_MOVE_PX) {
      clearTouchDragTimer();
      touchTapCanceled = true;
      el.classList.remove('pressed');
    }
  }, { passive: true });

  el.addEventListener('mouseup', () => {
    if (Date.now() < ignoreMouseUntil) return;
    el.classList.remove('pressed');
    if (!drag.moved) def.action();
  });

  el.addEventListener('touchend', () => {
    el.classList.remove('pressed');
    if (window.innerWidth <= 768) {
      const isDraggingThisIcon = drag.active?.type === 'icon' && drag.active?.id === def.id;
      if (!isDraggingThisIcon && !touchTapCanceled) def.action();
      if (!isDraggingThisIcon) {
        drag.active = null;
        drag.moved = false;
      }
      resetTouchIconState();
      return;
    }
    if (!drag.moved) def.action();
    drag.active = null;
    drag.moved = false;
  });

  el.addEventListener('touchcancel', () => {
    el.classList.remove('pressed');
    clearTouchDragTimer();
    touchTapCanceled = true;
    if (!(drag.active?.type === 'icon' && drag.active?.id === def.id)) {
      drag.active = null;
      drag.moved = false;
    }
    touchStartPoint = null;
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

document.getElementById('mb-name')?.addEventListener('click', () => {
  openAdminLoginWindow();
});
document.getElementById('mb-name')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') openAdminLoginWindow();
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

  initNowSync();
  initGuestbookSync();

  // Auto-open about window on load
  wm.show('about', { title: 'about.md', html: renderAbout(), w: 420, h: 460 });
  openNowWindow();

  updateClock();
  setInterval(updateClock, 15000);
});
