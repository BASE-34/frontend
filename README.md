# B.A.S.E.34 — SvelteKit Website

**Bureau of Advanced Systems & Electronics №34**

---

***Important: This is only a beta version of the frontend; it will still undergo significant editing.***

---

## Stack

| Tool | Version | Role |
|---|---|---|
| SvelteKit | 2.x | Hybrid SSR + SPA framework |
| Svelte | 5 (Runes) | Reactive UI |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Utility styling with custom design tokens |
| adapter-node | latest | Node.js production server |
---

## Quick Start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → ./build/
npm run preview    # preview production build locally
```

**Run in production:**
```bash
node build/index.js
```

---

## Project Structure

```
src/
├── app.css                      # Global styles + Tailwind + design tokens
├── app.html                     # HTML shell (dark class, meta)
│
├── lib/
│   ├── i18n/
│   │   ├── en.ts                # English strings (all pages)
│   │   ├── ua.ts                # Ukrainian strings (all pages)
│   │   ├── store.ts             # Reactive lang store (localStorage-backed)
│   │   └── index.ts
│   │
│   ├── components/
│   │   ├── Navbar.svelte        # Glassmorphism sticky nav + mobile menu + lang toggle
│   │   ├── Footer.svelte        # Footer with nav, legal, system status
│   │   ├── PageHeader.svelte    # Reusable page header (badge · h1 · meta sidebar)
│   │   ├── ProjectCard.svelte   # Project card (status badge, image, metric, tags)
│   │   └── NewsCard.svelte      # News article card (category, image, excerpt)
│   │
│   ├── actions/
│   │   └── reveal.ts            # Intersection Observer scroll-reveal Svelte actions
│   │
│   ├── data/
│   │   ├── projects.ts          # ← EDIT THIS to add/change projects
│   │   └── news.ts              # ← EDIT THIS to add/change articles
│   │
│   └── types/
│       └── index.ts             # TypeScript interfaces (Project, NewsItem, etc.)
│
└── routes/
    ├── +layout.server.ts        # SSR: detect Accept-Language → seed lang
    ├── +layout.svelte           # Root layout: Navbar + Footer + View Transitions
    ├── +page.server.ts          # SSR meta for homepage
    ├── +page.svelte             # Homepage (Hero, Mission, Expertise, CTA)
    │
    ├── projects/
    │   ├── +page.server.ts      # SSR: load projects + meta
    │   └── +page.svelte         # Projects grid + stats bar
    │
    ├── news/
    │   ├── +page.server.ts      # SSR: load newsItems + meta
    │   └── +page.svelte         # Featured bento + filterable archive
    │
    ├── protocol/
    │   ├── +page.server.ts      # SSR: meta
    │   └── +page.svelte         # Searchable FAQ + sticky sidebar
    │
    └── contact/
        ├── +page.server.ts      # SSR: meta
        └── +page.svelte         # Contact form + info panel
```

---
## Design System — "Obsidian Blueprint"

**Core rule:** No rounded corners (except `.rounded-full`). Separation via background-color shifts, never explicit lines.

| Token | Hex | Use |
|---|---|---|
| `primary` | `#a4d1ae` | Phosphor green — CTAs, highlights, icons |
| `primary-container` | `#386145` | Tinted badge backgrounds |
| `surface` | `#121412` | Base page background |
| `surface-container-low` | `#1a1c1a` | Inset / etched fields |
| `surface-container` | `#1e201e` | Card backgrounds |
| `surface-container-high` | `#282a28` | Hover states |
| `surface-container-highest` | `#333533` | Active/selected states |
| `on-surface` | `#e2e3df` | Primary text |
| `on-surface-variant` | `#c3c8c1` | Secondary text |
| `outline-variant` | `#434843` | Subtle dividers (15% opacity max) |

**Typography:** Space Grotesk — `font-black` for headlines, tight tracking (`tracking-tighter`), all uppercase.
**Icons:** Material Symbols Outlined.
**Background texture:** Blueprint grid — 48px repeating 1px lines at 4% opacity.

---

## Deployment

### Node.js server
```bash
npm run build
node build/index.js
# PORT=3000 node build/index.js
```

### Docker

A stable, multi-stage `Dockerfile` is included for containerizing the application.

**1. Build the Docker image:**
```bash
docker build -t base34-site .
```

**2. Run the Docker container:**
```bash
docker run -p 3000:3000 -d base34-site
```
The site will be available at `http://localhost:3000`.

### Vercel / Netlify / Cloudflare
Swap `adapter-node` in `svelte.config.js` for the platform adapter:
```bash
npm i -D @sveltejs/adapter-vercel   # or adapter-netlify / adapter-cloudflare
```
```js
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
```
