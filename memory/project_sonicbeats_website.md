---
name: project-sonicbeats-website
description: SonicBeats luxury speaker sales website — structure, stack, and design decisions
metadata:
  type: project
---

Full luxury speaker sales landing page built from scratch as a static site (no framework).

**Why:** User wanted a luxury, interactive, scroll-sensitive website to sell/commission custom handcrafted Bluetooth speakers. Matches design mockup provided.

**Stack:** Vanilla HTML/CSS/JS, Google Fonts (Cormorant Garamond + Inter), Web Audio API, IntersectionObserver, CSS custom properties for theming.

**Files:**
- `index.html` — full single-page layout
- `css/styles.css` — all styles (~700 lines), theming via CSS custom properties
- `js/app.js` — all JS modules (~450 lines), zero dependencies
- `.claude/launch.json` — uses `python -m http.server 3000` to serve locally

**Key features built:**
- Mouse-following radial cursor light (GPU-accelerated via transform)
- Dark/light (wood) theme toggle with localStorage persistence
- 3D speaker tilt on mouse move (perspective rotateX/Y)
- Speaker breathing idle animation + expand-on-hover with glow rings
- Web Audio API bass pulse on speaker hover, wood knock vs electronic click on theme switch
- IntersectionObserver scroll reveal with staggered delays
- Cart drawer with localStorage persistence
- Film modal, contact form with validation, toast notifications
- Scroll progress bar at top of viewport
- Active nav highlight on scroll

**How to apply:** When updating, keep the module pattern in app.js (each feature is a self-contained IIFE with init()). Theme tokens are all in CSS custom properties at the top of styles.css — easy to adjust colors there.
