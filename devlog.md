# devlog — cube-dev branch

**Project:** Mirror Cube interactive portfolio  
**Branch:** `cube-dev` (separate from main site)  
**File:** `cube.html`  
**Authors:** Claude Code + Orlan Y. Syshui

---

## 2026-06-14

### Installation gate + solved plane polish — Codex

- Changed solved middle-layer focus so extracted sandwich layers rotate to present their broad plane to the camera, rather than sliding toward the viewer face-on.
- Tuned edge-plane solved focus to rotate toward the selected outside face more directly.
- Synchronized split-pane open/close motion with cube focus timing and eased the canvas/panel width transitions with the same cubic curve used by the cube movement.
- Hid the cube page's top-left `mirror cube` label and the temporary `EN/CN` toggle; replaced the solved toast CTA with `open centre object`.
- Added a solve password gate. `SOLVE` and the backtick shortcut now require the hard-mode password before calling `autoSolve()`.
- Added a new System 6 desktop icon labelled `installation`, drawn as a scrambled mirror-cube icon.
- The installation icon opens a playful admin warning (`still under development / 生人勿近`) and uses the existing admin password before launch.
- Added a minimal launch sequence: a small mirror cube flips through random orientations while a System 6-style progress bar fills, then the page fades into `cube.html`.
- Checked storage semantics: the homepage stores icon positions/theme and `now.live` overrides in browser storage, but cube discovery/solve progress is not persisted across reloads or computers.
- Added explicit cache-busting query strings to `index.html`'s local `style.css`, `data.js`, and `app.js` references after the browser kept serving the pre-installation desktop bundle.
- Replaced the native `window.prompt()` solve password with an in-page mini password gate so clicking `SOLVE` gives visible feedback and focus immediately.
- Changed the installation warning copy from Chinese/English mixed text to the lighter English line: "This installation is still growing teeth. Friendly ghosts and admins only."
- Bumped the homepage local asset query strings again so the browser stops serving the earlier installation warning bundle.

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
- Strengthened solved plane selection on the cube itself: selecting a radial category now makes only that plane transparent/highlighted; edge planes shift outward, while middle planes extract as a slab from between the two outer layers.
- Corrected highlight semantics after live review: transparency now means "selected/highlighted". Solved single-piece selection makes only that piece transparent; solved radial plane selection makes only the selected nine pieces transparent, with all other pieces restored to opaque metal.
- Reworked middle-layer plane display from an in-place face rotation to a slab extraction. Selecting an `idx=1` plane now slides that complete middle layer out from between the two outer layers, matching the "middle row/column pulled aside" archive-drawer sketch and making the transparent layer readable.
- Added a lightweight focus rotation for extracted middle layers. The cube turns toward the extracted slab while the plane is active; clicking outside that active plane clears the plane state, restores piece positions, and returns to a single-piece highlight.
- Extended the extraction motion to edge planes too. All radial plane selections now use the same eased slab movement rather than instant offsets; middle planes travel farther so the full transparent layer clears the cube.
- Fixed split-pane resizing after the extraction-focus change. `updateViewportSize()` now initializes after all viewport state exists, and the window resize handler no longer forces the renderer back to full-screen dimensions during panel state changes.
- Removed extraction-specific zoom. Extracted slabs keep the current cube scale; focus is handled by tweening cube position/rotation toward the selected slab, while non-selected parts may move partially offscreen.
- Reduced panel resize flicker by not reallocating the WebGL drawing buffer during panel open/expand/shrink transitions. The camera follows the CSS-sized canvas every frame, while actual buffer resizing is reserved for initial load and real window resize.
- Fixed repeated extraction when browsing within an active solved plane. Clicking another object in the nine-item plane directory now preserves the current slab transform and only refreshes the registry card, active row, and radial labels; clicking the already-active row is a no-op.
- Added plane-facing camera choreography for solved radial selections. Edge planes now rotate the cube toward the selected face (`OBSERVER/SUBJECT`, `CONTEXT/THEORY`, front/back domain planes) instead of only sliding the layer outward.
- Adjusted middle-layer extraction focus so the viewport follows the extracted slab rather than preserving the whole cube; non-selected pieces are allowed to move partly offscreen while the selected transparent layer becomes the main read target.
- Synchronized reverse motion timing for panel close / plane clear. Cube translation and rotation now use the same 520 ms easing window as the split-pane viewport update, reducing the earlier "move first, zoom/resize second" feel.
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

### Interactive polish pass — Claude Code

**Hover tag system**

- Added three-state hover label: unexplored pieces show `examine`; explored (discovered) pieces show their `FIELD NO.` (e.g. `001`); solved pieces show the semantic triplet (`stance · knowledge · domain`). Logic lives in `getHoverLabel(pd)`.
- `updateTags()` now uses `hoveredMesh || activeMesh` as the display target. When the mouse is not over any piece, the line and label ghost to the currently open panel piece at reduced opacity (line alpha 0.18, label opacity 0.5). This keeps a visual link between the directory and the cube at all times.
- Added `canvas.addEventListener('pointerleave', ...)` to clear `hoveredMesh` when the mouse moves into the panel area. Previously the last hovered piece kept its tag line permanently while the user interacted with the panel.

**Transparency and depth correctness**

- Changed `setMeshHighlightState` to set `mesh.material.depthWrite = state.opacity >= 1`. Previously the threshold was `> 0`, which left ghost depth writes from fully-transparent bodies that occluded their own `EdgesGeometry` children.
- `resetPieceMaterial` explicitly restores `depthWrite = true` so pieces that were highlight-transparent come back fully opaque after clear.
- Plane highlight in `highlightPlane` now keeps non-selected pieces opaque and sets only the selected/highlighted piece or plane to `opacity: 0.42` (glass, `depthWrite: false`).
- Edge opacity stays high only on the selected/highlighted piece or plane, so transparency reads as selection rather than background fading.

**Plane selection visual**

- Removed the `showAxisGuide` (3D black axis rod) call from `highlightPlane`; the rod was a visual leftover from an earlier design pass and was also triggered unexpectedly when clicking panel directory items.
- Plane separation: edge layers (`idx=0` or `idx=2`) shift only the selected layer outward. Middle layers (`idx=1`) do not spread all three layers; instead the selected nine-piece slab extracts from between the two outer slabs.
- Middle-layer selection only: the selected slab slides out as one coherent layer (700 ms ease-out cubic), matching the "middle row/column pulled aside" sketch. `clearPlaneHighlight` restores saved local transforms when the visitor leaves that active plane.

**Panel / directory**

- `.axis-radial` SVG changed from `margin: 8px 0 12px` to `margin: 8px auto 12px` so the radial diagram stays centred at both normal and expanded panel widths.
- Solved plane directory rows no longer prefix the `FIELD NO.` — only `OBJECT NO.` (`x-x-x`) is shown, since field numbers belong to the pre-solve discovery context.
- `onSolved()` now calls `openPanel(activeMesh || e05mesh)` at the end so the sidebar slides in immediately on solve without requiring the user to click an axis button.
- `openPanel` without `preservePlane` now calls `clearPlaneHighlight()` instead of just nulling `activePlaneSelection`. This ensures the visual highlight state is fully reset when navigating between pieces, preventing pieces from remaining transparent after the plane selection is abandoned.
- Removed `highlightRelatedPlanes(mesh)` from the `openPanel` path. Plane transparency is now only triggered by explicit axis-label clicks in the radial diagram.
- Added `canvas.addEventListener('pointerleave', ...)` to ensure the hover tag line clears when focus moves to the panel.

*— Claude Code, 14 June 2026*

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
