// ============================================
// SHINY RHINO - SPA Router & Page Renderers
// ============================================

let CMS = {};
let cmsEditMode = false;

// SVG Icons (no emojis)
const ICONS = {
  carpet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
  upholstery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16V8a4 4 0 014-4h8a4 4 0 014 4v8"/><path d="M2 16h20v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2z"/><path d="M4 16V12a2 2 0 012-2h12a2 2 0 012 2v4"/></svg>',
  tile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>',
  hardwood: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="5" rx="1"/><rect x="2" y="10" width="20" height="5" rx="1"/><rect x="2" y="16" width="20" height="5" rx="1"/><line x1="10" y1="4" x2="10" y2="9"/><line x1="14" y1="10" x2="14" y2="15"/><line x1="8" y1="16" x2="8" y2="21"/></svg>',
  rug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 8h18M3 16h18"/><path d="M6 5v-2M10 5v-2M14 5v-2M18 5v-2M6 19v2M10 19v2M14 19v2M18 19v2"/></svg>',
  stone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  vehicle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h8l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/></svg>',
  water: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C12 2 5 10 5 14a7 7 0 0014 0c0-4-7-12-7-12z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 15l-3.5 2 .67-3.89L6 10.11l3.91-.57L12 6l2.09 3.54 3.91.57-2.83 2.76.67 3.89z"/><circle cx="12" cy="12" r="10"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4l-10 8L2 4"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22V12h6v10"/><rect x="8" y="6" width="3" height="2"/><rect x="13" y="6" width="3" height="2"/><rect x="8" y="10" width="3" height="2"/><rect x="13" y="10" width="3" height="2"/></svg>',
  article: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10M7 11h10M7 15h6"/></svg>',
  product: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
};

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

// ---- Product Slug Helper ----
function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---- Cart State ----
window._cart = window._cart || {};

function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('toast--visible');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('toast--visible'), 3000);
}

function addToCart(index) {
  const d = CMS.products || {};
  const item = (d.items || [])[index];
  if (!item) return;
  if (!window._cart[index]) window._cart[index] = { qty: 0 };
  window._cart[index].qty++;
  showToast(`${item.name} added to cart`);
  updateCartSidebar();
}

function removeFromCart(index) {
  if (window._cart[index]) {
    window._cart[index].qty--;
    if (window._cart[index].qty <= 0) delete window._cart[index];
  }
  updateCartSidebar();
}

function updateCartSidebar() {
  const d = CMS.products || {};
  const items = d.items || [];
  const summaryEl = document.getElementById('productCartLines');
  const totalEl = document.getElementById('productCartTotal');
  const checkoutBtn = document.getElementById('productCheckoutBtn');
  if (!summaryEl) return;

  let html = '';
  let total = 0;
  let hasItems = false;
  Object.entries(window._cart).forEach(([idx, s]) => {
    if (s.qty <= 0) return;
    const item = items[idx];
    if (!item) return;
    hasItems = true;
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    const lineTotal = price * s.qty;
    total += lineTotal;
    html += `<div class="cart-line">
      <span>${item.name} x${s.qty}</span>
      <span>
        <button class="cart-qty-btn" onclick="removeFromCart(${idx})">-</button>
        <button class="cart-qty-btn" onclick="addToCart(${idx})">+</button>
        $${lineTotal.toFixed(2)}
      </span>
    </div>`;
  });
  summaryEl.innerHTML = hasItems ? html : '<div class="order-summary-empty">Your cart is empty</div>';
  if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  if (checkoutBtn) checkoutBtn.disabled = !hasItems;
}

// ---- SPA Router ----
const routes = {
  '/': renderHome,
  '/quote': () => renderQuote(false),
  '/quote/commercial': () => renderQuote(true),
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
  '/sh-admin': renderAdmin,
};

function navigate(path) {
  history.pushState(null, '', path);
  route();
}

