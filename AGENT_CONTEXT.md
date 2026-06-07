# Project Context & Handoff Notes — rishabhkumar14.github.io

> **Purpose of this file:** A single, self-contained briefing for the next AI agent (or developer)
> working on this site. It captures the architecture, theming system, key interactive components,
> the spacing/responsive system, gotchas, and working conventions learned across multiple sessions.
> Feed this file in as context instead of starting from scratch.

---

## 1. What this project is

- **Personal portfolio website** for Rishabh Kumar (Cloud & AI Architect @ Microsoft).
- **Live URL:** https://rishabhkumar14.github.io/ (a GitHub **user** Pages site).
- **Repo:** `github.com/rishabhkumar14/rishabhkumar14.github.io.git`, branch **`main`**.
- **Local working dir:** `C:\Users\risha\Documents\website\rishabhkumar14.github.io`
- **Stack:** Vanilla HTML/CSS/JS. **No build step, no framework, no bundler.** Edit files → commit → push → GitHub Pages serves them directly.
- **OS for dev:** Windows, PowerShell (`pwsh`) terminal.

### File layout (key files)

```
index.html              ~4070 lines — the entire single-page site + MOST of the JS as inline <script> blocks
css/
  main.css              ~6400+ lines — ALL site styling + theme variables + extracted inline styles
  plugins.css           third-party/framework CSS (Bootstrap tokens live here)
  loaders/loader.css    preloader styles — DUPLICATES the :root theme variable block
js/
  app.js                site bootstrap (adds .no-touch class, menu logic, etc.)
  gallery-init.js        PhotoSwipe gallery init
  libs.min.js            minified vendor libs
img/                     avatars, favicons, tool icons, works/{experience,project,research}
```

---

## 2. THEME / COLOR SYSTEM ⭐ (most important section)

The entire site palette is driven by **CSS custom properties** defined ONCE in `:root`.
**Never hardcode theme colors in component rules — always reference the variables.**

### Where the variables live

- **`css/main.css`** `:root` block (~lines 68–124) — the master set.
- **`css/loaders/loader.css`** (~lines 24–70) — a **DUPLICATE** of the same variable block for the preloader. **If you change theme vars in main.css, change them in loader.css too**, or the preloader will flash the old color.

### Structure of the variables

Each color has `--x--light` and `--x--dark` variants, then a media/attribute layer maps them to the active `--x`:

- `@media (prefers-color-scheme: light/dark)` sets `--accent: var(--accent--light/dark)` etc.
- `[color-scheme="light"]` / `[color-scheme="dark"]` do the same for the manual theme toggle.

Key semantic tokens (what they drive):

- `--accent`, `--secondary` — primary brand colors (buttons, links, glows, gradients, chips, scrollbar).
- `--secondary-rgba` — translucent brand color (selection highlight, hover fills).
- `--t-accent`, `--t-secondary` — gradient text colors for headings (`h1`, `h2`, `.teaser__text`, `.achievements__number`, star ratings).
- `--gradient-one/two/three` — the big blurred background "blobs" (`.blur:nth-of-type(n)`).
- `--base`, `--base-tint`, `--base-shade` — surface/background neutrals (NOT part of the purple family; left unchanged in retheme).
- `--t-bright`, `--t-medium`, `--t-muted`, `--t-disabled`, `--t-placeholder` — text grays.
- `--stroke-elements`, `--stroke-controls` — borders.
- `--t-opp-*`, `--per-*`, `--t-per-*` — "opposite" and permanent (theme-independent) colors.

### Current palette = ORANGE (rethemed from the original PURPLE)

The site originally shipped **purple/lavender/pink**. It was rethemed so every purple shade became an orange shade. Current values:

**Light scheme:**
| var | value |
|---|---|
| `--accent--light` | `#e8843a` |
| `--secondary--light` | `#e0641c` |
| `--secondary-rgba--light` | `rgba(224,100,28,0.3)` |
| `--t-accent--light` | `#c56a18` |
| `--t-secondary--light` | `#bd5510` |
| `--gradient-one--light` | `#f1d3ad` |
| `--gradient-two--light` | `#f9d3ab` |
| `--gradient-three--light` | `#eaa85c` |
| `--t-opp-medium--light` | `#d6cdbf` |

