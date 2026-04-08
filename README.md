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
| Express | 5 | Mock API server (development) |
| Vitest | 3 | Unit & integration testing |
| adapter-node | latest | Node.js production server |
| Docker | — | Containerization & dev environment |

---

## Architecture

```
┌──────────────────────┐        ┌──────────────────────┐
│   SvelteKit Frontend │        │     Mock API Server   │
│       :5173          │◄──────►│       :4000           │
│                      │  REST  │  Express + JSON data  │
│  +page.server.ts     │  JSON  │  /api/news            │
│  → apiFetch()        │        │  /api/projects        │
│  → Form Actions      │        │  /api/stats           │
│                      │        │  /api/contact          │
└──────────────────────┘        └──────────────────────┘
        │ API_BASE_URL env var           ▲
        └────────────────────────────────┘
```

All data flows through `$lib/server/api.ts` — a server-only fetch wrapper that reads `API_BASE_URL` from environment variables. In development, this points to the mock server; in production, to your real backend.

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10

### Install & Run

```bash
# 1. Install frontend dependencies
npm install

# 2. Install mock server dependencies
cd mock-server && npm install && cd ..

# 3. Run frontend + mock API together
npm run dev:mock
```

This starts both:
- **Mock API** at `http://localhost:4000` (Express server with seed data)
- **Frontend** at `http://localhost:5173` (SvelteKit dev server)

### Alternative: Run Separately

```bash
# Terminal 1 — Mock API
npm run mock-server

# Terminal 2 — Frontend
npm run dev
```

---

## NPM Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start SvelteKit dev server only (requires API running separately) |
| `npm run dev:mock` | Start frontend + mock API concurrently |
| `npm run mock-server` | Start mock API server on `:4000` |
| `npm run build` | Production build → `./build/` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Vitest suite (45 tests) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run check` | SvelteKit type checking |

---

## Docker

The project ships with multi-profile Docker Compose for both development and production.

### Mock Mode (Development)

Starts the mock API + frontend — no external backend needed:

```bash
docker compose --profile mock up --build
```

This runs:
- `mock-api` → `http://localhost:4000` (Express mock server)
- `frontend-mock` → `http://localhost:3000` (SvelteKit, Turnstile disabled)

### Production Mode

Starts only the frontend, connected to your real backend:

```bash
# Set your environment variables
export API_BASE_URL=https://api.your-backend.com
export PUBLIC_ENABLE_TURNSTILE=true
export PUBLIC_TURNSTILE_SITE_KEY=your_site_key
export TURNSTILE_SECRET_KEY=your_secret_key

docker compose --profile production up --build
```

### Standalone Docker Build

```bash
# Build
docker build -t base34-site \
  --build-arg API_BASE_URL=http://your-api:4000 \
  --build-arg PUBLIC_ENABLE_TURNSTILE=true .

# Run
docker run -p 3000:3000 \
  -e API_BASE_URL=http://your-api:4000 \
  -e PUBLIC_ENABLE_TURNSTILE=true \
  -e PUBLIC_TURNSTILE_SITE_KEY=your_key \
  -e TURNSTILE_SECRET_KEY=your_secret \
  -d base34-site
```

---

## API Endpoints (Mock Server)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/news` | List all news articles (no full content) |
| `GET` | `/api/news/:id` | Single article with full markdown body |
| `GET` | `/api/projects` | List all projects (no full descriptions) |
| `GET` | `/api/projects/:id` | Single project with full markdown description |
| `GET` | `/api/stats` | Site statistics `{ active, hardware, workshops, members }` |
| `POST` | `/api/contact` | Submit contact form `{ name, email, subject, message }` |
| `GET` | `/api/health` | Health check |

All article and project content is stored as **markdown** in the JSON data files.

---

## Project Structure

