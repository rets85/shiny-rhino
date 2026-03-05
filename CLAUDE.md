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

## Routes
- `/` - Home page
- `/quote` - Line-item pricing calculator (qty +/-, add-ons, sticky sidebar summary)
- `/admin` - Pricing admin dashboard (categories, items, add-ons, hidden fees, export/import)
- `/services/:key` - Service pages (carpet, upholstery, tile, hardwood, rug, stone, water, vehicle)
- `/products`, `/about`, `/blog`, `/faq`, `/locations`, `/contact` - Content pages
- `/robots.txt`, `/sitemap.xml` - SEO files (auto-generated)

## CMS Data
- `cms-defaults.json` - Default content (committed to git, used as bootstrap)
- `cms-data.json` - Runtime data (gitignored, created from defaults on first run)
- `pricing` key in CMS controls the quote calculator and admin dashboard
- API: `GET/PUT/PATCH /api/content/:page`

## Development
```bash
node server.js          # Start on port 3000
# or
npm start
```

## Notes
- `cms-data.json` is gitignored; Railway uses ephemeral storage so data resets on deploy (bootstraps from cms-defaults.json)
- Admin page is at `/admin` - blocked from search engines via robots.txt
- No database; all data stored in JSON files