**Dark scheme:**
| var | value |
|---|---|
| `--accent--dark` | `#e8bf9c` |
| `--secondary--dark` | `#f0d2ab` |
| `--secondary-rgba--dark` | `rgba(240,210,171,0.2)` |
| `--t-medium--dark` | `#d6cdbf` |
| `--t-accent--dark` | `#e6bf9d` |
| `--t-secondary--dark` | `#f0d2ab` |
| `--gradient-one--dark` | `#dba35a` |
| `--gradient-two--dark` | `#e8c09d` |
| `--gradient-three--dark` | `#cc8a3e` |

**Permanent:** `--t-per-muted-light: #d8cbb8`

**Original purple values (for reference / if reverting manually):**
`--accent--light:#aa70e0` `--secondary--light:#7059e2` `rgba(112,89,226,0.3)`
`--t-accent--light:#8f56cc` `--t-secondary--light:#5d4ec4`
`--gradient-one/two/three--light:#cec4ef/#f5c5cd/#ac8fe3`
`--accent--dark:#e4b8bf` `--secondary--dark:#cec4ef` `rgba(206,196,239,0.2)`
`--t-accent--dark:#e1bac5` `--t-secondary--dark:#cec4ef`
`--gradient-one/two/three--dark:#a287d5/#e4b8bf/#8b6bc5`

### The retheme is isolated in ONE revertable commit

Commit **`72da063`** = "Retheme site palette purple → orange (revert this commit to restore original colors)".
It contains **only** color-line changes across `main.css` (`:root`), `loader.css`, and `index.html`
(the two SVG background gradient `stop-color`s + the Microsoft banner inline gradient).
**To go back to purple: `git revert 72da063`** — nothing else is affected.
All feature/layout/animation work sits in the commit **below** it (`9aeb2b2`) on the original purple base.

### Colors that are intentionally NOT theme-driven (do not "fix" these)

- **MS Paint widget** (`.ms-paint …` in main.css ~5800–6500): deliberate Windows-XP "Luna" palette —
  blue titlebar `#2e8def→#0a64ad`, beige face `#ece9d8`, olive bevels `#b0aa90/#8c8c5a/#6b6b58`,
  white highlight `#fdfdfd`. These repeat by design; do not consolidate into variables.
- **MS Paint color picker swatches** (`index.html` ~L3035): the classic 28-color palette (`#800080`, `#ff00ff`, etc.).
- **Pi-heart easter egg** (`index.html` ~L208): `#d63384` pink heart — intentional.
- **Tech-stack SVG icons** (`index.html` ~L3049+): brand-colored inline SVGs (Foundry purple gradient `#b14bff→#6a2cd6`, App Insights `#c0307a`, etc.) — these are product brand colors, not theme.
- **Bootstrap tokens** in `plugins.css` (`--bs-purple`, `--bs-indigo`, `--bs-pink`): framework defaults, unused by the site theme. Leave alone.

### Microsoft banner (special case)

`index.html` ~L383, `id="microsoftBanner"` — an **inline-styled** gradient pill ("🚀 Working on Microsoft AI Foundry Agent Service"). Was Microsoft blue (`#0078d4→#50e6ff`); rethemed to orange `linear-gradient(135deg,#e0641c,#f4a24d)` with `border-left:3px solid #c0530f` and hover `boxShadow rgba(224,100,28,0.4)`. Because it's inline, it's part of the color commit, not the variable system.

---

## 3. CACHE-BUSTING (important operational detail)

The three stylesheet `<link>`s in `index.html` (~L37–39) carry a version query string:

```html
<link rel="stylesheet" href="css/loaders/loader.css?v=20260606" />
<link rel="stylesheet" type="text/css" href="css/plugins.css?v=20260606" />
<link rel="stylesheet" type="text/css" href="css/main.css?v=20260606" />
```

**Why:** GitHub Pages + mobile browsers cache CSS aggressively. After the retheme, phones kept showing the OLD purple stylesheet from cache. The `?v=` string changes the cache key so browsers refetch.

**RULE FOR FUTURE CSS EDITS:** When you make a visible CSS change that returning visitors must see immediately, **bump the version number** (e.g. `?v=20260607`) on these three links. It's a one-character edit. Forgetting it doesn't break anything — returning visitors just see the change later when their cache revalidates; new visitors see it right away. The query string is ignored by the server (same file served either way).

