// ============================================
// SHINY RHINO - SPA Router & Page Renderers
// ============================================

let CMS = {};
let cmsEditMode = false;

// Fetch CMS data on load
async function loadCMS() {
  try {
    const res = await fetch('/api/content');
    CMS = await res.json();
  } catch (e) {
    console.error('Failed to load CMS data:', e);
  }
}

// Save CMS field
async function saveCMS(page, data) {
  await fetch(`/api/content/${page}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// ---- SPA Router ----
const routes = {
  '/': renderHome,
  '/quote': renderQuote,
  '/services/carpet': () => renderService('carpet'),
  '/services/upholstery': () => renderService('upholstery'),
  '/services/tile': () => renderService('tile'),
  '/services/hardwood': () => renderService('hardwood'),
  '/services/rug': () => renderService('rug'),
  '/services/stone': () => renderService('stone'),
  '/services/water': () => renderService('water'),
  '/services/vehicle': () => renderService('vehicle'),
  '/products': renderProducts,
  '/about': renderAbout,
  '/blog': renderBlog,
  '/faq': renderFAQ,
  '/locations': renderLocations,
  '/contact': renderContact,
  '/admin': renderAdmin,
};

function navigate(path) {
  history.pushState(null, '', path);
  route();
}

function route() {
  const path = window.location.pathname;
  const app = document.getElementById('app');
  const renderer = routes[path];
  if (renderer) {
    renderer();
  } else {
    app.innerHTML = `
      <div class="page-content"><div class="container" style="text-align:center;padding:120px 20px;">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/" class="btn btn-primary" data-link style="margin-top:20px;">Go Home</a>
      </div></div>`;
  }
  window.scrollTo(0, 0);
  bindLinks();
  initInteractions();
}

function bindLinks() {
  document.querySelectorAll('[data-link]').forEach(link => {
    link.removeEventListener('click', handleLink);
    link.addEventListener('click', handleLink);
  });
}

function handleLink(e) {
  e.preventDefault();
  const href = this.getAttribute('href');
  if (href) navigate(href);
}

window.addEventListener('popstate', route);

// ---- Shared Components ----
function breadcrumb(items) {
  return `<div class="breadcrumb"><div class="container">${items.map((item, i) =>
    i < items.length - 1
      ? `<a href="${item.href}" data-link>${item.label}</a><span>/</span>`
      : `${item.label}`
  ).join('')}</div></div>`;
}

function e(field, tag = 'span') {
  if (!cmsEditMode) return '';
  return ` contenteditable="true" data-cms-field="${field}"`;
}

function serviceQuoteBox(data) {
  return `
    <div class="service-hero-quote">
      <h3>${data.quoteTitle}</h3>
      <p>${data.quoteSubtitle}</p>
      <form onsubmit="handleZipQuote(event)">
        <input type="text" placeholder="Zip Code" required>
        <button type="submit" class="btn btn-primary btn-full">Get Quote</button>
      </form>
    </div>`;
}

function renderFAQBlock(questions) {
  return `<div class="faq-list">${questions.map(q => `
    <div class="faq-item">
      <button class="faq-question">${q.q}</button>
      <div class="faq-answer"><p>${q.a}</p></div>
    </div>`).join('')}</div>`;
}

// ---- Page Renderers ----

function renderHome() {
  const d = CMS.home || {};
  const hero = d.hero || {};
  const services = CMS.services || {};
  const trust = d.trust || {};
  const stats = d.stats || [];
  const blog = d.blog || {};

  const serviceList = [
    { key: 'carpet', icon: '🧹', color: '' },
    { key: 'upholstery', icon: '🛋️', color: '' },
    { key: 'tile', icon: '🔲', color: '' },
    { key: 'hardwood', icon: '🪵', color: '' },
    { key: 'rug', icon: '🟫', color: '' },
    { key: 'stone', icon: '🪨', color: '' },
    { key: 'vehicle', icon: '🚗', color: '' },
    { key: 'water', icon: '💧', color: '' },
  ];

  document.getElementById('app').innerHTML = `
    <!-- Hero -->
    <section class="hero hero--gradient">
      <div class="container hero-content hero-content--center">
        <h1>${hero.title || ''}</h1>
        <p class="hero-sub">${hero.subtitle || ''}</p>
        <div class="hero-buttons">
          <a href="/quote" class="btn btn-primary btn-lg" data-link>${hero.ctaPrimary || 'Get a Quote'}</a>
          <a href="tel:1-800-555-7446" class="btn btn-outline btn-lg">${hero.ctaSecondary || 'Call Us'}</a>
        </div>
      </div>
    </section>

    <!-- Quote Calculator -->
    <section class="quote-calculator">
      <div class="container quote-calc-inner">
        <h2>${(d.quoteCalc || {}).title || 'Get Your Instant Quote'}</h2>
        <div class="quote-tabs">
          <button class="quote-tab active">${(d.quoteCalc || {}).tabHome || 'For Home'}</button>
          <button class="quote-tab">${(d.quoteCalc || {}).tabBusiness || 'For Business'}</button>
        </div>
        <form class="zip-quote-form" onsubmit="handleZipQuote(event)">
          <input type="text" placeholder="Enter ZIP Code for cleaning services" required>
          <button type="submit" class="btn btn-primary">Get Quote</button>
        </form>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services-section">
      <div class="container">
        <h2 class="section-title">${d.servicesTitle || 'More Than Just Carpet Cleaning'}</h2>
        <p class="section-subtitle">${d.servicesSubtitle || ''}</p>
        <div class="services-grid">
          ${serviceList.map((s, i) => {
            const svc = services[s.key] || {};
            return `
            <a href="/services/${s.key}" class="service-tile" data-link>
              <div class="service-tile-bg"></div>
              <div class="service-tile-content">
                <div class="service-tile-icon">${s.icon}</div>
                <h3>${svc.title || s.key}</h3>
              </div>
            </a>`;
          }).join('')}
        </div>
        <div class="browse-all">
          <a href="/services/carpet" class="btn btn-outline-dark" data-link>Browse All Services</a>
        </div>
      </div>
    </section>

    <!-- Trust Section -->
    <section class="trust-section">
      <div class="container">
        <h2 class="section-title">${trust.title || ''}</h2>
        <div class="trust-layout">
          <div class="trust-image">
            <img src="/logo.jpg" alt="Shiny Rhino" style="max-height:300px;object-fit:contain;">
          </div>
          <div class="trust-details">
            <p style="margin-bottom:24px;color:var(--text-light);line-height:1.7;">${trust.description || ''}</p>
            ${(trust.items || []).map(item => `
              <div class="trust-item">
                <div class="trust-icon">${item.icon === 'star' ? '★' : item.icon === 'badge' ? '✓' : item.icon === 'check' ? '⚙' : '🛡'}</div>
                <div>
                  <h3>${item.title}</h3>
                  <p>${item.description}</p>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <section class="trust-stats">
      <div class="container">
        <div class="stats-grid">
          ${stats.map(s => `
            <div>
              <div class="stat-number">${s.number}</div>
              <div class="stat-label">${s.label}</div>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- Schedule CTA -->
    <section class="schedule-cta">
      <div class="container schedule-inner">
        <div class="schedule-text">
          <h2>Book Online in Minutes</h2>
          <p>Skip the phone call. Schedule your cleaning service online in just a few clicks. Pick your date, choose your service, and we'll handle the rest.</p>
        </div>
        <a href="/quote" class="btn btn-primary btn-lg" data-link>Book Online Today</a>
      </div>
    </section>

    <!-- FAQ Preview -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <div class="faq-list" style="max-width:800px;margin:40px auto 0;">
          ${(((CMS.faq || {}).categories || [])[0] || { questions: [] }).questions.slice(0, 4).map(q => `
            <div class="faq-item">
              <button class="faq-question">${q.q}</button>
              <div class="faq-answer"><p>${q.a}</p></div>
            </div>`).join('')}
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="/faq" class="btn btn-outline-dark" data-link>View All FAQs</a>
        </div>
      </div>
    </section>

    <!-- Blog Preview -->
    <section class="blog-section">
      <div class="container">
        <h2 class="section-title">${blog.title || 'The Dirt on Clean'}</h2>
        <p class="section-subtitle">${blog.subtitle || ''}</p>
        <div class="blog-grid">
          ${(blog.posts || []).map(post => `
            <div class="blog-card">
              <div class="blog-card-image"><span>📰</span></div>
              <div class="blog-card-body">
                <div class="blog-card-category">${post.category || ''}</div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="/blog" class="blog-card-link" data-link>Read More →</a>
              </div>
            </div>`).join('')}
        </div>
        <div style="text-align:center;margin-top:32px;">
          <a href="/blog" class="btn btn-outline-dark" data-link>Explore More Topics</a>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter">
      <div class="container newsletter-inner">
        <div>
          <h2>Sign Up for Deals on Future Cleanings!</h2>
          <p>Join our mailing list and receive exclusive discounts right to your inbox.</p>
        </div>
        <form class="newsletter-form" onsubmit="handleNewsletter(event)">
          <input type="email" placeholder="Email Address" required>
          <button type="submit" class="btn btn-dark">Subscribe</button>
        </form>
      </div>
    </section>
  `;
}

function renderQuote() {
  const params = new URLSearchParams(window.location.search);
  const isCommercial = params.get('type') === 'commercial';

  document.getElementById('app').innerHTML = `
    <div class="quote-page">
      <div class="quote-page-hero">
        <a href="/" data-link style="color:var(--primary-light);font-size:0.9rem;">← Back</a>
        <h1>Build Your Quote</h1>
        <p>Please enter your ZIP code to get started with your instant quote.</p>
      </div>
      <div class="quote-steps">
        <!-- Step 1: ZIP -->
        <div class="quote-step" id="quoteStep1">
          <h2><span class="quote-step-num">1</span> Enter Your ZIP Code</h2>
          <input type="text" id="quoteZip" placeholder="ZIP Code" maxlength="5">
          <button class="btn btn-primary btn-full" onclick="quoteNext(2)">Continue</button>
          <p style="margin-top:12px;font-size:0.85rem;opacity:0.6;">Already have an account? <a href="#" style="color:var(--primary-light);">Sign in</a></p>
        </div>

        <!-- Step 2: Service Selection (hidden) -->
        <div class="quote-step" id="quoteStep2" style="display:none;">
          <h2><span class="quote-step-num">2</span> Select Your Service</h2>
          <div class="quote-tabs" style="margin-bottom:20px;">
            <button class="quote-tab ${!isCommercial ? 'active' : ''}" onclick="this.classList.add('active');this.nextElementSibling.classList.remove('active');">For Home</button>
            <button class="quote-tab ${isCommercial ? 'active' : ''}" onclick="this.classList.add('active');this.previousElementSibling.classList.remove('active');">For Business</button>
          </div>
          <div class="quote-services-grid">
            ${['Carpet Cleaning', 'Upholstery Cleaning', 'Tile & Grout', 'Hardwood Floors', 'Area Rug Cleaning', 'Natural Stone', 'Car/Boat/RV', 'Water Damage'].map(s => `
              <div class="quote-service-option" onclick="selectQuoteService(this, '${s}')">
                <span>${s.includes('Carpet') ? '🧹' : s.includes('Upholstery') ? '🛋️' : s.includes('Tile') ? '🔲' : s.includes('Hardwood') ? '🪵' : s.includes('Rug') ? '🟫' : s.includes('Stone') ? '🪨' : s.includes('Car') ? '🚗' : '💧'}</span>
                <strong>${s}</strong>
              </div>`).join('')}
          </div>
          <button class="btn btn-primary btn-full" onclick="quoteNext(3)">Continue</button>
        </div>

        <!-- Step 3: Details (hidden) -->
        <div class="quote-step" id="quoteStep3" style="display:none;">
          <h2><span class="quote-step-num">3</span> How Many Rooms?</h2>
          <div class="quote-rooms-grid">
            ${['1', '2', '3', '4', '5', '6+'].map(n => `
              <div class="quote-room-option" onclick="selectQuoteRoom(this, '${n}')">${n} ${n === '1' ? 'Room' : 'Rooms'}</div>`).join('')}
          </div>
          <h2 style="margin-top:24px;"><span class="quote-step-num">+</span> Add-Ons</h2>
          <div class="quote-services-grid">
            <div class="quote-service-option" onclick="toggleAddon(this, 'Carpet Protector')"><strong>Carpet Protector</strong></div>
            <div class="quote-service-option" onclick="toggleAddon(this, 'Deodorizer')"><strong>Deodorizer</strong></div>
            <div class="quote-service-option" onclick="toggleAddon(this, 'Pet Treatment')"><strong>Pet Treatment</strong></div>
            <div class="quote-service-option" onclick="toggleAddon(this, 'Stain Removal')"><strong>Stain Removal</strong></div>
          </div>
          <button class="btn btn-primary btn-full" onclick="quoteNext(4)">Continue</button>
        </div>

        <!-- Step 4: Contact Info (hidden) -->
        <div class="quote-step" id="quoteStep4" style="display:none;">
          <h2><span class="quote-step-num">4</span> Your Information</h2>
          <div class="form-row">
            <input type="text" id="quoteName" placeholder="Full Name" required>
            <input type="email" id="quoteEmail" placeholder="Email Address" required>
          </div>
          <div class="form-row">
            <input type="tel" id="quotePhone" placeholder="Phone Number" required>
          </div>
          <h2 style="margin-top:24px;"><span class="quote-step-num">📅</span> Preferred Date & Time</h2>
          <div class="form-row">
            <input type="date" id="quoteDate">
            <select id="quoteTime">
              <option value="">Select Time</option>
              <option>Morning (8am-12pm)</option>
              <option>Afternoon (12pm-4pm)</option>
              <option>Evening (4pm-8pm)</option>
            </select>
          </div>
          <button class="btn btn-primary btn-full" onclick="submitQuote()">Get My Free Quote</button>
        </div>

        <!-- Summary (hidden) -->
        <div id="quoteSummary" style="display:none;">
          <div class="quote-summary">
            <h3>Your Quote Summary</h3>
            <div id="quoteSummaryLines"></div>
            <div class="quote-summary-total">
              <span>Estimated Total</span>
              <span id="quoteTotalPrice">--</span>
            </div>
          </div>
          <p class="quote-note">This is an estimate. Final pricing may vary based on condition and square footage. A Shiny Rhino representative will contact you to confirm.</p>
          <div style="text-align:center;margin-top:24px;">
            <a href="/" class="btn btn-outline" data-link>Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Quote logic
let quoteState = { service: '', rooms: '', addons: [] };

function selectQuoteService(el, service) {
  el.parentElement.querySelectorAll('.quote-service-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  quoteState.service = service;
}

function selectQuoteRoom(el, rooms) {
  el.parentElement.querySelectorAll('.quote-room-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  quoteState.rooms = rooms;
}

function toggleAddon(el, addon) {
  el.classList.toggle('selected');
  if (quoteState.addons.includes(addon)) {
    quoteState.addons = quoteState.addons.filter(a => a !== addon);
  } else {
    quoteState.addons.push(addon);
  }
}

function quoteNext(step) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`quoteStep${i}`);
    if (el) el.style.display = i <= step ? 'block' : 'none';
  }
  const stepEl = document.getElementById(`quoteStep${step}`);
  if (stepEl) stepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function submitQuote() {
  const data = {
    zip: document.getElementById('quoteZip')?.value,
    service: quoteState.service,
    rooms: quoteState.rooms,
    addons: quoteState.addons,
    name: document.getElementById('quoteName')?.value,
    email: document.getElementById('quoteEmail')?.value,
    phone: document.getElementById('quotePhone')?.value,
    date: document.getElementById('quoteDate')?.value,
    time: document.getElementById('quoteTime')?.value,
  };

  try {
    await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (e) { /* ignore */ }

  // Show summary
  const basePrices = { 'Carpet Cleaning': 89, 'Upholstery Cleaning': 129, 'Tile & Grout': 149, 'Hardwood Floors': 119, 'Area Rug Cleaning': 99, 'Natural Stone': 159, 'Car/Boat/RV': 99, 'Water Damage': 299 };
  const roomMultiplier = { '1': 1, '2': 1.7, '3': 2.3, '4': 2.9, '5': 3.4, '6+': 4 };
  const addonPrices = { 'Carpet Protector': 49, 'Deodorizer': 29, 'Pet Treatment': 39, 'Stain Removal': 49 };

  const base = basePrices[data.service] || 99;
  const mult = roomMultiplier[data.rooms] || 1;
  const serviceTotal = Math.round(base * mult);
  let addonsTotal = 0;

  let lines = `<div class="quote-summary-line"><span>${data.service} (${data.rooms || '1'} room${data.rooms === '1' ? '' : 's'})</span><span>$${serviceTotal}</span></div>`;
  data.addons.forEach(a => {
    const price = addonPrices[a] || 29;
    addonsTotal += price;
    lines += `<div class="quote-summary-line"><span>${a}</span><span>$${price}</span></div>`;
  });

  document.getElementById('quoteSummaryLines').innerHTML = lines;
  document.getElementById('quoteTotalPrice').textContent = `$${serviceTotal + addonsTotal}`;

  // Hide steps, show summary
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`quoteStep${i}`);
    if (el) el.style.display = 'none';
  }
  document.getElementById('quoteSummary').style.display = 'block';
  document.getElementById('quoteSummary').scrollIntoView({ behavior: 'smooth' });
}

function handleZipQuote(e) {
  e.preventDefault();
  const zip = e.target.querySelector('input').value;
  navigate(`/quote`);
  setTimeout(() => {
    const zipInput = document.getElementById('quoteZip');
    if (zipInput) zipInput.value = zip;
  }, 100);
}

// ---- Service Page ----
function renderService(key) {
  const svc = (CMS.services || {})[key];
  if (!svc) { document.getElementById('app').innerHTML = '<div class="page-content"><div class="container"><h1>Service Not Found</h1></div></div>'; return; }

  document.getElementById('app').innerHTML = `
    ${breadcrumb([{ label: 'Home', href: '/' }, { label: 'Services', href: '/services/carpet' }, { label: svc.title }])}

    <!-- Service Hero -->
    <section class="service-hero">
      <div class="service-hero-bg"></div>
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="service-hero-content">
          <div class="service-hero-text">
            <h1>${svc.title}</h1>
            <p>${svc.heroText}</p>
          </div>
          ${serviceQuoteBox(svc)}
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="service-content">
      <div class="container container--narrow">
        <h2>${svc.title}</h2>
        <p>${svc.content}</p>

        ${svc.stoneTypes ? `
          <div style="display:flex;flex-wrap:wrap;gap:12px;margin:24px 0;">
            ${svc.stoneTypes.map(t => `<span style="padding:8px 20px;background:var(--primary-lightest);border-radius:50px;font-weight:600;color:var(--primary-dark);font-size:0.9rem;">${t}</span>`).join('')}
          </div>` : ''}

        <div class="service-features">
          ${(svc.features || []).map(f => `
            <div class="service-feature">
              <div class="service-feature-icon">✓</div>
              <div>
                <h3>${f.title}</h3>
                <p>${f.description}</p>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </section>

    <!-- Process -->
    ${svc.process ? `
    <section class="process-section">
      <div class="container">
        <h2 class="section-title">${svc.process.title}</h2>
        <div class="process-steps">
          ${svc.process.steps.map((step, i) => `
            <div class="process-step">
              <div class="process-step-num">${i + 1}</div>
              <h3>${step.title}</h3>
              <p>${step.description}</p>
            </div>`).join('')}
        </div>
      </div>
    </section>` : ''}

    <!-- Commercial -->
    ${svc.commercial ? `
    <section class="commercial-section">
      <div class="container">
        <div class="commercial-inner">
          <div>
            <h2>${svc.commercial.title}</h2>
            <p>${svc.commercial.description}</p>
            <a href="/quote?type=commercial" class="btn btn-primary" data-link>Get Commercial Quote</a>
          </div>
          <div class="commercial-image"><span>🏢</span></div>
        </div>
      </div>
    </section>` : ''}

    <!-- FAQ -->
    ${svc.faq && svc.faq.length ? `
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        ${renderFAQBlock(svc.faq)}
      </div>
    </section>` : ''}

    <!-- CTA -->
    <section class="schedule-cta">
      <div class="container schedule-inner">
        <div class="schedule-text">
          <h2>Now That Your ${svc.title.split(' ')[0]} is Cleaner Than Ever</h2>
          <p>Trust the pros who clean it right. Find your local Shiny Rhino today.</p>
        </div>
        <a href="/quote" class="btn btn-primary btn-lg" data-link>Get Your Free Quote</a>
      </div>
    </section>
  `;
}

// ---- Products Page ----
function renderProducts() {
  const d = CMS.products || {};
  document.getElementById('app').innerHTML = `
    ${breadcrumb([{ label: 'Home', href: '/' }, { label: 'Products' }])}
    <section class="page-content">
      <div class="container">
        <h1>${d.title || 'Cleaning Products'}</h1>
        <div class="products-layout">
          <div class="products-grid" style="grid-template-columns:repeat(2,1fr);">
            ${(d.items || []).map((item, i) => `
              <div class="product-card">
                <div class="product-image"><span>🧴</span></div>
                <div class="product-body">
                  <h3>${item.name}</h3>
                  <p>${item.description}</p>
                  <div class="product-price">${item.price}</div>
                  <div class="product-cart">
                    <button class="btn btn-sm btn-secondary" onclick="alert('Added to cart!')">Add to Cart</button>
                  </div>
                </div>
              </div>`).join('')}
          </div>
          <div class="order-summary">
            <h3>Order Summary</h3>
            <div class="order-summary-empty">Your cart is empty</div>
            <div class="order-total">
              <span>Total</span>
              <span>$0.00</span>
            </div>
            <button class="btn btn-primary btn-full btn-sm" style="margin-top:16px;" disabled>Checkout</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

// ---- About Page ----
function renderAbout() {
  const d = CMS.about || {};
  document.getElementById('app').innerHTML = `
    ${breadcrumb([{ label: 'Home', href: '/' }, { label: 'About' }])}
    <section class="hero hero--gradient" style="min-height:300px;">
      <div class="container hero-content hero-content--center" style="padding:60px 20px;">
        <h1>${d.title || 'Our Story'}</h1>
        <p class="hero-sub">${d.heroText || ''}</p>
      </div>
    </section>
    <section class="about-content">
      <div class="container">
        <div style="max-width:800px;margin:0 auto 40px;">
          <p style="font-size:1.1rem;line-height:1.8;color:var(--text-light);">${d.content || ''}</p>
        </div>
        ${(d.sections || []).map((sec, i) => `
          <div class="about-grid" id="${sec.title.includes('Technician') ? 'technicians' : sec.title.includes('Eco') ? 'eco' : ''}">
            <div class="about-image"><span>${i === 0 ? '🎯' : i === 1 ? '👨‍🔧' : i === 2 ? '🇺🇸' : '🌿'}</span></div>
            <div class="about-text">
              <h2>${sec.title}</h2>
              <p>${sec.text}</p>
              <a href="/quote" class="btn btn-sm btn-secondary" data-link>Schedule a Cleaning</a>
            </div>
          </div>`).join('')}
      </div>
    </section>
    <section class="schedule-cta">
      <div class="container schedule-inner">
        <div class="schedule-text">
          <h2>Ready to Experience the Shiny Rhino Difference?</h2>
          <p>Book your cleaning today and see why thousands trust us with their homes and businesses.</p>
        </div>
        <a href="/quote" class="btn btn-primary btn-lg" data-link>Get a Quote</a>
      </div>
    </section>
  `;
}

// ---- Blog Page ----
function renderBlog() {
  const d = CMS.blog || {};
  document.getElementById('app').innerHTML = `
    ${breadcrumb([{ label: 'Home', href: '/' }, { label: 'Blog' }])}
    <section class="hero hero--gradient" style="min-height:280px;">
      <div class="container hero-content hero-content--center" style="padding:60px 20px;">
        <h1>${d.title || 'Blog'}</h1>
        <p class="hero-sub">${d.subtitle || ''}</p>
      </div>
    </section>
    <section class="blog-section" style="padding-top:40px;">
      <div class="container">
        ${(d.categories || []).map(cat => `
          <h2 style="font-size:1.4rem;color:var(--dark);margin-bottom:8px;margin-top:40px;">${cat.name}</h2>
          <div class="blog-grid" style="margin-top:16px;">
            ${cat.posts.map(post => `
              <div class="blog-card">
                <div class="blog-card-image"><span>📰</span></div>
                <div class="blog-card-body">
                  <div class="blog-card-category">${cat.name}</div>
                  <h3>${post.title}</h3>
                  <p>${post.excerpt}</p>
                  <span style="font-size:0.8rem;color:var(--text-muted);">${post.date || ''}</span>
                </div>
              </div>`).join('')}
          </div>`).join('')}
      </div>
    </section>
  `;
}

// ---- FAQ Page ----
function renderFAQ() {
  const d = CMS.faq || {};
  const categories = d.categories || [];

  document.getElementById('app').innerHTML = `
    ${breadcrumb([{ label: 'Home', href: '/' }, { label: 'FAQ' }])}
    <section class="page-content" style="background:var(--gray-light);padding-bottom:0;">
      <div class="container">
        <h1 style="text-align:center;">${d.title || 'Frequently Asked Questions'}</h1>
        <div class="faq-filters" style="margin-top:24px;">
          <button class="faq-filter active" onclick="filterFAQ(this, 'all')">All</button>
          ${categories.map(c => `<button class="faq-filter" onclick="filterFAQ(this, '${c.name}')">${c.name}</button>`).join('')}
        </div>
      </div>
    </section>
    <section class="faq-section" style="padding-top:32px;">
      <div class="container">
        ${categories.map(cat => `
          <div class="faq-category" data-faq-cat="${cat.name}">
            <h2 style="font-size:1.3rem;color:var(--dark);margin:32px 0 16px;">${cat.name}</h2>
            ${renderFAQBlock(cat.questions)}
          </div>`).join('')}
      </div>
    </section>
  `;
}

function filterFAQ(btn, cat) {
  document.querySelectorAll('.faq-filter').forEach(f => f.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.faq-category').forEach(el => {
    el.style.display = (cat === 'all' || el.dataset.faqCat === cat) ? 'block' : 'none';
  });
}

// ---- Locations Page ----
function renderLocations() {
  const d = CMS.locations || {};
  document.getElementById('app').innerHTML = `
    <section class="locations-hero">
      <div class="container">
        <h1>${d.title || 'Find Your Shiny Rhino'}</h1>
        <p>${d.subtitle || ''}</p>
        <form class="locations-search" onsubmit="handleLocationSearch(event)">
          <input type="text" placeholder="ZIP Code" maxlength="5" required>
          <button type="submit" class="btn btn-primary">Find</button>
        </form>
        <div id="locationResult" style="margin-top:32px;"></div>
      </div>
    </section>
    <section class="page-content">
      <div class="container" style="text-align:center;">
        <h2>Serving Communities Nationwide</h2>
        <p style="max-width:600px;margin:0 auto;">Shiny Rhino has locations across the country, ready to serve your home or business. Enter your zip code above or call <strong>1-800-555-RHINO</strong> to find your nearest location.</p>
      </div>
    </section>
  `;
}

function handleLocationSearch(e) {
  e.preventDefault();
  const zip = e.target.querySelector('input').value;
  document.getElementById('locationResult').innerHTML = `
    <div style="background:rgba(255,255,255,0.1);border-radius:8px;padding:24px;max-width:500px;margin:0 auto;">
      <h3 style="margin-bottom:8px;">Shiny Rhino - ${zip} Area</h3>
      <p style="opacity:0.8;">Your local team is ready to serve you!</p>
      <a href="/quote" class="btn btn-primary btn-sm" data-link style="margin-top:12px;">Schedule Now</a>
    </div>`;
  bindLinks();
}

// ---- Contact Page ----
function renderContact() {
  const d = CMS.contact || {};
  document.getElementById('app').innerHTML = `
    ${breadcrumb([{ label: 'Home', href: '/' }, { label: 'Contact Us' }])}
    <section class="contact-section">
      <div class="container">
        <h1 class="section-title">${d.title || 'Contact Us'}</h1>
        <p class="section-subtitle">${d.subtitle || ''}</p>
        <div class="contact-grid">
          <form class="contact-form" onsubmit="handleContact(event)">
            <label>Name</label>
            <input type="text" required>
            <label>Email</label>
            <input type="email" required>
            <label>Phone</label>
            <input type="tel">
            <label>Subject</label>
            <select>
              <option>General Inquiry</option>
              <option>Schedule a Cleaning</option>
              <option>Billing Question</option>
              <option>Feedback</option>
              <option>Career Opportunities</option>
              <option>Franchising</option>
            </select>
            <label>Message</label>
            <textarea placeholder="How can we help?" required></textarea>
            <button type="submit" class="btn btn-primary">Send Message</button>
          </form>
          <div>
            <div class="contact-info-card">
              <h3>Get in Touch</h3>
              <div class="contact-info-item">
                <div class="contact-info-icon">📞</div>
                <div><h4>Phone</h4><p>${(d.info || {}).phone || '1-800-555-RHINO'}</p></div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon">✉️</div>
                <div><h4>Email</h4><p>${(d.info || {}).email || 'info@shinyrhino.com'}</p></div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon">🕐</div>
                <div><h4>Hours</h4><p>${(d.info || {}).hours || 'Mon-Fri: 7am-8pm'}</p></div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon">📍</div>
                <div><h4>Emergency?</h4><p>For water damage emergencies, call us 24/7.</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

async function handleContact(e) {
  e.preventDefault();
  const form = e.target;
  const inputs = form.querySelectorAll('input, select, textarea');
  const data = {
    name: inputs[0].value,
    email: inputs[1].value,
    phone: inputs[2].value,
    subject: inputs[3].value,
    message: inputs[4].value,
  };
  await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  form.innerHTML = '<div style="text-align:center;padding:40px;"><h3 style="color:var(--green);">Message Sent!</h3><p>We\'ll get back to you within 24 hours.</p></div>';
}

async function handleNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: input.value })
  });
  input.value = '';
  alert('Thanks for subscribing!');
}

// ---- CMS Admin Page ----
function renderAdmin() {
  document.getElementById('app').innerHTML = `
    <section class="page-content">
      <div class="container">
        <h1>Content Management</h1>
        <p style="margin-bottom:24px;">Edit your website content below. Changes save automatically.</p>
        <div id="cmsEditor"></div>
      </div>
    </section>
  `;
  buildCMSEditor();
}

function buildCMSEditor() {
  const editor = document.getElementById('cmsEditor');
  const pages = Object.keys(CMS);

  let html = '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px;">';
  pages.forEach(page => {
    html += `<button class="btn btn-sm btn-outline-dark cms-page-btn" onclick="showCMSPage('${page}')" data-cms-page="${page}">${page.charAt(0).toUpperCase() + page.slice(1)}</button>`;
  });
  html += '</div><div id="cmsPageEditor"></div>';
  editor.innerHTML = html;

  // Show first page
  if (pages.length > 0) showCMSPage(pages[0]);
}

function showCMSPage(page) {
  document.querySelectorAll('.cms-page-btn').forEach(b => {
    b.classList.toggle('btn-secondary', b.dataset.cmsPage === page);
    b.classList.toggle('btn-outline-dark', b.dataset.cmsPage !== page);
  });
  const container = document.getElementById('cmsPageEditor');
  const data = CMS[page];
  container.innerHTML = renderCMSFields(data, page, page);
}

function renderCMSFields(obj, path, rootPage) {
  if (!obj || typeof obj !== 'object') return '';
  let html = '';

  if (Array.isArray(obj)) {
    obj.forEach((item, i) => {
      const itemPath = `${path}[${i}]`;
      html += `<div style="border-left:3px solid var(--primary-light);padding-left:16px;margin:12px 0;">`;
      html += `<div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">Item ${i + 1}</div>`;
      if (typeof item === 'object') {
        html += renderCMSFields(item, itemPath, rootPage);
      } else {
        html += `<input type="text" value="${String(item).replace(/"/g, '&quot;')}" onchange="updateCMSField('${rootPage}', '${path}', ${i}, this.value)" style="width:100%;padding:8px 12px;border:1px solid var(--gray);border-radius:4px;margin-bottom:4px;">`;
      }
      html += '</div>';
    });
    return html;
  }

  Object.entries(obj).forEach(([key, value]) => {
    const fieldPath = `${path}.${key}`;
    if (typeof value === 'string') {
      const isLong = value.length > 100;
      html += `<div style="margin-bottom:16px;">
        <label style="display:block;font-weight:600;font-size:0.85rem;color:var(--dark);margin-bottom:4px;">${key}</label>
        ${isLong
          ? `<textarea style="width:100%;padding:10px 12px;border:2px solid var(--gray);border-radius:6px;min-height:80px;font-family:inherit;" onchange="updateCMSField('${rootPage}', '${fieldPath}', null, this.value)">${value}</textarea>`
          : `<input type="text" value="${value.replace(/"/g, '&quot;')}" style="width:100%;padding:10px 12px;border:2px solid var(--gray);border-radius:6px;" onchange="updateCMSField('${rootPage}', '${fieldPath}', null, this.value)">`
        }
      </div>`;
    } else if (typeof value === 'object' && value !== null) {
      html += `<details style="margin-bottom:12px;border:1px solid var(--gray);border-radius:6px;padding:12px;" ${path === rootPage ? 'open' : ''}>
        <summary style="cursor:pointer;font-weight:700;font-size:0.95rem;color:var(--primary-dark);">${key}</summary>
        <div style="margin-top:12px;">${renderCMSFields(value, fieldPath, rootPage)}</div>
      </details>`;
    }
  });

  return html;
}

function updateCMSField(rootPage, path, index, value) {
  // Navigate to the nested field and update it
  const parts = path.replace(rootPage + '.', '').split(/\.|\[|\]/).filter(Boolean);
  let obj = CMS[rootPage];
  for (let i = 0; i < parts.length - 1; i++) {
    obj = obj[parts[i]];
  }
  const lastKey = index !== null ? index : parts[parts.length - 1];
  obj[lastKey] = value;

  // Save to server
  saveCMS(rootPage, CMS[rootPage]);
}

// ---- Interactions ----
function initInteractions() {
  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const wasActive = item.classList.contains('active');
      item.closest('.faq-list')?.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // Quote tabs
  document.querySelectorAll('.quote-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const siblings = tab.parentElement.querySelectorAll('.quote-tab');
      siblings.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

// ---- Mobile Nav ----
document.getElementById('mobileToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('active');
});

// Mobile dropdown toggle
document.querySelectorAll('.has-dropdown > a').forEach(link => {
  link.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      link.parentElement.classList.toggle('open');
    }
  });
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a[data-link]').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('active');
  });
});

// Footer newsletter
document.getElementById('footerNewsletter')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const input = e.target.querySelector('input');
  await fetch('/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: input.value })
  });
  input.value = '';
  alert('Thanks for subscribing!');
});

// Sticky navbar shadow
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 2px 20px rgba(0,0,0,0.1)'
    : '0 2px 10px rgba(0,0,0,0.06)';
});

// ---- Init ----
(async () => {
  await loadCMS();
  route();
  bindLinks();
})();