```
├── mock-server/                  # Standalone Express mock API
│   ├── index.ts                  # Server entry (Express 5 + http.createServer)
│   ├── data/
│   │   ├── news.json             # 8 articles with full markdown (EN + UA)
│   │   ├── projects.json         # 5 projects with full descriptions (EN + UA)
│   │   └── stats.json            # Site statistics
│   ├── Dockerfile                # Container for mock server
│   └── package.json
│
├── src/
│   ├── app.css                   # Global styles + Tailwind + design tokens
│   ├── app.html                  # HTML shell
│   │
│   ├── lib/
│   │   ├── server/
│   │   │   └── api.ts            # Server-only API client (fetch wrapper)
│   │   │
│   │   ├── i18n/
│   │   │   ├── en.ts             # English translations
│   │   │   ├── ua.ts             # Ukrainian translations
│   │   │   ├── store.ts          # Reactive lang store
│   │   │   └── index.ts
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.svelte     # Glassmorphism sticky nav + lang toggle
│   │   │   ├── Footer.svelte     # Footer with nav, legal, system status
│   │   │   ├── PageHeader.svelte # Reusable page header
│   │   │   ├── ProjectCard.svelte# Project card → links to /projects/[slug]
│   │   │   ├── NewsCard.svelte   # News card → links to /news/[slug]
│   │   │   ├── SecurityGate.svelte# Cloudflare Turnstile gate
│   │   │   └── Turnstile.svelte  # Turnstile widget component
│   │   │
│   │   ├── actions/
│   │   │   ├── reveal.ts         # Scroll-reveal Svelte actions
│   │   │   └── decode.ts         # Text decode animation action
│   │   │
│   │   ├── security.ts           # Security verification state
│   │   │
│   │   └── types/
│   │       └── index.ts          # TypeScript interfaces
│   │
│   └── routes/
│       ├── +layout.server.ts     # SSR: lang detection + Turnstile feature flag
│       ├── +layout.svelte        # Root layout: Navbar + SecurityGate + Footer
│       ├── +page.server.ts       # Homepage: loads stats from API
│       ├── +page.svelte          # Homepage (Hero, Mission, Expertise, CTA)
│       │
│       ├── projects/
│       │   ├── +page.server.ts   # Loads projects + stats from API
│       │   ├── +page.svelte      # Projects grid + stats bar
│       │   └── [slug]/
│       │       ├── +page.server.ts # Loads single project by slug
│       │       └── +page.svelte    # Project detail (markdown, metrics, CTA)
│       │
│       ├── news/
│       │   ├── +page.server.ts   # Loads news items from API
│       │   ├── +page.svelte      # Featured bento + filterable archive
│       │   └── [slug]/
│       │       ├── +page.server.ts # Loads single article by slug
│       │       └── +page.svelte    # Article detail (markdown, sidebar)
│       │
│       ├── protocol/
│       │   ├── +page.server.ts   # SSR: meta
│       │   └── +page.svelte      # Searchable FAQ + sticky sidebar
│       │
│       └── contact/
│           ├── +page.server.ts   # Form Actions: validation + API + Turnstile
│           └── +page.svelte      # Contact form (use:enhance) + info panel
│
├── tests/
│   ├── vitest.config.ts          # Isolated Vitest config
│   ├── mocks/                    # SvelteKit module mocks for testing
│   ├── unit/
│   │   ├── api.test.ts           # API client tests (5)
│   │   ├── types.test.ts         # Type validation tests (8)
│   │   └── mock-data.test.ts     # Data integrity tests (14)
│   └── integration/
│       ├── api-endpoints.test.ts # Endpoint contract tests (9)
│       └── contact-validation.test.ts # Form validation tests (9)
│
├── docker-compose.yml            # Multi-profile (mock + production)
├── Dockerfile                    # Multi-stage frontend build
├── .env.example                  # Environment variable documentation
└── package.json
```

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `API_BASE_URL` | ✅ | — | Backend API URL (e.g., `http://localhost:4000`) |
| `PUBLIC_ENABLE_TURNSTILE` | ❌ | `true` | Set to `false` to disable Cloudflare Turnstile |
| `PUBLIC_TURNSTILE_SITE_KEY` | ❌ | — | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | ❌ | — | Cloudflare Turnstile secret key |

Create a `.env` file from the example:
```bash
cp .env.example .env
```

For local development with mock server, the defaults work out of the box:
```env
API_BASE_URL=http://localhost:4000
PUBLIC_ENABLE_TURNSTILE=false
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

**Typography:** Space Grotesk — `font-black` for headlines, tight tracking, all uppercase.
**Icons:** Material Symbols Outlined.
**Background texture:** Blueprint grid — 48px repeating 1px lines at 4% opacity.

---

## Testing

```bash
npm test              # Run all 45 tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

Test structure:
- **Unit:** API client, type validation, mock data integrity
- **Integration:** API endpoint contracts, contact form validation

---

## Security — Cloudflare Turnstile

The project has site-wide protection via [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/). In development mode (`PUBLIC_ENABLE_TURNSTILE=false`), the security gate is automatically disabled so you can work without Cloudflare keys.

### Getting Keys

1. Go to [Cloudflare Dashboard → Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Create a new widget for your domain
3. Copy the **Site Key** and **Secret Key**

### Configuration

**`.env` file:**
```env
# Enable Turnstile (production)
PUBLIC_ENABLE_TURNSTILE=true
PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...
TURNSTILE_SECRET_KEY=0x4AAAAAAA...
```

**Docker deployment:**
```bash
docker run -p 3000:3000 \
  -e PUBLIC_ENABLE_TURNSTILE=true \
  -e PUBLIC_TURNSTILE_SITE_KEY=your_site_key \
  -e TURNSTILE_SECRET_KEY=your_secret_key \
  -e API_BASE_URL=http://your-api:4000 \
  -d base34-site
```

**CI/CD:** Add these as repository secrets in your pipeline configuration.

> **Note:** When `PUBLIC_ENABLE_TURNSTILE=false`, the `SecurityGate` component is not rendered and no Cloudflare requests are made. This is the default for `dev:mock` and the Docker `mock` profile.

---

## Deployment

### Node.js Server
```bash
npm run build
API_BASE_URL=https://api.example.com node build/index.js
```

### Vercel / Netlify / Cloudflare
Swap `adapter-node` in `svelte.config.js` for the platform adapter:
```bash
npm i -D @sveltejs/adapter-vercel   # or adapter-netlify / adapter-cloudflare
```
```js
// svelte.config.js
import adapter from '@sveltejs/adapter-vercel';
```

---

## License

© 2026 B.A.S.E.34. All rights reserved.
