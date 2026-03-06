# Shiny Rhino - Carpet Cleaning Website

## Project Overview
Single-page application (SPA) for a carpet cleaning business with server-side rendering for SEO. Built with vanilla JS frontend + Express backend.

## Tech Stack
- **Backend**: Node.js + Express (`server.js`)
- **Frontend**: Vanilla JS SPA (`public/app.js`), CSS (`public/styles.css`)
- **SSR**: `ssr.js` - server-side rendering for SEO (meta tags, Open Graph, JSON-LD, sitemap)
- **Data**: JSON file CMS (`cms-defaults.json` for defaults, `cms-data.json` for runtime)

## Deployment
- **Hosting**: Railway
- **Live URL**: https://shiny-rhino-production.up.railway.app
- **Railway project**: shiny-rhino (linked via `railway link`)
- **Deploy command**: `railway up --detach` from project root
- **Env vars on Railway**: `BASE_URL=https://shiny-rhino-production.up.railway.app`
- **GitHub**: https://github.com/rets85/carpets.git (branch: master)

## Key Architecture
- `server.js` handles API routes, SSR injection, and SPA fallback
- `ssr.js` generates per-route HTML, meta tags, structured data, and sitemap.xml
- `public/index.html` is the SPA shell template; server injects SSR content into `<main id="app">`
- Client JS (`app.js`) re-renders on load for interactivity (hydration)
- Static files served with `index: false` so SSR handles `/`
- No query parameters — all pages use clean URLs for SEO

## Routes
- `/` - Home page
- `/quote` - Residential pricing calculator (qty +/-, add-ons, sticky sidebar)
- `/quote/commercial` - Commercial pricing calculator (separate clean URL, dark header)
- `/sh-admin` - Advanced CMS admin (sidebar nav, structured editors for all pages/services/pricing)
- `/services/:key` - Service pages (carpet, upholstery, tile, hardwood, rug, stone, water, vehicle)
- `/products` - Products listing with working cart (inline toast, +/- qty, sidebar total)
- `/products/:slug` - Individual product detail pages (SEO-friendly slugs)
- `/about`, `/blog`, `/faq`, `/locations`, `/contact` - Content pages
- `/robots.txt`, `/sitemap.xml` - SEO files (auto-generated, includes product URLs)

## CMS Admin (`/sh-admin`)
- Sidebar navigation: Pricing, Pages (Global, Home, About, Products, Blog, FAQ, Contact, Locations), Services (each service individually)
- Structured field editors with labeled inputs (not generic recursive JSON)
- Array items with reorder (up/down), add, remove
- Nested arrays supported (e.g. blog categories > posts, FAQ categories > questions)
- Pricing tab: hidden fee, categories with items table, add-ons, instructions
- Export/Import for pricing config
- Save status indicator, toast notifications

## CMS Data
- `cms-defaults.json` - Default content (committed to git, used as bootstrap)
- `cms-data.json` - Runtime data (gitignored, created from defaults on first run)
- `pricing` key controls the quote calculator pricing
- API: `GET/PUT/PATCH /api/content/:page`

## Design Notes
- Logo: transparent PNG (`logo.png`) created via remove.bg, also `logo.jpg` original
- Favicon: multi-size ICO (16/32/48px) from logo
- No emojis anywhere — SVG icons (`ICONS` object) and Unsplash photos for service tiles
- Toast notifications instead of alert() popups throughout
- All content is original — do NOT copy from Stanley Steemer or other competitors

## Development
```bash
node server.js          # Start on port 3000
# or
npm start
```

## Notes
- `cms-data.json` is gitignored; Railway uses ephemeral storage so data resets on deploy (bootstraps from cms-defaults.json)
- Admin at `/sh-admin` — blocked from search engines via robots.txt
- No database; all data stored in JSON files