function route() {
  const path = window.location.pathname;
  const app = document.getElementById('app');

  // Check for product detail pages
  const productMatch = path.match(/^\/products\/(.+)$/);
  if (productMatch) {
    renderProductDetail(decodeURIComponent(productMatch[1]));
    window.scrollTo(0, 0);
    bindLinks();
    initInteractions();
    return;
  }

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
    { key: 'carpet', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop' },
    { key: 'upholstery', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop' },
    { key: 'tile', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop' },
    { key: 'hardwood', img: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?w=400&h=300&fit=crop' },
    { key: 'rug', img: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=300&fit=crop' },
    { key: 'stone', img: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop' },
    { key: 'vehicle', img: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=300&fit=crop' },
    { key: 'water', img: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop' },
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
        <div class="quote-type-cards">
          <a href="/quote" class="quote-type-card" data-link>
            <div class="quote-type-icon">${ICONS.home}</div>
            <div class="quote-type-text">
              <strong>Home Cleaning</strong>
              <span>Residential carpet, upholstery & floor cleaning</span>
            </div>
            <div class="quote-type-arrow">&rarr;</div>
          </a>
          <a href="/quote/commercial" class="quote-type-card quote-type-card--biz" data-link>
            <div class="quote-type-icon">${ICONS.briefcase}</div>
            <div class="quote-type-text">
              <strong>Business Cleaning</strong>
              <span>Commercial & office cleaning programs</span>
            </div>
            <div class="quote-type-arrow">&rarr;</div>
          </a>
        </div>
        <form class="zip-quote-form" onsubmit="handleZipQuote(event)">
          <input type="text" placeholder="Or enter your ZIP Code to get started" required>
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
              <img src="${s.img}" alt="${svc.title || s.key}" class="service-tile-img" loading="lazy">
              <div class="service-tile-overlay"></div>
              <div class="service-tile-content">
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
            <img src="/logo.png" alt="Shiny Rhino">
          </div>
          <div class="trust-details">
            <p style="margin-bottom:24px;color:var(--text-light);line-height:1.7;">${trust.description || ''}</p>
            ${(trust.items || []).map(item => `
              <div class="trust-item">
                <div class="trust-icon">${ICONS[item.icon] || ICONS.check}</div>
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
        <h2 class="section-title">${blog.title || 'Cleaning Tips & Insights'}</h2>
        <p class="section-subtitle">${blog.subtitle || ''}</p>
        <div class="blog-grid">
          ${(blog.posts || []).map(post => `
            <div class="blog-card">
              <div class="blog-card-image">${ICONS.article}</div>
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

function renderQuote(isCommercial) {
  const pricing = CMS.pricing || { categories: [], hiddenFee: { label: 'Service Fee', amount: 0 } };
  // calcState: { catIdx_itemIdx: { qty, addons: { addonIdx: bool } } }
  window._calcState = window._calcState || {};

  document.getElementById('app').innerHTML = `
    <div class="calc-page">
      <div class="calc-header ${isCommercial ? 'calc-header--biz' : ''}">
        <div class="calc-header-text">
          ${isCommercial
            ? `<h1>COMMERCIAL CLEANING SERVICES</h1><p>Custom pricing for offices, facilities & commercial spaces. Build your service package below.</p>`
            : `<h1>NO HASSLE PRICING & CLEANING</h1><p>Pick your items, see your price instantly. No surprises.</p>`
          }
        </div>
        ${isCommercial
          ? `<a href="/quote" data-link class="btn btn-sm btn-outline calc-switch-link">Switch to Home</a>`
          : `<a href="/quote/commercial" data-link class="btn btn-sm btn-outline calc-switch-link">Business Quote</a>`
        }
      </div>
      <div class="calc-layout">
        <div class="calc-main">
          ${pricing.categories.map((cat, ci) => `
            <div class="calc-category">
              <h2 class="calc-category-title">${cat.name}</h2>
              <div class="calc-items">
                ${cat.items.map((item, ii) => {
                  const key = ci + '_' + ii;
                  return `
                  <div class="calc-item" data-key="${key}">
                    <div class="calc-item-info">
                      <div class="calc-item-name">${item.name}</div>
                      <div class="calc-item-desc">${item.description}</div>
                      <div class="calc-item-price">$${item.price} / ${item.unit}</div>
                    </div>
                    <div class="calc-item-controls">
                      <button class="calc-qty-btn" onclick="calcChangeQty('${key}', -1)">-</button>
                      <span class="calc-qty" id="calcQty_${key}">0</span>
                      <button class="calc-qty-btn" onclick="calcChangeQty('${key}', 1)">+</button>
                    </div>
                    <div class="calc-item-addons" id="calcAddons_${key}" style="display:none;">
                      ${(item.addons || []).map((addon, ai) => `
                        <label class="calc-addon-label">
                          <input type="checkbox" onchange="calcToggleAddon('${key}', ${ai})" /> ${addon.name} (+$${addon.price})
                        </label>
                      `).join('')}
                    </div>
                  </div>`;
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="calc-sidebar">
          <div class="calc-sidebar-inner">
            <h3>Order Summary</h3>
            <div id="calcSummaryLines" class="calc-summary-lines">
              <div class="calc-summary-empty">Add items to see your quote</div>
            </div>
            <div class="calc-summary-total">
              <span>Total</span>
              <span id="calcTotal">$0</span>
            </div>
            <button class="btn btn-primary btn-full" onclick="calcSchedule()">Schedule Cleaning</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <div id="calcModal" class="calc-modal" style="display:none;">
      <div class="calc-modal-content">
        <button class="calc-modal-close" onclick="document.getElementById('calcModal').style.display='none'">&times;</button>
        <h2>Schedule Your Cleaning</h2>
        <p>Fill in your details and we'll confirm your appointment.</p>
        <form onsubmit="calcSubmit(event)">
          <div class="form-row">
            <input type="text" id="calcName" placeholder="Full Name" required>
            <input type="email" id="calcEmail" placeholder="Email Address" required>
          </div>
          <div class="form-row">
            <input type="tel" id="calcPhone" placeholder="Phone Number" required>
            <input type="text" id="calcZip" placeholder="ZIP Code" maxlength="5" required>
          </div>
          <div class="form-row">
            <input type="date" id="calcDate">
            <select id="calcTime">
              <option value="">Select Time</option>
              <option>Morning (8am-12pm)</option>
              <option>Afternoon (12pm-4pm)</option>
              <option>Evening (4pm-8pm)</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Submit Request</button>
        </form>
      </div>
    </div>
  `;
}

// Calculator logic
function calcGetPricing() {
  return CMS.pricing || { categories: [], hiddenFee: { label: 'Service Fee', amount: 0 } };
}

function calcChangeQty(key, delta) {
  const state = window._calcState;
  if (!state[key]) state[key] = { qty: 0, addons: {} };
  state[key].qty = Math.max(0, state[key].qty + delta);

  document.getElementById('calcQty_' + key).textContent = state[key].qty;
  const addonsEl = document.getElementById('calcAddons_' + key);
  if (addonsEl) addonsEl.style.display = state[key].qty > 0 ? 'flex' : 'none';
  if (state[key].qty === 0) {
    state[key].addons = {};
    addonsEl?.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
  }
  calcUpdateSummary();
}

function calcToggleAddon(key, addonIdx) {
  const state = window._calcState;
  if (!state[key]) return;
  state[key].addons[addonIdx] = !state[key].addons[addonIdx];
  calcUpdateSummary();
}

function calcUpdateSummary() {
  const pricing = calcGetPricing();
  const state = window._calcState;
  let lines = '';
  let total = 0;
  let hasItems = false;

  pricing.categories.forEach((cat, ci) => {
    cat.items.forEach((item, ii) => {
      const key = ci + '_' + ii;
      const s = state[key];
      if (!s || s.qty === 0) return;
      hasItems = true;
      const lineTotal = item.price * s.qty;
      total += lineTotal;
      lines += `<div class="calc-summary-line"><span>${item.name} x${s.qty}</span><span>$${lineTotal}</span></div>`;
      (item.addons || []).forEach((addon, ai) => {
        if (s.addons[ai]) {
          const addonTotal = addon.price * s.qty;
          total += addonTotal;
          lines += `<div class="calc-summary-line calc-summary-addon"><span>&nbsp;&nbsp;+ ${addon.name} x${s.qty}</span><span>$${addonTotal}</span></div>`;
        }
      });
    });
  });

  const fee = pricing.hiddenFee?.amount || 0;
  if (fee > 0) total += fee;

  document.getElementById('calcSummaryLines').innerHTML = hasItems ? lines : '<div class="calc-summary-empty">Add items to see your quote</div>';
  document.getElementById('calcTotal').textContent = '$' + total;
}

function calcSchedule() {
  const state = window._calcState;
  const hasItems = Object.values(state).some(s => s.qty > 0);
  if (!hasItems) { showToast('Please add at least one item first.'); return; }
  document.getElementById('calcModal').style.display = 'flex';
}

async function calcSubmit(e) {
  e.preventDefault();
  const pricing = calcGetPricing();
  const state = window._calcState;
  const items = [];
  pricing.categories.forEach((cat, ci) => {
    cat.items.forEach((item, ii) => {
      const key = ci + '_' + ii;
      const s = state[key];
      if (!s || s.qty === 0) return;
      const selectedAddons = (item.addons || []).filter((_, ai) => s.addons[ai]).map(a => a.name);
      items.push({ name: item.name, qty: s.qty, price: item.price, addons: selectedAddons });
    });
  });
  const data = {
    name: document.getElementById('calcName').value,
    email: document.getElementById('calcEmail').value,
    phone: document.getElementById('calcPhone').value,
    zip: document.getElementById('calcZip').value,
    date: document.getElementById('calcDate').value,
    time: document.getElementById('calcTime').value,
    items,
    total: document.getElementById('calcTotal').textContent,
  };
  try {
    await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  } catch (e) { /* ignore */ }
  document.getElementById('calcModal').querySelector('.calc-modal-content').innerHTML = `
    <h2 style="color:var(--green);">Request Submitted!</h2>
    <p>We'll contact you shortly to confirm your cleaning appointment.</p>
    <a href="/" class="btn btn-primary" data-link style="margin-top:16px;">Back to Home</a>`;
  bindLinks();
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
              <div class="service-feature-icon">${ICONS.check}</div>
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
            <a href="/quote/commercial" class="btn btn-primary" data-link>Get Commercial Quote</a>
          </div>
          <div class="commercial-image">${ICONS.building}</div>
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
                <div class="product-image">${ICONS.product}</div>
                <div class="product-body">
                  <h3><a href="/products/${slugify(item.name)}" data-link>${item.name}</a></h3>
                  <p>${item.description}</p>
                  <div class="product-price">${item.price}</div>
                  <div class="product-cart">
                    <button class="btn btn-sm btn-secondary" onclick="addToCart(${i})">Add to Cart</button>
                  </div>
                </div>
              </div>`).join('')}
          </div>
          <div class="order-summary">
            <h3>Your Cart</h3>
            <div id="productCartLines" class="cart-lines">
              <div class="order-summary-empty">Your cart is empty</div>
            </div>
            <div class="order-total">
              <span>Total</span>
              <span id="productCartTotal">$0.00</span>
            </div>
            <button id="productCheckoutBtn" class="btn btn-primary btn-full btn-sm" style="margin-top:16px;" disabled onclick="showToast('Checkout coming soon!')">Checkout</button>
          </div>
        </div>
      </div>
    </section>
  `;
  updateCartSidebar();
}

function renderProductDetail(slug) {
  const d = CMS.products || {};
  const items = d.items || [];
  const index = items.findIndex(item => slugify(item.name) === slug);
  const item = items[index];
  if (!item) {
    document.getElementById('app').innerHTML = '<div class="page-content"><div class="container" style="text-align:center;padding:80px 20px;"><h1>Product Not Found</h1><a href="/products" class="btn btn-primary" data-link>Back to Products</a></div></div>';
    return;
  }
  document.getElementById('app').innerHTML = `
    ${breadcrumb([{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: item.name }])}
    <section class="page-content">
      <div class="container" style="max-width:800px;">
        <div class="product-detail">
          <div class="product-detail-image">${ICONS.product}</div>
          <div class="product-detail-info">
            <h1>${item.name}</h1>
            <p class="product-detail-desc">${item.description}</p>
            <div class="product-detail-price">${item.price}</div>
            <button class="btn btn-primary" onclick="addToCart(${index})">Add to Cart</button>
            <a href="/products" class="btn btn-outline-dark" data-link style="margin-left:12px;">Back to Products</a>
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
            <div class="about-image">${i === 0 ? ICONS.star : i === 1 ? ICONS.badge : i === 2 ? ICONS.shield : ICONS.check}</div>
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
                <div class="blog-card-image">${ICONS.article}</div>
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
                <div class="contact-info-icon">${ICONS.phone}</div>
                <div><h4>Phone</h4><p>${(d.info || {}).phone || '1-800-555-RHINO'}</p></div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon">${ICONS.mail}</div>
                <div><h4>Email</h4><p>${(d.info || {}).email || 'info@shinyrhino.com'}</p></div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon">${ICONS.clock}</div>
                <div><h4>Hours</h4><p>${(d.info || {}).hours || 'Mon-Fri: 7am-8pm'}</p></div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon">${ICONS.pin}</div>
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
  showToast('Thanks for subscribing!');
}

// ---- CMS Admin Page ----
let adminActiveTab = 'pricing';
let adminUnsaved = false;

const ADMIN_PAGE_CONFIG = {
  global: {
    label: 'Global Settings',
    icon: '&#9881;',
    sections: [
      { key: 'companyName', label: 'Company Name', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'phone', label: 'Display Phone', type: 'text' },
      { key: 'phoneRaw', label: 'Phone (raw)', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'hours', label: 'Business Hours', type: 'group', fields: [
        { key: 'weekday', label: 'Weekday', type: 'text' },
        { key: 'saturday', label: 'Saturday', type: 'text' },
        { key: 'sunday', label: 'Sunday', type: 'text' }
      ]},
      { key: 'social', label: 'Social Media Links', type: 'group', fields: [
        { key: 'facebook', label: 'Facebook URL', type: 'text' },
        { key: 'instagram', label: 'Instagram URL', type: 'text' },
        { key: 'tiktok', label: 'TikTok URL', type: 'text' },
        { key: 'youtube', label: 'YouTube URL', type: 'text' }
      ]}
    ]
  },
  home: {
    label: 'Home Page',
    icon: '&#127968;',
    sections: [
      { key: 'hero', label: 'Hero Section', type: 'group', fields: [
        { key: 'title', label: 'Headline', type: 'text' },
        { key: 'subtitle', label: 'Subheadline', type: 'textarea' },
        { key: 'ctaPrimary', label: 'Primary Button Text', type: 'text' },
        { key: 'ctaSecondary', label: 'Secondary Button Text', type: 'text' }
      ]},
      { key: 'quoteCalc', label: 'Quote Calculator Section', type: 'group', fields: [
        { key: 'title', label: 'Section Title', type: 'text' }
      ]},
      { key: 'servicesTitle', label: 'Services Section Title', type: 'text' },
      { key: 'servicesSubtitle', label: 'Services Section Subtitle', type: 'text' },
      { key: 'trust', label: 'Trust Section', type: 'group', fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'items', label: 'Trust Points', type: 'array', itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' }
        ]}
      ]},
      { key: 'stats', label: 'Statistics', type: 'array', itemFields: [
        { key: 'number', label: 'Number', type: 'text' },
        { key: 'label', label: 'Label', type: 'text' }
      ]},
      { key: 'blog', label: 'Blog Preview Section', type: 'group', fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle', type: 'text' },
        { key: 'posts', label: 'Featured Posts', type: 'array', itemFields: [
          { key: 'title', label: 'Post Title', type: 'text' },
          { key: 'category', label: 'Category', type: 'text' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea' }
        ]}
      ]}
    ]
  },
  about: {
    label: 'About Page',
    icon: '&#9432;',
    sections: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'heroText', label: 'Hero Subtitle', type: 'textarea' },
      { key: 'content', label: 'Main Content', type: 'textarea' },
      { key: 'sections', label: 'Content Sections', type: 'array', itemFields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'text', label: 'Section Text', type: 'textarea' }
      ]}
    ]
  },
  products: {
    label: 'Products',
    icon: '&#128722;',
    sections: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'items', label: 'Product Items', type: 'array', itemFields: [
        { key: 'name', label: 'Product Name', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'price', label: 'Price', type: 'text' }
      ]}
    ]
  },
  blog: {
    label: 'Blog',
    icon: '&#128221;',
    sections: [
      { key: 'title', label: 'Blog Title', type: 'text' },
      { key: 'subtitle', label: 'Blog Subtitle', type: 'textarea' },
      { key: 'categories', label: 'Blog Categories', type: 'array', itemFields: [
        { key: 'name', label: 'Category Name', type: 'text' },
        { key: 'posts', label: 'Posts', type: 'array', itemFields: [
          { key: 'title', label: 'Post Title', type: 'text' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
          { key: 'date', label: 'Date', type: 'text' }
        ]}
      ]}
    ]
  },
  faq: {
    label: 'FAQ',
    icon: '&#10067;',
    sections: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'categories', label: 'FAQ Categories', type: 'array', itemFields: [
        { key: 'name', label: 'Category Name', type: 'text' },
        { key: 'questions', label: 'Questions', type: 'array', itemFields: [
          { key: 'q', label: 'Question', type: 'text' },
          { key: 'a', label: 'Answer', type: 'textarea' }
        ]}
      ]}
    ]
  },
  contact: {
    label: 'Contact',
    icon: '&#9993;',
    sections: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { key: 'info', label: 'Contact Info', type: 'group', fields: [
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'hours', label: 'Hours', type: 'text' }
      ]}
    ]
  },
  locations: {
    label: 'Locations',
    icon: '&#128205;',
    sections: [
      { key: 'title', label: 'Page Title', type: 'text' },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea' }
    ]
  }
};

