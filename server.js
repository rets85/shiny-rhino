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
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

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
  const zipPricing = data.zipPricing || { baseMultiplier: 1.0, states: {}, zipOverrides: {} };
  // Priority: zip override > state multiplier > base multiplier
  const zipOverride = (zipPricing.zipOverrides || {})[zip];
  const stateConfig = zipPricing.states[stateCode];
  let multiplier, source;
  if (zipOverride) {
    multiplier = zipOverride.multiplier;
    source = 'zip';
  } else if (stateConfig) {
    multiplier = stateConfig.multiplier;
    source = 'state';
  } else {
    multiplier = zipPricing.baseMultiplier;
    source = 'base';
  }
  res.json({ valid: true, state: stateCode, stateName, multiplier, source });
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
