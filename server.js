const express = require('express');
const fs = require('fs');
const path = require('path');
const { renderMetaTags, renderStructuredData, renderPage, generateSitemap } = require('./ssr');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const DATA_FILE = path.join(__dirname, 'cms-data.json');
const ZIP_RANGES = JSON.parse(fs.readFileSync(path.join(__dirname, 'zip-ranges.json'), 'utf-8'));
const CRM_WEBHOOK = 'https://crm.firstmanventures.com/api/webhooks/leads/rhino';
const CUSTOM_WEBHOOK = process.env.LEAD_WEBHOOK_URL || 'https://hook.eu2.make.com/qpjh4zn8zvjslc2kog3yu17ctv9shw9g';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), { index: false, redirect: false }));

// Forward leads to CRM and optional custom webhook
async function forwardLead(data) {
  const payload = {
    name: data.name || data.firstName ? `${data.firstName || ''} ${data.lastName || ''}`.trim() : 'Website Lead',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    zip: data.zip || '',
    source: 'Website',
    notes: data.notes || data.message || '',
    message: data.message || ''
  };

  const targets = [CRM_WEBHOOK];
  if (CUSTOM_WEBHOOK) targets.push(CUSTOM_WEBHOOK);

  for (const url of targets) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error(`Webhook failed (${url}):`, err.message);
    }
  }
}

// Load CMS data
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  const defaults = JSON.parse(fs.readFileSync(path.join(__dirname, 'cms-defaults.json'), 'utf-8'));
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaults, null, 2));
  return defaults;
}

// Read HTML template once
const templatePath = path.join(__dirname, 'public', 'index.html');
function getTemplate() {
  return fs.readFileSync(templatePath, 'utf-8');
}

// Render full page with SSR content + meta tags
function renderSSRPage(reqPath) {
  const CMS = loadData();
  const template = getTemplate();
  const meta = renderMetaTags(reqPath, CMS, BASE_URL);
  const structuredData = renderStructuredData(reqPath, CMS, BASE_URL);
  const pageContent = renderPage(reqPath, CMS);

  let html = template;

  // Replace <title> and inject meta tags into <head>
  html = html.replace(
    /<title>.*?<\/title>/,
    meta + '\n    ' + structuredData
  );

  // Inject SSR content into <main id="app">
  html = html.replace(
    '<main id="app"></main>',
    `<main id="app">${pageContent}</main>`
  );

  return html;
}

// --- API Routes ---

app.get('/api/content', (req, res) => {
  res.json(loadData());
});

app.get('/api/content/:page', (req, res) => {
  const data = loadData();
  const page = req.params.page;
  if (data[page]) {
    res.json(data[page]);
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
});

app.put('/api/content/:page', (req, res) => {
  const data = loadData();
  const page = req.params.page;
  data[page] = req.body;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true, data: data[page] });
});

app.patch('/api/content/:page', (req, res) => {
  const data = loadData();
  const page = req.params.page;
  if (!data[page]) data[page] = {};
  Object.assign(data[page], req.body);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true, data: data[page] });
});

app.post('/api/quote', (req, res) => {
  const quotesFile = path.join(__dirname, 'quotes.json');
  let quotes = [];
  if (fs.existsSync(quotesFile)) {
    quotes = JSON.parse(fs.readFileSync(quotesFile, 'utf-8'));
  }
  quotes.push({ ...req.body, timestamp: new Date().toISOString() });
  fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2));
  forwardLead(req.body);
  res.json({ success: true, message: 'Quote request received!' });
});

app.post('/api/contact', (req, res) => {
  const contactFile = path.join(__dirname, 'contacts.json');
  let contacts = [];
  if (fs.existsSync(contactFile)) {
    contacts = JSON.parse(fs.readFileSync(contactFile, 'utf-8'));
  }
  contacts.push({ ...req.body, timestamp: new Date().toISOString() });
  fs.writeFileSync(contactFile, JSON.stringify(contacts, null, 2));
  forwardLead(req.body);
  res.json({ success: true, message: 'Message received!' });
});

app.post('/api/newsletter', (req, res) => {
  const nlFile = path.join(__dirname, 'newsletter.json');
  let subs = [];
  if (fs.existsSync(nlFile)) {
    subs = JSON.parse(fs.readFileSync(nlFile, 'utf-8'));
  }
  subs.push({ email: req.body.email, timestamp: new Date().toISOString() });
  fs.writeFileSync(nlFile, JSON.stringify(subs, null, 2));
  res.json({ success: true });
});