function renderAdmin() {
  const pages = Object.keys(ADMIN_PAGE_CONFIG);

  document.getElementById('app').innerHTML = `
    <div class="adm">
      <aside class="adm-sidebar">
        <div class="adm-sidebar-header">
          <a href="/" data-link class="adm-logo">Shiny Rhino</a>
          <span class="adm-badge">CMS</span>
        </div>
        <nav class="adm-nav">
          <button class="adm-nav-item ${adminActiveTab === 'pricing' ? 'active' : ''}" onclick="adminSwitchTab('pricing')">
            <span class="adm-nav-icon">&#128176;</span> Pricing
          </button>
          <div class="adm-nav-divider">Pages</div>
          ${pages.map(p => `
            <button class="adm-nav-item ${adminActiveTab === p ? 'active' : ''}" onclick="adminSwitchTab('${p}')">
              <span class="adm-nav-icon">${ADMIN_PAGE_CONFIG[p].icon}</span> ${ADMIN_PAGE_CONFIG[p].label}
            </button>
          `).join('')}
          <div class="adm-nav-divider">Services</div>
          ${Object.keys(CMS.services || {}).map(key => `
            <button class="adm-nav-item ${adminActiveTab === 'svc_' + key ? 'active' : ''}" onclick="adminSwitchTab('svc_${key}')">
              <span class="adm-nav-icon">${ICONS[key] ? '<span style="width:16px;height:16px;display:inline-block;">' + ICONS[key] + '</span>' : '&#8226;'}</span>
              ${(CMS.services[key]?.title || key)}
            </button>
          `).join('')}
        </nav>
        <div class="adm-sidebar-footer">
          <a href="/" data-link class="btn btn-sm btn-outline" style="width:100%;text-align:center;">View Live Site</a>
        </div>
      </aside>
      <main class="adm-main">
        <header class="adm-header">
          <h1 id="admPageTitle">Dashboard</h1>
          <div class="adm-header-actions">
            <span id="admSaveStatus" class="adm-save-status"></span>
            <button class="btn btn-sm btn-outline-dark" onclick="adminExport()">Export</button>
            <label class="btn btn-sm btn-outline-dark" style="cursor:pointer;">Import<input type="file" accept=".json" style="display:none;" onchange="adminImport(event)"></label>
            <button class="btn btn-primary btn-sm" onclick="adminSave()" id="admSaveBtn">Save Changes</button>
          </div>
        </header>
        <div class="adm-content" id="adminTabContent"></div>
      </main>
    </div>
  `;

  adminRenderTab();
}

