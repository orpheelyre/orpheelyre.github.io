# devlog — cube-dev branch

**Project:** Mirror Cube interactive portfolio  
**Branch:** `cube-dev` (separate from main site)  
**File:** `cube.html`  
**Authors:** Claude Code + Orlan Y. Syshui

---

## 2026-06-14

### Interaction debug pass — Codex

Fixed the missing X-layer rotation path in `cube.html`.

Follow-up after live preview:
- Pulled the camera back from `(3.8, 3.0, 4.8)` to `(4.9, 3.85, 6.15)` so the cube no longer fills the screen so aggressively.
- Added a visible `SOLVE` button in the top bar, wired to the same admin `autoSolve()` path as the backtick shortcut.
- Fixed the layer-rotation disappearance bug: pieces were removed from the pivot before being reattached to `cubeGroup`, which could lose the intended world transform. The code now calls `cubeGroup.attach(piece)` directly while the piece is still under the pivot, preserving the rotated transform.
- Reworked the content panel into a two-column archive reader: left-side directory, right-side piece content.
- Added an `expand/shrink` control that lets the panel grow from the default side drawer to a two-thirds reading view.
- Directory items are grouped by `Context`, `Practice`, and `Theory`; choosing an item opens that piece, marks the directory entry active, highlights the corresponding cube block, and eases the camera toward that block.
- The camera target now adapts to panel width so the cube remains visible beside both the normal and expanded panel states.
- Polished the panel/cube choreography after live review: directory navigation now keeps the camera position stable and only eases the cube through a small, slow orientation shift.
- Moved the `expand/shrink` button from the panel's right edge to the left control cluster so it no longer overlaps the global back button.
- Changed the active-piece highlight from warm gold to a black-metal treatment that sits closer to the seam-line language.
- Closing the panel eases the cube orientation back to neutral; `SOLVE` resets cube orientation and clears highlights.
- Stabilised the perceived rotation centre by shifting the cube's base position together with the `OrbitControls` target when the panel opens or changes width; the object and its control centre now stay aligned instead of orbiting around a displaced target.
- Converted the panel prototype into an artefact registry card. Before solve, the directory shows unclassified object numbers plus a three-dot position marker only; titles and semantic categories are withheld.
- Added three post-solve coordinate axes: `OBSERVER / PRACTITIONER / SUBJECT` on X, `CONTEXT / EXCAVATION / THEORY` on Y, and `ARCHAEOLOGY / ANTHROPOLOGY / DESIGN+GAMES` on Z.
- After solve, registry cards reveal a semantic triplet, `CLASSIFIED AS`, `POSITION`, and three `VIEW ALL` plane actions. The original `RECORDED` / `LOCATED` fields remain in place so classification reads as an added interpretive layer rather than a replacement.
- Added solved-state plane highlighting: selecting a plane raises its nine objects, fades the other eighteen, and brightens the selected pieces' seam lines, aiming for an archive-drawer rather than exploded-diagram feel.
- Verified both modes in browser: pre-solve card shows only object number and unclassified directory; post-solve core card reveals semantic fields and working `VIEW ALL` action with no console errors.
- Simplified the solved-state menu into dropdown hierarchy: `POSITION`, `MODE`, `FIELD`, plus a collapsed `OBJECT DRAWER`. The menu now shows the active value in each dropdown summary instead of listing all 27 semantic coordinates at once.
- Changed solved object selection semantics: clicking a cube object opens its registry card and highlights all three associated planes at once. Pieces sharing X/Y/Z with the object stay present; unrelated pieces drift slightly outward/down and fade.
- Kept single-plane inspection available through dropdown values and registry `VIEW ALL` actions, so users can move between "this object's relations" and "this whole layer" without losing the cabinet metaphor.
- Fixed solved-state persistence after re-scrambling. Any manual layer turn that makes the cube no longer solved now exits solved mode: hidden core is removed, plane highlights clear, solved toast hides, and any open visible registry card/menu refreshes back to the unclassified pre-solve form. If the open card was the hidden core, the panel closes because that object is no longer available.
- Verified in browser: `SOLVE → open core → drag layer` closes the core and clears solved state; clicking a visible cube object afterward opens an unclassified registry card with no solved dropdowns or `CLASSIFIED AS` fields.
- Reordered the pre-solve unclassified directory as a strict coordinate registry from `1-1-1` through `3-3-3`, rather than inheriting the content-array/thematic order.
- Added neutral X/Y/Z dot markers beside each pre-solve object number. These show which coordinate faces the object occupies without revealing post-solve semantic labels like `SUBJECT`, `THEORY`, or `DESIGN+GAMES`.
- Replaced the pre-solve coordinate registry with a visitor discovery log. Objects now receive `FIELD NO.` values (`001`, `002`, etc.) in the order each visitor opens them; undiscovered rows render as `···`, preserving field-site uncertainty.
- Pre-solve registry cards now show `FIELD NO.` plus `OBJECT NO. WITHHELD`; solve reveals the true `OBJECT NO.`, semantic classification, and any previously assigned `FIELD NO.` as a parallel record of the visitor's encounter history.
- Replaced the solved-state axis dropdown stack and `VIEW ALL` button row with a tri-axis radial SVG inside the registry card. The current object sits at the centre, with three equal 120° labels for its position/mode/field values; each radial label triggers the existing single-plane highlight.
- Kept pre-solve unaffected: no radial axis element renders before solve. In solved state, the panel directory no longer lists all 27 objects by default; the cube and radial diagram become the primary directory.
- Changed solved radial navigation so selecting an axis label (for example `EXCAVATION`) activates that label/line and changes the left directory into a contextual nine-object list for that plane only.
- Switched solved plane-list rows to compact registry language: `OBJECT NO.` plus hook/question text, not repeated full coordinate triplets. Clicking one of the nine objects keeps the current plane filter active.
- Included the revealed hidden centre object (`E-05`) in solved plane lists, so every selected plane correctly shows nine objects.
- Converted the panel from overlay to split-pane behaviour. When the panel opens, the WebGL canvas and hover SVG shrink to the remaining left viewport instead of being covered, so the cube stays visible and centred in its own pane.
- Added responsive camera zoom tied to the canvas width. Normal and expanded panel states now both preserve the full cube silhouette instead of cropping the object when the panel takes two-thirds of the screen.
- Strengthened solved plane selection on the cube itself: selecting a radial category now pulls that plane outward along its actual X/Y/Z axis, fades non-selected pieces further, and draws a black 3D axis rail with a tick at the selected layer.
- Debugged the post-panel rotation corruption. The second half of the pivot reparenting had been fixed earlier, but the first half still removed pieces from `cubeGroup` before attaching them to the pivot. When `cubeGroup` had panel-focus rotation/offset, this lost world transforms and produced detached/misaligned pieces. The rotation path now calls `pivot.attach(piece)` directly from the existing parent, preserving world transform at both ends.
- Added a lightweight cube invariant checker after rotations: visible occupancy must remain 26 unique grid cells, mesh scale must be reset to 1, and each cubie's BoxGeometry dimensions must match its original mirror-cube dimensions. Warnings go to console only on invariant failure.
- Removed solved-state material tint/scale highlights. Selection now keeps associated pieces visually normal and pushes unrelated pieces to 30% opacity; the hidden core uses the same silver material as other pieces instead of gold/orange.

**Drag axis inference**
- Replaced screen-axis hardcoding (`horizontal → gy`, `vertical → gz`) with face-aware rotation inference.
- Pointer hits now keep the Three.js intersection, read the clicked face normal in world space, convert screen drag into a camera-plane world vector, then use `faceNormal × dragDirection` to choose `gx`, `gy`, or `gz`.
- Result: dragging a piece can now trigger all three Mirror Cube axes, including left/right X-layer turns.

**Hit testing**
- Restricted raycasting to actual cube piece meshes instead of edge-line children.
- Added guards so hover labels and drag inference ignore malformed/non-face hits rather than throwing.

**Solve/admin cleanup**
- `autoSolve()` now removes any revealed hidden core mesh before resetting visible pieces.
- This prevents repeated backtick solve cycles from leaving `E-05` visible or duplicating the core block.

**Verification**
- Served the static site locally on port `8765`.
- Opened `cube.html?v=codex-final` in the in-app browser.
- Confirmed page title loads and two live drag gestures complete with no console errors or warnings.

*— Codex, 14 June 2026*

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

- `requestAnimationFrame` doesn't fire in the Claude Code headless preview environment, so the preview tool shows a static frame. Works correctly in a real browser.

---

*— Claude Code, 14 June 2026*
