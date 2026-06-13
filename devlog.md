# devlog — cube-dev branch

**Project:** Mirror Cube interactive portfolio  
**Branch:** `cube-dev` (separate from main site)  
**File:** `cube.html`  
**Authors:** Claude Code + Orlan Y. Syshui

---

## 2026-06-14

### Phase 1 scaffold — Claude Code

Built the initial `cube.html` from scratch. Single-file, no build tools, Three.js via importmap CDN.

**Geometry**  
27-piece Mirror Cube using `BoxGeometry` per piece. Layer thicknesses are asymmetric by design so each piece has a unique size — the defining property of a Mirror Cube. Current values:

```
X: [0.42, 1.00, 1.58]   ratio ≈ 1 : 2.4 : 3.8
Y: [0.52, 1.00, 1.48]
Z: [0.47, 1.00, 1.53]
```

All three axes sum to 3.0, so the solved shape is a perfect cube. When scrambled, pieces protrude at irregular heights and depths.

Piece naming convention:
- **C-01 → C-09** — top layer (gy=2), theme: Context
- **E-01 → E-09** — middle layer (gy=1), theme: Excavation
- **T-01 → T-09** — bottom layer (gy=0), theme: Theory
- **E-05** — the invisible centre piece (gx=1, gy=1, gz=1); only appears on solve

**Materials + lighting**  
`MeshStandardMaterial` with metalness 0.80, roughness 0.15. `RoomEnvironment` for reflections. Key light casts `PCFSoftShadowMap` shadows into the gaps. White background `#f2f2f0`. Black `EdgesGeometry` `LineSegments` on each piece for the seam lines.

**State tracking**  
Each piece carries `{gx, gy, gz, origGx, origGy, origGz}` in `userData`. After every layer rotation via pivot method, `updateGrid()` remaps grid coordinates using the correct rotation permutations per axis. Solve detection compares current vs. original grid positions for all 26 visible pieces.

**Interactions**  
- Drag on background → `OrbitControls` (whole-cube orbit)
- Drag on a piece → layer rotation; axis determined by drag direction (horizontal = Y-layer, vertical = Z-layer)
- Click on a piece → opens content panel
- Zoom locked (`enableZoom: false`)
- Layer rotation animated via pivot-attach → rotate → re-parent, 220ms ease-in-out

**Panel**  
Overlays right 44% of screen; canvas stays full-width. On open, camera target tweens to x=-0.7 so the cube shifts left and stays visually centred in the uncovered area. On close, target returns to 0.

**Scramble**  
`scrambleFast()` runs on load — instant (no animation), date-seeded PRNG (Mulberry32), 18–21 moves. State is valid; user can immediately start solving.

**Float animation**  
Gentle Y bob + subtle X drift in the render loop. No auto-rotate.

**Admin key**  
`` ` `` (backtick) → `autoSolve()`. Resets all pieces to original position/rotation. Hidden from UI; to be removed before final release.

**Hover**  
SVG overlay tag line from piece centre to floating label (`ID · Title`). Updates each frame.

**Mobile fallback**  
`window.innerWidth ≤ 640` → flat 3×3 grid per layer, tappable cells open same content panel.

**EN/ZH toggle**  
Infrastructure built (`STRINGS` object, `t(key)` function). ZH dict is empty — placeholder for later.

**Placeholder content**  
All 27 pieces have stub text in `PIECES_DATA`. Ready to be replaced with real content.

---

## notes / known issues

- X-layer rotation (left/right columns) not yet triggerable by drag — currently only Y and Z axes. To add: detect face normal on hit to disambiguate axis.
- `requestAnimationFrame` doesn't fire in the Claude Code headless preview environment, so the preview tool shows a static frame. Works correctly in a real browser.
- Solve detection resets `solved = false` on `autoSolve()`, so the Easter egg can be re-triggered for testing.

---

*— Claude Code, 14 June 2026*