function adminSwitchTab(tab) {
  adminActiveTab = tab;
  document.querySelectorAll('.adm-nav-item').forEach(b => b.classList.remove('active'));
  // Find matching button
  document.querySelectorAll('.adm-nav-item').forEach(b => {
    const text = b.textContent.trim();
    if (tab === 'pricing' && text === 'Pricing') b.classList.add('active');
    else if (tab.startsWith('svc_') && (CMS.services[tab.replace('svc_','')]?.title || '').trim() === text.trim()) b.classList.add('active');
    else if (ADMIN_PAGE_CONFIG[tab] && ADMIN_PAGE_CONFIG[tab].label === text) b.classList.add('active');
  });
  adminRenderTab();
}

function adminMarkUnsaved() {
  adminUnsaved = true;
  const el = document.getElementById('admSaveStatus');
  if (el) el.textContent = 'Unsaved changes';
}

function adminRenderTab() {
  const container = document.getElementById('adminTabContent');
  const titleEl = document.getElementById('admPageTitle');
  if (!container) return;

  // Service pages
  if (adminActiveTab.startsWith('svc_')) {
    const svcKey = adminActiveTab.replace('svc_', '');
    const svc = (CMS.services || {})[svcKey] || {};
    if (titleEl) titleEl.textContent = svc.title || svcKey;
    container.innerHTML = adminRenderServiceEditor(svcKey, svc);
    return;
  }

  if (adminActiveTab === 'pricing') {
    if (titleEl) titleEl.textContent = 'Pricing Manager';
    const pricing = CMS.pricing || { hiddenFee: { label: 'Service Fee', amount: 0 }, categories: [] };
    container.innerHTML = `
      <div class="adm-card">
        <div class="adm-card-header">
          <h2>Hidden Service Fee</h2>
          <span class="adm-card-hint">Not visible to customers. Applied automatically to all quotes.</span>
        </div>
        <div class="adm-card-body adm-row">
          <div class="adm-input-group">
            <label>Label</label>
            <input type="text" id="adminFeeLabel" value="${(pricing.hiddenFee?.label || '').replace(/"/g, '&quot;')}" oninput="adminMarkUnsaved()">
          </div>
          <div class="adm-input-group" style="max-width:160px;">
            <label>Amount ($)</label>
            <input type="number" id="adminFeeAmount" value="${pricing.hiddenFee?.amount || 0}" min="0" step="0.01" oninput="adminMarkUnsaved()">
          </div>
        </div>
      </div>
      <div id="adminCategories"></div>
      <button class="btn btn-secondary" onclick="adminAddCategory()" style="margin:24px 0 40px;">+ Add New Category</button>
    `;
    adminRenderCategories();
  } else if (ADMIN_PAGE_CONFIG[adminActiveTab]) {
    const config = ADMIN_PAGE_CONFIG[adminActiveTab];
    if (titleEl) titleEl.textContent = config.label;
    const data = CMS[adminActiveTab] || {};
    container.innerHTML = adminRenderStructuredEditor(adminActiveTab, data, config.sections);
  }
}

