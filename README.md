# 42 inches to mars!

**Personal site of Orlan Y. Syshui** — researcher, artist, world-builder.

Live at [orpheelyre.github.io](https://orpheelyre.github.io)

---

## What is this

A System 6 Mac desktop simulation running entirely in the browser. No frameworks, no build step, no dependencies except a CDN copy of `marked.js` for rendering markdown. You drag icons around. Things make little sounds. The bin has a lock on it.

---

## How it works

| File | What it does |
|------|-------------|
| `index.html` | Bare bones. Three script tags and a menubar. |
| `data.js` | All content lives here — bio, publications, projects, now status, devlog. Edit this file to update the site. |
| `app.js` | Window manager, drag system, icon definitions, all rendering logic. |
| `style.css` | System 6 aesthetic. Chicago FLF + Geneva. Venetian-blind title bars. 1-bit dither. |

**To update anything on the site: edit `data.js`.** That's it. The rest is automatic.

---

## Features

- **Draggable desktop icons** with localStorage position memory
- **Window manager** — open, close, zoom, resize, cascade, focus
- **Tabs** for CV, Publications, Projects
- **Bin** — drag icons in, click to restore, cv.md requires a password
- **Sound effects** via Web Audio API — no audio files, all procedural
- **now.live** — a live-editable status window (cat included) that can sync to a remote JSON endpoint
- **devlog.md** — timestamped update log, editable with the same admin password
- **Dark mode** with dither texture
- **Mobile** — long-press to drag, zoom button fullscreens windows
- **Auto-opens** `about.md` and `now.live` on load

---

## Editing content

Everything is in `data.js`. The structure is self-documenting — comments explain each section.

```js
// Add a publication:
SITE.publications.push({
  title: "Your Title",
  type:  "Journal Article",   // or "Public Anthropology", etc.
  venue: "Journal Name",
  date:  "2026",
  url:   "https://doi.org/...",  // or null
});

// Add a devlog note to now.live:
SITE.now.devlog.push({ date: "21 April 2026", text: "something happened" });

// Restore cv.md to the desktop:
// remove 'cv' from SITE.hiddenIcons

// Add a note to the Bin:
SITE.trash.push({ id: "note1", text: "a thought I left here" });
```

---

## Passwords

Both are in `data.js` and intentionally visible in source — this is an aesthetic lock, not real security.

| Lock | Field | Default |
|------|-------|---------|
| `cv.md` (bin) | `SITE.cvPassword` | `1453` |
| `now.live` edit | `SITE.nowEditPassword` | `6476` |

---

## now.live sync

`now.live` can sync across devices via a remote JSON endpoint. Configure in `data.js`:

```js
nowSync: {
  rawUrl:   "https://raw.githubusercontent.com/.../now.live.json",  // public read
  writeUrl: "https://your-worker.workers.dev",                       // admin write
  pollMs:   15000,
}
```

Without `writeUrl`, edits save to `localStorage` only (this-device-only). With it, Save publishes for everyone. The worker receives `{ password, data }` and writes `data` to the raw file if the password matches.

If `nowSync` is not configured, everything still works — the now window just uses local data.

---

## Fonts

The UI uses **Chicago FLF** (System 6 era bitmap font revival). Place `ChicagoFLF.woff2` and `ChicagoFLF.ttf` in `/fonts/` — without them, it falls back to Geneva / Helvetica Neue gracefully. Body text uses Geneva stack throughout.

Chicago FLF is available from [fontsquirrel.com/fonts/chicago-flf](https://www.fontsquirrel.com/fonts/chicago-flf).

---

## Project detail pages

Each project card links to a markdown file. Create `projects/your-project.md` and point to it with `mdFile: "projects/your-project.md"` in the project object. Standard markdown renders inside a window.

---

## Deploy

This is a static site — push to GitHub Pages, done. No build step.

```bash
git add -A
git commit -m "update"
git push
```

GitHub Desktop also works.

---

*Built without frameworks, with love, on a borrowed aesthetic from 1988.*
