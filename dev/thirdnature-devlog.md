# the third nature.sys — devlog

## Context

A slow ecological succession game built as a gift. Ruins → exposure → water → lichen → moss → fungi/succulent → tree. Players explore a 128×128 grid; only the girlfriend can plant (password-gated). All visitors see the same canonical state.

**Design principles:**
- She is the catalyst, not the controller. No fencing, no protection tools.
- Ecological time, not game time. Growth happens in real hours, not clicks.
- Visitor presence as bioturbation — real, local, not saved to canonical state.
- Strata as palimpsest. Every cell has underground history regardless of surface.

---

## Phase 1 — Framework (2026-06-15)

**Claude Code (claude-sonnet-4-6)**

### Architecture decisions

- **Deterministic map generation**: 128×128 grid seeded from `CANON_SEED = 20260615`. Per-cell data derived via Mulberry32 RNG keyed on `(seed XOR hash(x,y))`. Same seed → same map for all visitors. Only modifications (girlfriend's actions + growth state) need to be stored.

- **Sparse state**: Only modified cells stored in `S.cells`. Generated strata are computed on demand and cached in `genCache` (in-memory only, regenerated from seed on reload). No initial download of the full map.

- **Shared state strategy**: `assets/nature/state.json` on GitHub (public read). Writes go through `workers/now-sync-worker.js` extended with `source: "nature"` routing. Not yet implemented — currently localStorage only.

- **Growth chain**: `wet → lichen (2t) → moss (3t) → fungi|succ (5t) → tree_y (10t, water req.) → tree (30t)`. 1 tick = 8 real hours. Moss branches: `fungi` if water corridor below, `succ` if not.

- **Alternating state**: Cells with `daysActive >= 4` flicker between current char and next-stage char via CSS `step-end` animation. Visualises becoming.

- **Expose tool mechanics**:
  - First expose on `ruins` → `cracked`
  - Second expose on `cracked`:
    - If water corridor below (from generated data): `wet`, spread to adjacent water-corridor cells (depth 2)
    - If no water: `dry`
  - Energy cost: 1 per action (5/day, resets every 24h)

- **Profile popup**: Bottom sheet showing core sample — surface at depth 0, then strata at -1 through -4. Artifacts at depth -3 (3.5% of cells) show recovered field notes.

- **Viewport**: 9×9 cells, 32px each. Pans via swipe (mobile) or arrow keys (desktop). Centered on (64,64) initially.

### Implemented (2026-06-15)

- [x] `DEV_MODE = location.search.includes('dev')` — `[ RESET ]` and `[ +1T ]` injected programmatically, dashed border style
- [x] `setInterval(liveTick, 60_000)` — real-time growth check every minute; re-renders without refresh
- [x] Chunk system (8×8), zone type seeded from `CANON_SEED XOR f(cx,cy)` — 7 zone types
- [x] Zone spatial layout: NE = institutional_core/ward_wing, SE = slope_face/formal_garden, NW = farm_field/native_remnant
- [x] Zone-appropriate initial surface characters (▓▬─:: for ruins; ^∪/ for slope; _,: for farm)
- [x] 6-layer strata generation per cell: [0] surface, [-1] building layer, [-2] drainage, [-3] clay/boulder, [-4] sandstone/cavity, [-5] bedrock
- [x] Slope factor SE: stability penalty increases toward map SE corner
- [x] Expose two-step: ruins→cracked first, then cracked→water/dry/hollow based on strata
- [x] Water Type A: BFS flood fill through connected wet-clay [-3] cells
- [x] Water Type B: BFS through [-4] dissolution cavities + distance ≤ 3, collapse near epicentre
- [x] Succession chains: dry→grass→lichen→moss→fungi|ice_plant; water→sedge→moss; shrub→tree
- [x] Spore spreading: lichen/moss at daysActive≥3 inoculates adjacent bare cells; SE wind bias
- [x] Slump system: stability<0.30 triggers hummock/slip_scar; debris pushed downslope SE
- [x] Gorse invasion: spreads inward from map edges, occupies dry/grass cells
- [x] Alternating flicker: cells with daysActive≥4 animate between current and next-stage char (CSS step-end)
- [x] Profile popup (bottom sheet): full 6-layer core sample, stability bar, artifact text, sign display
- [x] Legend panel (right sheet, `[ ? ]` toggle): all characters documented
- [x] Password UI skeleton: SHA-256 client-side hash → sessionStorage; Worker validation TODO
- [x] EN/ZH i18n: all strings, surface labels, strata labels
- [x] Visitor bioturbation: click without auth accumulates visitCount; stability penalty at 50 visits
- [x] Energy system: 5/day, 24h reset
- [x] Pan: swipe (touch) + arrow keys

### TODO (Phase 2)

- [ ] Extend `now-sync-worker.js` for `source: "nature"` → `assets/nature/state.json`
- [ ] Create initial `assets/nature/state.json` and push to GitHub main
- [ ] Configure `NATURE_EDIT_HASH` env var in Cloudflare dashboard
- [ ] Sign placement (`|T|`) — girlfriend only, max 1 per cell
- [ ] Trowel tool: currently scaffolded; artifact text display working, but excavation depth tracking needs more testing
- [ ] Graft tool: two-step click (select source → select target); conditions vary by species
- [ ] Cast tool (requires water cell; fishing with randomised delay)
- [ ] GPR scan tool (reveal anomaly positions within radius without disturbing)
- [ ] Rabbit hole system (daysActive threshold trigger, artifact displacement via BFS)
- [ ] Ancient seed inventory (found at [-3]/[-4], max 3)
- [ ] Animals (pig, penguin — threshold-triggered)
- [ ] Auto-open as window on main site (app.js integration)
- [ ] Visitor footprint sync to remote state (backend)
- [ ] Formal garden ornamental plants (@)