---

## 4. RESPONSIVE / SPACING SYSTEM

### Base units

- **`font-size: 62.5%` on `<html>`** → `1rem = 10px`. All rem math assumes this (e.g. `3.6rem = 36px`).
- **`--_size: 1.6rem`** base sizing token; radii tokens `--_radius-s/m/l/xl` (1.5/2.2/3/3.6rem).
- **`--_animbezier: cubic-bezier(0.23,0.65,0.74,1.09)`** — the house easing curve (slight overshoot). Reuse it for new animations to stay consistent.
- **`--_animspeed-fast/medium/slow`** = 0.1s / 0.3s / 0.6s.

### Breakpoints (min-width unless noted)

`576px`, `768px`, `992px`, `1200px`, `1400px`, `1600px`.

- **`992px` is the desktop/mobile divide.** Below it = "phone/tablet" stacked layout; at/above = desktop fixed layout.
- **Phone-specific overrides** commonly use `@media (max-width: 991px)` or `991.98px`.

### Layout model of the hero (`#home`)

- **Desktop (≥992px):** `.avatar` is `position:fixed` on the left (300–400px wide). `#content` gets `padding-left` (330–500px) to clear it. The headline is absolutely positioned; the MS Paint canvas widget (`.home-canvas-wrap`) is `position:absolute` bottom-right; the chat card (`.home-chat`) is `position:absolute` anchored to the canvas's left edge via `right: calc(... + --chat-canvas-gap)`.
- **Mobile (<992px):** everything **stacks in normal flow**: avatar card → headline → buttons → chat card → canvas widget. Widths go `100%`.

### Notable spacing rules (mobile)