// --- Zip Code Lookup ---
app.get('/api/zip-lookup/:zip', (req, res) => {
  const zip = req.params.zip;
  if (!/^\d{5}$/.test(zip)) {
    return res.json({ valid: false, error: 'Invalid zip code' });
  }
  const prefix = parseInt(zip.substring(0, 2), 10);
  const match = ZIP_RANGES.ranges.find(r => prefix >= r.min && prefix <= r.max);
  if (!match) {
    return res.json({ valid: false, error: 'Zip code not recognized' });
  }
  const stateCode = match.state;
  const stateName = ZIP_RANGES.stateNames[stateCode] || stateCode;
  const data = loadData();
  const zipPricing = data.zipPricing || { baseMultiplier: 1.0, states: {} };
  const stateConfig = zipPricing.states[stateCode];
  const multiplier = stateConfig ? stateConfig.multiplier : zipPricing.baseMultiplier;
  res.json({ valid: true, state: stateCode, stateName, multiplier });
});

// --- SEO Routes ---

app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(
`User-agent: *
Allow: /
Disallow: /sh-admin
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml`
  );
});

app.get('/sitemap.xml', (req, res) => {
  const CMS = loadData();
  res.type('application/xml').send(generateSitemap(BASE_URL, CMS));
});

// --- Location Page Routes ---
// Serve static HTML location pages (generated by location-generator)
const LOCATIONS_DIR = path.join(__dirname, 'public', 'locations');