function adminRenderStructuredEditor(page, data, sections, pathPrefix) {
  const basePath = pathPrefix || page;
  return sections.map(field => {
    const val = data?.[field.key];
    if (field.type === 'text') {
      return `<div class="adm-card"><div class="adm-card-body">
        <div class="adm-input-group">
          <label>${field.label}</label>
          <input type="text" value="${(val || '').toString().replace(/"/g, '&quot;')}" onchange="adminSetField('${page}','${basePath}.${field.key}', this.value); adminMarkUnsaved()">
        </div>
      </div></div>`;
    }
    if (field.type === 'textarea') {
      return `<div class="adm-card"><div class="adm-card-body">
        <div class="adm-input-group">
          <label>${field.label}</label>
          <textarea rows="3" onchange="adminSetField('${page}','${basePath}.${field.key}', this.value); adminMarkUnsaved()">${val || ''}</textarea>
        </div>
      </div></div>`;
    }
    if (field.type === 'group') {
      return `<div class="adm-card">
        <div class="adm-card-header"><h2>${field.label}</h2></div>
        <div class="adm-card-body">
          ${adminRenderStructuredEditor(page, val || {}, field.fields, basePath + '.' + field.key)}
        </div>
      </div>`;
    }
    if (field.type === 'array') {
      const arr = val || [];
      return `<div class="adm-card">
        <div class="adm-card-header"><h2>${field.label} <span class="adm-count">${arr.length}</span></h2></div>
        <div class="adm-card-body">
          ${arr.map((item, i) => `
            <div class="adm-array-card">
              <div class="adm-array-card-head">
                <span class="adm-array-num">${i + 1}</span>
                <span class="adm-array-title">${item[field.itemFields[0]?.key] || 'Item ' + (i+1)}</span>
                <div class="adm-array-actions">
                  ${i > 0 ? `<button class="adm-icon-btn" onclick="adminMoveArrayItem('${page}','${basePath}.${field.key}',${i},-1)" title="Move up">&#9650;</button>` : ''}
                  ${i < arr.length - 1 ? `<button class="adm-icon-btn" onclick="adminMoveArrayItem('${page}','${basePath}.${field.key}',${i},1)" title="Move down">&#9660;</button>` : ''}
                  <button class="adm-icon-btn adm-icon-btn--danger" onclick="adminRemoveArrayItem('${page}','${basePath}.${field.key}',${i})" title="Remove">&#10005;</button>
                </div>
              </div>
              <div class="adm-array-card-body">
                ${field.itemFields.map(sf => {
                  const sfVal = item?.[sf.key];
                  if (sf.type === 'text') {
                    return `<div class="adm-input-group"><label>${sf.label}</label><input type="text" value="${(sfVal || '').toString().replace(/"/g, '&quot;')}" onchange="adminSetField('${page}','${basePath}.${field.key}[${i}].${sf.key}', this.value); adminMarkUnsaved()"></div>`;
                  }
                  if (sf.type === 'textarea') {
                    return `<div class="adm-input-group"><label>${sf.label}</label><textarea rows="2" onchange="adminSetField('${page}','${basePath}.${field.key}[${i}].${sf.key}', this.value); adminMarkUnsaved()">${sfVal || ''}</textarea></div>`;
                  }
                  if (sf.type === 'array') {
                    const nested = sfVal || [];
                    return `<div class="adm-nested-array">
                      <label>${sf.label} <span class="adm-count">${nested.length}</span></label>
                      ${nested.map((ni, ni_idx) => `
                        <div class="adm-nested-item">
                          ${sf.itemFields.map(nf => {
                            const nfVal = ni?.[nf.key];
                            return `<div class="adm-input-group adm-input-inline"><label>${nf.label}</label>${nf.type === 'textarea'
                              ? `<textarea rows="2" onchange="adminSetField('${page}','${basePath}.${field.key}[${i}].${sf.key}[${ni_idx}].${nf.key}', this.value); adminMarkUnsaved()">${nfVal || ''}</textarea>`
                              : `<input type="text" value="${(nfVal || '').toString().replace(/"/g, '&quot;')}" onchange="adminSetField('${page}','${basePath}.${field.key}[${i}].${sf.key}[${ni_idx}].${nf.key}', this.value); adminMarkUnsaved()">`
                            }</div>`;
                          }).join('')}
                          <button class="adm-icon-btn adm-icon-btn--danger" onclick="adminRemoveArrayItem('${page}','${basePath}.${field.key}[${i}].${sf.key}',${ni_idx})" title="Remove">&#10005;</button>
                        </div>
                      `).join('')}
                      <button class="btn btn-sm btn-outline-dark" onclick="adminPushArrayItem('${page}','${basePath}.${field.key}[${i}].${sf.key}', ${JSON.stringify(sf.itemFields.reduce((o,f)=>({...o,[f.key]:''}),{})).replace(/"/g, '&quot;')})">+ Add</button>
                    </div>`;
                  }
                  return '';
                }).join('')}
              </div>
            </div>
          `).join('')}
          <button class="btn btn-sm btn-outline-dark" style="margin-top:12px;" onclick="adminPushArrayItem('${page}','${basePath}.${field.key}', ${JSON.stringify(field.itemFields.reduce((o,f)=>({...o,[f.key]: f.type === 'array' ? [] : ''}),{})).replace(/"/g, '&quot;')})">+ Add ${field.label.replace(/s$/, '')}</button>
        </div>
      </div>`;
    }
    return '';
  }).join('');
}

function adminRenderServiceEditor(svcKey, svc) {
  const page = 'services';
  const base = `services.${svcKey}`;
  const sections = [
    { key: 'title', label: 'Service Title', type: 'text' },
    { key: 'heroText', label: 'Hero Text', type: 'textarea' },
    { key: 'quoteTitle', label: 'Quote Box Title', type: 'text' },
    { key: 'quoteSubtitle', label: 'Quote Box Subtitle', type: 'text' },
    { key: 'content', label: 'Main Content', type: 'textarea' },
    { key: 'process', label: 'Cleaning Process', type: 'group', fields: [
      { key: 'title', label: 'Section Title', type: 'text' },
      { key: 'steps', label: 'Steps', type: 'array', itemFields: [
        { key: 'title', label: 'Step Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' }
      ]}
    ]},
    { key: 'features', label: 'Features', type: 'array', itemFields: [
      { key: 'title', label: 'Feature Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]},
    { key: 'faq', label: 'FAQ', type: 'array', itemFields: [
      { key: 'q', label: 'Question', type: 'text' },
      { key: 'a', label: 'Answer', type: 'textarea' }
    ]},
    { key: 'commercial', label: 'Commercial Section', type: 'group', fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' }
    ]}
  ];
  return adminRenderStructuredEditor(page, svc, sections, base);
}

// Navigate a dot/bracket path and set value
function adminSetField(rootPage, path, value) {
  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  let obj = CMS;
  for (let i = 0; i < parts.length - 1; i++) {
    if (obj[parts[i]] === undefined) obj[parts[i]] = {};
    obj = obj[parts[i]];
  }
  obj[parts[parts.length - 1]] = value;
}

function adminGetByPath(path) {
  const parts = path.split(/\.|\[|\]/).filter(Boolean);
  let obj = CMS;
  for (const p of parts) {
    if (obj === undefined) return undefined;
    obj = obj[p];
  }
  return obj;
}

function adminRemoveArrayItem(rootPage, path, index) {
  const arr = adminGetByPath(path);
  if (Array.isArray(arr)) {
    arr.splice(index, 1);
    adminMarkUnsaved();
    adminRenderTab();
  }
}

function adminPushArrayItem(rootPage, path, template) {
  const arr = adminGetByPath(path);
  if (Array.isArray(arr)) {
    arr.push(typeof template === 'string' ? JSON.parse(template) : JSON.parse(JSON.stringify(template)));
    adminMarkUnsaved();
    adminRenderTab();
  }
}

function adminMoveArrayItem(rootPage, path, index, direction) {
  const arr = adminGetByPath(path);
  if (!Array.isArray(arr)) return;
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= arr.length) return;
  [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
  adminMarkUnsaved();
  adminRenderTab();
}

function adminRenderCategories() {
  const pricing = CMS.pricing || { categories: [] };
  const container = document.getElementById('adminCategories');
  if (!container) return;

  container.innerHTML = pricing.categories.map((cat, ci) => `
    <div class="adm-card">
      <div class="adm-card-header">
        <h2><input type="text" class="adm-inline-edit" value="${cat.name.replace(/"/g, '&quot;')}" onchange="adminUpdateCatName(${ci}, this.value); adminMarkUnsaved()"></h2>
        <button class="adm-icon-btn adm-icon-btn--danger" onclick="adminDeleteCategory(${ci})" title="Delete category">&#10005;</button>
      </div>
      <div class="adm-card-body">
        <table class="adm-table">
          <thead><tr><th>Name</th><th>Description</th><th style="width:80px;">Price</th><th style="width:80px;">Unit</th><th style="width:40px;"></th></tr></thead>
          <tbody>
            ${cat.items.map((item, ii) => `
              <tr>
                <td><input type="text" value="${item.name.replace(/"/g, '&quot;')}" onchange="adminUpdateItem(${ci},${ii},'name',this.value); adminMarkUnsaved()"></td>
                <td><input type="text" value="${item.description.replace(/"/g, '&quot;')}" onchange="adminUpdateItem(${ci},${ii},'description',this.value); adminMarkUnsaved()"></td>
                <td><input type="number" value="${item.price}" min="0" step="0.01" onchange="adminUpdateItem(${ci},${ii},'price',parseFloat(this.value)||0); adminMarkUnsaved()"></td>
                <td><input type="text" value="${item.unit}" onchange="adminUpdateItem(${ci},${ii},'unit',this.value); adminMarkUnsaved()"></td>
                <td><button class="adm-icon-btn adm-icon-btn--danger" onclick="adminDeleteItem(${ci},${ii})">&#10005;</button></td>
              </tr>
              <tr><td colspan="5">
                <details class="adm-details">
                  <summary>Add-ons & Instructions</summary>
                  <div style="padding:12px 0;">
                    ${(item.addons || []).map((addon, ai) => `
                      <div class="adm-row" style="margin-bottom:8px;">
                        <input type="text" value="${addon.name.replace(/"/g, '&quot;')}" placeholder="Add-on name" onchange="adminUpdateAddon(${ci},${ii},${ai},'name',this.value); adminMarkUnsaved()" style="flex:2;">
                        <input type="number" value="${addon.price}" min="0" step="0.01" placeholder="Price" onchange="adminUpdateAddon(${ci},${ii},${ai},'price',parseFloat(this.value)||0); adminMarkUnsaved()" style="flex:1;">
                        <button class="adm-icon-btn adm-icon-btn--danger" onclick="adminDeleteAddon(${ci},${ii},${ai})">&#10005;</button>
                      </div>
                    `).join('')}
                    <button class="btn btn-sm btn-outline-dark" onclick="adminAddAddon(${ci},${ii})">+ Add Add-on</button>
                    <div class="adm-input-group" style="margin-top:12px;">
                      <label>Instructions</label>
                      <textarea rows="2" onchange="adminUpdateItem(${ci},${ii},'instructions',this.value); adminMarkUnsaved()" placeholder="Special instructions...">${item.instructions || ''}</textarea>
                    </div>
                  </div>
                </details>
              </td></tr>
            `).join('')}
          </tbody>
        </table>
        <button class="btn btn-sm btn-outline-dark" onclick="adminAddItem(${ci})" style="margin-top:12px;">+ Add Item</button>
      </div>
    </div>
  `).join('');
}

function adminUpdateCatName(ci, val) {
  CMS.pricing.categories[ci].name = val;
}

function adminUpdateItem(ci, ii, field, val) {
  CMS.pricing.categories[ci].items[ii][field] = val;
}

function adminUpdateAddon(ci, ii, ai, field, val) {
  CMS.pricing.categories[ci].items[ii].addons[ai][field] = val;
}

function adminDeleteCategory(ci) {
  if (!confirm('Delete this category and all its items?')) return;
  CMS.pricing.categories.splice(ci, 1);
  adminRenderCategories();
}

function adminDeleteItem(ci, ii) {
  CMS.pricing.categories[ci].items.splice(ii, 1);
  adminRenderCategories();
}

function adminDeleteAddon(ci, ii, ai) {
  CMS.pricing.categories[ci].items[ii].addons.splice(ai, 1);
  adminRenderCategories();
}

function adminAddCategory() {
  if (!CMS.pricing) CMS.pricing = { hiddenFee: { label: 'Service Fee', amount: 0 }, categories: [] };
  CMS.pricing.categories.push({ name: 'New Category', items: [] });
  adminRenderCategories();
}

function adminAddItem(ci) {
  CMS.pricing.categories[ci].items.push({ name: 'New Item', description: '', price: 0, unit: 'each', addons: [], instructions: '' });
  adminRenderCategories();
}

function adminAddAddon(ci, ii) {
  CMS.pricing.categories[ci].items[ii].addons.push({ name: '', price: 0 });
  adminRenderCategories();
}

async function adminSave() {
  // Gather hidden fee from inputs if on pricing tab
  if (adminActiveTab === 'pricing') {
    CMS.pricing.hiddenFee = {
      label: document.getElementById('adminFeeLabel')?.value || 'Service Fee',
      amount: parseFloat(document.getElementById('adminFeeAmount')?.value) || 0
    };
    await saveCMS('pricing', CMS.pricing);
  } else if (adminActiveTab.startsWith('svc_')) {
    await saveCMS('services', CMS.services);
  } else {
    await saveCMS(adminActiveTab, CMS[adminActiveTab]);
  }
  adminUnsaved = false;
  const el = document.getElementById('admSaveStatus');
  if (el) { el.textContent = 'Saved!'; el.style.color = 'var(--green)'; setTimeout(() => { el.textContent = ''; }, 2000); }
  showToast('Changes saved successfully!');
}

function adminExport() {
  const blob = new Blob([JSON.stringify(CMS.pricing, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'pricing-config.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

function adminImport(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async function(ev) {
    try {
      const imported = JSON.parse(ev.target.result);
      CMS.pricing = imported;
      await saveCMS('pricing', CMS.pricing);
      showToast('Config imported successfully!');
      renderAdmin();
    } catch (err) {
      showToast('Invalid JSON file.');
    }
  };
  reader.readAsText(file);
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
  showToast('Thanks for subscribing!');
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