- **`.home-chat { margin: 3.6rem auto 0; }`** (mobile) — gap between the Download-CV buttons and the chat card. (Was `2rem`; bumped to `3.6rem` for breathing room. Desktop unaffected because it's absolutely positioned.)
- **`.home-canvas-wrap`** on mobile: `margin-top: 4rem`, uses `--mp-design-h: 514` (real laid-out height, not the 510 design height, to avoid clipping the palette/statusbar), `--mp-scale: calc((100vw - 3.2rem) / (820 * 1px))` to fill viewport width minus 1.6rem side insets. **`--mp-scale` MUST be unitless** (it feeds `transform: scale()`), achieved by dividing length/length in calc.
- **`#home { padding: ... 1.6rem }`** side padding on phones; canvas breaks out with negative margins then re-insets.
- **`#portfolio.inner { padding-top: 4rem }`** on phones (default `.inner` 6rem felt like too much blank scroll).
- **`#microsoftBanner`** on phones: `max-width:100%!important; white-space:normal!important` so it wraps to two lines instead of overflowing/ellipsizing; the logo `img` is top-aligned.
- The MS Paint widget scales uniformly via `--mp-scale` per breakpoint: `0.48` base, `0.55` @992, `0.7` @1200, `0.5` @1400, `0.65` @1600. The wrap's width/height are `calc(820px * scale)` / `calc(510px * scale)`.

---

## 5. KEY INTERACTIVE COMPONENTS

### 5a. Hero cards: intro animation + hover edge-glow + phone sweep

Two "hero cards": the **avatar card** (`#avatar .avatar__container`) and the **chat card** (`#rishabhChat.home-chat`).

**Intro animation (on load):**

- `@keyframes avatarCardIn` — card rises/fades in (`translateY(34px) scale(0.965)` → settle).
- `@keyframes socialSwingIn` — the 5 social buttons (`.socials-square__item`) weave in alternating directions using `--sx`/`--sr` vars, with overshoot, staggered `animation-delay` 0.5s→0.9s (`:nth-child(1..5)`), `:nth-child(even)` flips direction.
- Guarded by `@media (prefers-reduced-motion: reduce)`.

**Hover "nearest-edge glow" (desktop):**

- `--gx`/`--gy` are registered via `@property` (`syntax:"<length-percentage>"; inherits:true; initial-value:50%`) so they can BOTH inherit the JS-set pointer position AND be animated.
- `.avatar__container::after` / `.home-chat::after` is a masked border ring: a `radial-gradient(240px circle at var(--gx) var(--gy), ...)` clipped to a 2px border using `mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude` (`-webkit-mask-composite: xor`). Opacity 0 normally → 1 on `.no-touch …:hover`.
- JS (in `index.html`, IIFE ~L2020) sets `--gx/--gy` (px relative to card rect) on `pointermove` via rAF, only on non-touch.
- Cards also lift `translateY(-4px)` and cast a warm accent shadow on hover.

**Phone "edge-sweep" (no cursor):**

- `@keyframes edgeSweep` travels the highlight clockwise around the perimeter (`--gx/--gy` from top→right→bottom→left) while fading in at 8% and out at 92%.
- `.is-edge-sweeping::after { animation: edgeSweep 1.7s ease-in-out 1 both; }` — runs **once** (was 2; user asked for once).
- JS: on touch devices (`matchMedia('(hover: none),(pointer: coarse)')`), an `IntersectionObserver` (threshold 0.45) adds `.is-edge-sweeping` when each card scrolls into view, then removes it on `animationend` **guarded by `ev.animationName === 'edgeSweep'`** (so the card's own `avatarCardIn` animationend doesn't strip it early), then `unobserve` (once per load).

**Glassy avatar card:**

- `.avatar__container::before` (the card's visible surface) uses `background-color: color-mix(in srgb, var(--base-tint) 62%, transparent)` + `backdrop-filter: blur(16px) saturate(125%)` + translucent border, so the background glow shows through subtly (frosted glass look). The chat card already had its own translucent bg + `backdrop-filter: blur(14px)`.

### 5b. MS Paint widget (`.ms-paint` / `.home-canvas-wrap`)

A fully-functional retro Windows-XP MS Paint clone embedded in the hero. Self-contained, scoped under `.ms-paint`. Key facts:

- Designed at a fixed **820×510 px** and scaled with `transform: scale(var(--mp-scale))` (top-left origin). The wrap's box is `calc`'d from the same variable.
- Draggable (titlebar = drag handle; on drag it's promoted to `position:absolute` on `<body>` with `.is-floating`). Resizable via 8 `.rz-handle`s (hidden <992px and when minimized/maximized).
- **Window controls:** minimize (`.is-minimized-bottom` docks it bottom-right), maximize (`.is-maximized` fills viewport, letterboxed to 820:510), close (X).
- **Mobile X behavior:** when maximized on a phone, clicking **X** cancels the animation, removes `is-maximized`, resets the maximize button, and **hides the whole widget** (`display:none`) instead of just clearing. (Desktop X = clear canvas to white.)
- **Tools:** pencil/brush/eraser/text/shapes, size bars, color palette, grid toggle (`show-grid`), Redraw (replays the architecture-diagram animation), File menu (Open/Save/Save As/Print).
- **"Redraw"** button is styled as a classic raised Windows button; on mobile it replays the drawing animation.
- A "surprise reveal" only updates the **status-bar text** — note `#eraseReward` does NOT exist in markup; all JS refs are guarded `if(reward)`.
- **Intro "open" on load** (`@keyframes mpIntroOpen` on `.home-canvas-wrap .ms-paint`): the widget starts mini in the **bottom-right** corner of its final box, then ~0.7s after load springs up-left while scaling to its default size, landing pixel-exact on the static `scale(var(--mp-scale))`. `transform-origin` stays top-left (the resting anchor); the mini start is placed via `translate`, so there's no end-state layout shift. Reduced-motion disables it. GSAP only animates the wrap's opacity/translate, so animating the inner `.ms-paint` doesn't conflict.
- **Caption typewriter** (`.canvas-caption-text` span in the `.canvas-caption` above the widget; IIFE near the paint drag script ~L2073): types line 1 (`<b>Hi there!</b> Doodle over a mock Foundry architecture.`), holds, erases, types line 2 (`This is basically what I do — but custom for your product.`), loops. Blinking caret via `.canvas-caption-text::after` (`@keyframes captionCaret`). The leading heart SVG stays static. Reduced-motion shows the static first line only. (There was NO typewriter before — it was plain static text.)

**Help "?" tooltip (much-iterated — read carefully):**

- The flat round blue **`#mpHelp`** "?" button lives **inside the menubar flex row**, after the Help menu, as an in-flow item: `margin-left:auto; align-self:center; flex:0 0 auto`. (It was previously `position:absolute; top:33px` which **wrapped to a new line on real iPhones** — the in-flow flex approach fixed that. Do NOT revert to absolute positioning.)
- Popup `#mpHelpPop` (`.mp-help-pop`) is a yellow XP balloon tip with an arrow, listing features in a `<ul>`. Currently **4 `<li>`s**: Pick a colour / ↺ Redraw + ✕ clears / File menu / Minimize-Maximize. One `<li class="mp-help-desktop-only">` (Move/resize the window) is **hidden on phones** via `@media (max-width:991px){ li.mp-help-desktop-only{display:none} }`. (The "Draw a point" and "surprise" points were removed.)
- **Touch vs hover (critical):** `const isTouch = matchMedia('(hover: none),(pointer: coarse)') || ('ontouchstart' in window)`. Click + keydown(Enter/Space) toggle handlers are **always** attached. Hover handlers (mouseenter/mouseleave + 180ms hide timer) are attached **only `if (!isTouch)`**. This fixed a bug where touch users needed **two taps** (synthetic mouseenter opened, then click closed). On phone = single tap; on desktop = hover.
- **iOS over-blur fix:** `.mp-help-body` has `filter: blur(0.25px)` for a soft look on desktop, but iOS Safari renders blur far more aggressively than Android, so `@media (max-width:991px){ .mp-help-body{ filter:none } }` disables it on phones.
- **Dismiss-on-draw:** the canvas `down(e)` handler calls `closeMenus()` + `document.dispatchEvent(new CustomEvent('mp:dismiss-overlays'))`; the help IIFE listens for `mp:dismiss-overlays` → `closeHelp()`. So menus + help close the moment you start drawing or click elsewhere. (Drawing uses preventDefault + drag, so no click event fires — hence the custom event.)

### 5c. Chat card (`#rishabhChat.home-chat`)

A faux chat assistant ("Ask me anything"). Structure: `header.hc-head` (drag handle) + `.hc-body#hcBody` with `.hc-chips#hcChips` (3 `button.hc-chip` quick prompts: "Who are you?", "What do you work on?", "Tell me about Foundry") + an input footer. Has its own minimize/float/drag logic mirroring the paint widget. Avatar has a drop-in animation (`hcAvatarDrop`), typing dots (`hcDot`), streaming caret (`hcCaret`), mic button states.

- `.hc-chip:hover` polished: `background:var(--secondary-rgba); border-color:var(--accent); translateY(-2px)` + accent box-shadow; `:active` press.
- **Greeting height (no jump on first message):** in greeting mode `condense()` (desktop, `position:absolute`) STRETCHES the card so its top sits below the Download-CV button and its bottom aligns with the canvas widget's bottom. The `greetingObserver` (MutationObserver on `#hcBody` class) used to CLEAR that inline `top/bottom/height` when the convo started, which made the card shrink + drop its top (a visible jump). It now **keeps** the stretched geometry (condense() self-bails out of greeting), so there's no jump. Mobile (<992px) is unaffected (chat is in normal flow; condense early-returns).
- **Scrollbar vs resize handles:** `.home-chat` uses `overflow:hidden`, and the right-edge/right-corner resize handles (`rz-e/rz-ne/rz-se`) sat on top of the chat's scrollbar, stealing its pointer events (you'd resize instead of scroll, and couldn't scroll up through a long convo). Fix: those three handles are `display:none` **scoped to `.home-chat`** (the chat's right edge abuts the canvas, so rightward resize wasn't useful). The other 5 handles still resize. Paint widget unaffected.
- **Streaming auto-scroll guard:** `streamBotMessage()` only auto-scrolls to the bottom if the user is already within 40px of the bottom; if they scrolled up to re-read, it won't yank them down on every token.
- **Grid background:** `.hc-body` has a subtle graph-paper grid (`background-image` two linear-gradients, 22px cells; faint white in dark mode, faint black via `[color-scheme="light"] .hc-body`). Pinned to the panel (doesn't scroll with messages). Message bubbles keep their own fills.
- **Avatar sonar rings:** `.hc-body.is-greeting .hc-avatar-lg::before/::after` pulse outward (`@keyframes hcAvatarPing`, 9s, slow/large — expand to 5.5×, thin 0.75px accent lines, faint). Scoped to `.is-greeting`, so they **stop automatically** once the conversation starts (avatar hidden + class removed). Chat `overflow:hidden` clips them inside the chatbot.

### 5d. Touch detection pattern (used everywhere)

```js
const isTouch =
  window.matchMedia("(hover: none), (pointer: coarse)").matches ||
  "ontouchstart" in window;
```

Also: **`js/app.js` adds `.no-touch` to `<html>`** on non-touch devices (~L488 `$("html").addClass("no-touch")`). All hover-only CSS is gated under `.no-touch …:hover`. When adding hover effects, gate them with `.no-touch`.

---

## 5.5. JAVASCRIPT ARCHITECTURE (where the logic lives)

Only **3 external JS files** are loaded: `js/libs.min.js` (vendor), `js/app.js` (site bootstrap),
`js/gallery-init.js` (PhotoSwipe init). **Everything else is inline `<script>` IIFEs inside `index.html`.**
The gallery was split out simply because it's a standard, self-contained PhotoSwipe initialization;
the rest of the interactive logic was written inline as the widgets were built.

**Inline `<script>` blocks in `index.html` (approx line / length):**
| Line | ~Lines | Purpose |
|---|---|---|
| ~233 | 85 | Avatar reveal logic (the fixed left avatar panel) |
| ~1845 | 48 | Microsoft confetti explosion (banner easter egg) |
| ~1901 | 119 | Microsoft banner auto-fit width (measures text, sizes the pill) |
| ~2026 | 48 | **Hero card pointer-glow + phone edge-sweep** (the `--gx/--gy` driver + IntersectionObserver) |
| ~2076 | 67 | MS Paint widget **drag** (titlebar → move) |
| ~2146 | 221 | **Shared float/unfloat + resize helper** (used by BOTH chat and paint widgets) |
| ~2369 | 87 | Headline title auto-fit font sizing (shrinks h1 to fit 2 lines) |
| ~2458 | **554** | **Chat widget engine** (`#rishabhChat`: chips, input, faux replies, min/float, avatar drop) |
| ~3015 | **1052** | **MS Paint engine** (canvas 2D drawing, tools, palette, menus, Open/Save/Print, redraw animation) |

**Coupling / load-order facts (important if ever reorganizing this JS):**

- These IIFEs run **in document order** and several read DOM defined earlier in the page, so order matters.
- The **float/unfloat + resize helper (~L2146)** is a **shared dependency** of both the Paint and Chat widgets.
- Blocks communicate via globals and **custom events** (e.g. `mp:dismiss-overlays` ties the canvas `down()` to the help popup).
- There is **no build step** — any new `<script src>` must be placed at the right point in `<body>` (or use `defer`) and carry the `?v=` cache-bust.

---

## 6. WORKING CONVENTIONS & GOTCHAS

### Git / pushing

- **User explicitly controls when to push.** Implement and verify, then ask. Push only when the user says "push"/"yes".
- Push command: `git add -A; git commit -m "..."; git push` in pwsh (cwd is repo root).
- If push is rejected (remote ahead): `git pull --rebase; git push`.
- `css/main.css` commits show a harmless `LF will be replaced by CRLF` warning — ignore it.
- **Commit-splitting technique used here:** to keep the color retheme independently revertable, changes were split into (a) a feature commit on the original colors and (b) a color-only commit on top. The method: build a color-only patch (loader.css whole + main.css `:root` hunk + index.html color lines via zero-context `git diff --unified=0`), reverse-apply it to restore originals, commit everything else, re-apply it, commit colors alone. Verified the color commit touched only color lines. Temp helper files (`_*.ps1`, `_*.patch`) were created at repo root and deleted after — **always clean these up**.

### Playwright / browser verification (quirks)

- An integrated browser page is usually shared (file:// index.html). Page id changes per session.
- **Synthetic `page.mouse.move()` does NOT reliably latch CSS `:hover`/`mouseenter`** — use stepped moves (`{steps:6}`) or dispatch `new MouseEvent('mouseenter')` directly.
- **Chromium without touch emulation reports `hover:none` as FALSE**, so the IntersectionObserver phone-sweep path won't auto-run in the harness — that's expected; on a real phone it works. To test the sweep manually: 390px viewport, `el.classList.add('is-edge-sweeping')`, screenshot ~250ms apart.
- `element.screenshot()` with stale bounding boxes can grab the wrong region (the fixed avatar overlay often intrudes). Prefer full-page or carefully-clipped shots after `scrollIntoView({block:'center'})` + a wait.
- Canvas/widget screenshots can come out dark mid scroll-reveal.

### Implementation discipline

- This is a polished personal site — make **surgical, requested changes only**. Don't refactor, don't add features/comments/abstractions unprompted.
- Theme colors → variables, never hardcode (except the documented intentional exceptions).
- Keep desktop and mobile behaviors separate; verify a change on the breakpoint it targets.
- Reuse `--_animbezier` and the existing `--_radius-*` / spacing tokens.

---

## 7. RECENT COMMIT HISTORY (most recent first)

```
47f2cb6  Cache-bust CSS links so phones load the new stylesheet
72da063  Retheme site palette purple -> orange (REVERT THIS to restore original colors)
9aeb2b2  Card intro + hover edge-glow animations, phone edge-sweep, glassy avatar card, mobile spacing & help fixes
10530db  Disable help-text blur on phones (iOS over-blurs small text)
82e80eb  Hide drag/resize help line on phones; drop Draw point from help
010a459  On phone, X closes maximized canvas widget instead of clearing
de4c455  Fix help button needing two taps on touch (hover desktop-only, single tap phone)
a057aed  Close paint menus and help popup when drawing starts
5e74853  Anchor canvas help button in menu row for reliable mobile placement
0883241  Add classic Windows help tooltip to canvas widget
```

---

## 8. KNOWN OPEN ITEMS / POSSIBLE FOLLOW-UPS (do NOT action unprompted)

- **Security:** an Elastic Email API key was reportedly leaked in git history — should be rotated. (Do not commit secrets.)
- **Cleanup:** some unused old AI-research jpegs may exist (`opencv.jpeg`, `sentiment.jpeg`, `sarcasm.jpeg`, `driverai.jpeg`, `yellow.jpeg`) — candidates for deletion if confirmed unused.
- **Perf (CLS):** images lack explicit width/height attributes — adding them would reduce layout shift.
- **Consistency idea:** the edge-glow could be extended to the MS Paint widget or portfolio cards for a uniform feel (offered, not requested).
- Edge-sweep timing is `1.7s ease-in-out 1` — tunable if desired.

---

## 9. QUICK REFERENCE — "where do I change X?"

| I want to change…                                    | Go to…                                                                                                                                                 |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Any brand/theme color                                | `css/main.css` `:root` (~L68) **AND** `css/loaders/loader.css` (~L24)                                                                                  |
| Make a CSS change show on phones immediately         | bump `?v=` on the 3 `<link>`s in `index.html` ~L37                                                                                                     |
| Hero card hover glow / intro animation / phone sweep | `css/main.css` ~L4760–4960 (`@property --gx/--gy`, `avatarCardIn`, `socialSwingIn`, `edgeSweep`, `.no-touch …:hover`) + JS IIFE in `index.html` ~L2020 |
| Glassy avatar card surface                           | `.avatar__container::before` in `css/main.css` ~L3215                                                                                                  |
| Chat card spacing on mobile                          | `.home-chat { margin … }` (mobile rule) in `css/main.css` ~L5320                                                                                       |
| MS Paint widget look/behavior                        | `.ms-paint …` in `css/main.css` ~L5800–6500 + paint JS in `index.html`                                                                                 |
| Paint help "?" button / tooltip                      | `.mp-help-btn` / `.mp-help-pop` / `.mp-help-body` in `css/main.css` + help IIFE in `index.html` ~L3685                                                 |
| Microsoft banner                                     | inline style on `#microsoftBanner` in `index.html` ~L383                                                                                               |
| Canvas widget scale per breakpoint                   | `--mp-scale` in the `.home-canvas-wrap` media queries in `css/main.css`                                                                                |
| Hover effects (must be desktop-only)                 | gate under `.no-touch …:hover`                                                                                                                         |
