const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'cms-data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load CMS data
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  }
  // Initialize with defaults from cms-defaults.json
  const defaults = JSON.parse(fs.readFileSync(path.join(__dirname, 'cms-defaults.json'), 'utf-8'));
  fs.writeFileSync(DATA_FILE, JSON.stringify(defaults, null, 2));
  return defaults;
}

// GET all CMS data
app.get('/api/content', (req, res) => {
  res.json(loadData());
});

// GET content for a specific page
app.get('/api/content/:page', (req, res) => {
  const data = loadData();
  const page = req.params.page;
  if (data[page]) {
    res.json(data[page]);
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
});

// UPDATE content for a specific page
app.put('/api/content/:page', (req, res) => {
  const data = loadData();
  const page = req.params.page;
  data[page] = req.body;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true, data: data[page] });
});

// UPDATE a specific field
app.patch('/api/content/:page', (req, res) => {
  const data = loadData();
  const page = req.params.page;
  if (!data[page]) data[page] = {};
  Object.assign(data[page], req.body);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true, data: data[page] });
});

// Quote form submission
app.post('/api/quote', (req, res) => {
  const quotesFile = path.join(__dirname, 'quotes.json');
  let quotes = [];
  if (fs.existsSync(quotesFile)) {
    quotes = JSON.parse(fs.readFileSync(quotesFile, 'utf-8'));
  }
  quotes.push({ ...req.body, timestamp: new Date().toISOString() });
  fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2));
  res.json({ success: true, message: 'Quote request received!' });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const contactFile = path.join(__dirname, 'contacts.json');
  let contacts = [];
  if (fs.existsSync(contactFile)) {
    contacts = JSON.parse(fs.readFileSync(contactFile, 'utf-8'));
  }
  contacts.push({ ...req.body, timestamp: new Date().toISOString() });
  fs.writeFileSync(contactFile, JSON.stringify(contacts, null, 2));
  res.json({ success: true, message: 'Message received!' });
});

// Newsletter signup
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

// SPA fallback - serve index.html for all non-API, non-static routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Shiny Rhino running at http://localhost:${PORT}`);
});