// Helper: prettify state slug for display ("new-york" -> "New York")
function unslugify(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// City page: /locations/:state/:city -> public/locations/:state/:city.html
app.get('/locations/:state/:city', (req, res, next) => {
  const { state, city } = req.params;
  // Sanitize to prevent path traversal
  if (/[^a-z0-9-]/.test(state) || /[^a-z0-9-]/.test(city)) return next();
  const filePath = path.join(LOCATIONS_DIR, state, `${city}.html`);
  if (fs.existsSync(filePath)) {
    res.type('html').send(fs.readFileSync(filePath, 'utf-8'));
  } else {
    next();
  }
});

// State index: /locations/:state -> list all cities in that state
app.get('/locations/:state', (req, res, next) => {
  const stateSlug = req.params.state;
  if (/[^a-z0-9-]/.test(stateSlug)) return next();
  const stateDir = path.join(LOCATIONS_DIR, stateSlug);
  if (!fs.existsSync(stateDir) || !fs.statSync(stateDir).isDirectory()) return next();

  const stateName = unslugify(stateSlug);
  const cities = fs.readdirSync(stateDir)
    .filter(f => f.endsWith('.html'))
    .map(f => {
      const citySlug = f.replace('.html', '');
      return { slug: citySlug, name: unslugify(citySlug) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  if (cities.length === 0) return next();

  // Build state index page using location template styling
  const html = buildStateIndexPage(stateName, stateSlug, cities);
  res.type('html').send(html);
});

function buildStateIndexPage(stateName, stateSlug, cities) {
  const g = loadData().global || {};
  const company = g.companyName || 'Shiny Rhino';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#4AADE0">
  <title>Carpet Cleaning in ${stateName} | ${company}</title>
  <meta name="description" content="Professional carpet cleaning services in ${stateName}. Find your local Shiny Rhino team. IICRC-certified technicians, eco-friendly solutions. Free quotes.">
  <link rel="canonical" href="${BASE_URL}/locations/${stateSlug}">
  <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/locations/locations.css">
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src="https://dgs.myshinyrhino.com/gtm.js?"+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','id=GTM-KKHWNM9N');</script>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"${BASE_URL}/"},{"@type":"ListItem","position":2,"name":"Locations","item":"${BASE_URL}/locations"},{"@type":"ListItem","position":3,"name":"${stateName}","item":"${BASE_URL}/locations/${stateSlug}"}]}</script>
</head>
<body>
  <noscript><iframe src="https://dgs.myshinyrhino.com/ns.html?id=GTM-KKHWNM9N" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <div class="top-bar">
    <div class="container top-bar-inner">
      <a href="tel:4846301533" class="phone-link">(484) 630-1533</a>
      <div class="top-bar-actions">
        <a href="/quote" class="top-bar-btn top-bar-btn--res">Home Cleaning Quote</a>
        <a href="/quote/commercial" class="top-bar-btn top-bar-btn--com">Business Cleaning Quote</a>
      </div>
    </div>
  </div>
  <nav class="navbar">
    <div class="container nav-inner">
      <a href="/" class="logo"><img src="/logo.png" alt="Shiny Rhino" width="120" height="120" style="height:120px;width:auto;"></a>
      <button class="mobile-toggle" id="mobileToggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
      <ul class="nav-links" id="navLinks">
        <li class="has-dropdown"><a href="/services/carpet">Services</a>
          <div class="mega-dropdown">
            <div class="mega-col"><h4>Floor Cleaning</h4><a href="/services/carpet">Carpet Cleaning</a><a href="/services/rug">Area Rug Cleaning</a><a href="/services/tile">Tile & Grout Cleaning</a><a href="/services/hardwood">Hardwood Floor Cleaning</a><a href="/services/stone">Natural Stone Cleaning</a></div>
            <div class="mega-col"><h4>Upholstery</h4><a href="/services/upholstery">Furniture & Upholstery</a><a href="/services/vehicle">Car, Boat & RV</a></div>
            <div class="mega-col"><h4>Emergency</h4><a href="/services/water">Water Damage Restoration</a></div>
          </div>
        </li>
        <li><a href="/products">Products</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/locations">Locations</a></li>
        <li><a href="/quote" class="nav-cta">Get a Quote</a></li>
      </ul>
    </div>
  </nav>
  <div class="loc-breadcrumb">
    <div class="container">
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li><a href="/locations">Locations</a></li>
          <li>${stateName}</li>
        </ol>
      </nav>
    </div>
  </div>
  <main class="loc-main">
    <div class="container">
      <h1>Carpet Cleaning in ${stateName}</h1>
      <p>Find professional carpet cleaning services near you. Select your city below to see local pricing, service details, and schedule your appointment.</p>
      <p style="margin-bottom:32px;color:var(--text-muted);">${cities.length} cities served in ${stateName}</p>
      <div class="loc-city-grid">
        ${cities.map(c => `<a href="/locations/${stateSlug}/${c.slug}">${c.name}</a>`).join('\n        ')}
      </div>
      <div style="margin-top:48px;text-align:center;">
        <a href="/locations" class="btn btn-outline">View All States</a>
        <a href="/quote" class="btn btn-primary" style="margin-left:12px;">Get a Free Quote</a>
      </div>
    </div>
  </main>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col"><div class="footer-logo"><img src="/logo.png" alt="Shiny Rhino" width="60" height="60" style="height:60px;width:auto;" loading="lazy"></div><p class="footer-tagline">Professional cleaning services you can trust. Serving homes and businesses nationwide.</p></div>
        <div class="footer-col"><h4>Services</h4><ul><li><a href="/services/carpet">Carpet Cleaning</a></li><li><a href="/services/upholstery">Upholstery Cleaning</a></li><li><a href="/services/tile">Tile & Grout</a></li><li><a href="/services/hardwood">Hardwood Floors</a></li><li><a href="/services/vehicle">Car, Boat & RV</a></li><li><a href="/services/water">Water Damage</a></li></ul></div>
        <div class="footer-col"><h4>About</h4><ul><li><a href="/about">Our Story</a></li><li><a href="/faq">FAQs</a></li><li><a href="/blog">Blog</a></li><li><a href="/locations">Locations</a></li></ul></div>
        <div class="footer-col"><h4>Contact</h4><ul><li><a href="tel:4846301533">(484) 630-1533</a></li><li><a href="mailto:info@shinyrhino.com">info@shinyrhino.com</a></li><li>Mon-Fri: 7am - 8pm</li><li>Sat: 8am - 5pm</li></ul></div>
      </div>
      <div class="footer-bottom"><p>&copy; 2026 Shiny Rhino. All rights reserved.</p></div>
    </div>
  </footer>
  <script>document.getElementById('mobileToggle').addEventListener('click',function(){document.getElementById('navLinks').classList.toggle('active');this.classList.toggle('active');});</script>
</body>
</html>`;
}

// --- SSR Page Routes ---
// Define explicit routes for SSR so each page gets proper meta + content

const ssrRoutes = [
  '/', '/quote', '/quote/commercial', '/products', '/about', '/blog', '/faq',
  '/locations', '/contact', '/sh-admin',
  '/services/carpet', '/services/upholstery', '/services/tile',
  '/services/hardwood', '/services/rug', '/services/stone',
  '/services/water', '/services/vehicle',
];

ssrRoutes.forEach(route => {
  app.get(route, (req, res) => {
    res.send(renderSSRPage(route));
  });
});

// SPA fallback for any unmatched routes
app.get('*', (req, res) => {
  res.send(renderSSRPage(req.path));
});

app.listen(PORT, () => {
  console.log(`Shiny Rhino running at http://localhost:${PORT}`);
});
