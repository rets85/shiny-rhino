// ============================================
// Server-Side Rendering for SEO
// Generates HTML content for each route
// ============================================

function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function getMeta(path, CMS) {
  const g = CMS.global || {};
  const company = g.companyName || 'Shiny Rhino';
  const base = { siteName: company, phone: g.phone || '' };

  const metaMap = {
    '/': {
      title: `${company} | Professional Carpet & Deep Cleaning Services`,
      description: (CMS.home?.hero?.subtitle) || 'Professional carpet, upholstery, and floor cleaning services for homes and businesses.',
      ...base
    },
    '/quote': {
      title: `Instant Pricing Calculator | ${company}`,
      description: 'Get an instant, no-hassle quote for carpet cleaning, upholstery cleaning, and more. Pick your items and see your price instantly.',
      ...base
    },
    '/quote/commercial': {
      title: `Commercial Cleaning Services | ${company}`,
      description: 'Custom pricing for offices, facilities and commercial spaces. Build your commercial cleaning service package and get instant pricing.',
      ...base
    },
    '/products': {
      title: `Professional Cleaning Products | ${company}`,
      description: (CMS.products?.title) || 'Professional grade cleaning products for home use.',
      ...base
    },
    '/about': {
      title: `About Us - Our Story | ${company}`,
      description: (CMS.about?.content || '').slice(0, 155),
      ...base
    },
    '/blog': {
      title: `${CMS.blog?.title || 'Blog'} | ${company}`,
      description: CMS.blog?.subtitle || 'Tips, tricks, and insights from our cleaning experts.',
      ...base
    },
    '/faq': {
      title: `Frequently Asked Questions | ${company}`,
      description: 'Find answers to common questions about carpet cleaning, upholstery cleaning, tile & grout, and more.',
      ...base
    },
    '/locations': {
      title: `Find a Location Near You | ${company}`,
      description: CMS.locations?.subtitle || 'Find your local cleaning team.',
      ...base
    },
    '/contact': {
      title: `Contact Us | ${company}`,
      description: CMS.contact?.subtitle || 'Reach out with questions or to schedule a cleaning.',
      ...base
    },
    '/sh-admin': {
      title: `Admin Dashboard | ${company}`,
      description: 'Pricing administration dashboard.',
      noIndex: true,
      ...base
    },
  };

  // Service pages
  const serviceMatch = path.match(/^\/services\/(\w+)$/);
  if (serviceMatch) {
    const svc = (CMS.services || {})[serviceMatch[1]];
    if (svc) {
      return {
        title: `${svc.title} | ${company}`,
        description: (svc.heroText || '').slice(0, 155),
        ...base
      };
    }
  }

  // Blog post pages
  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const posts = (CMS.blog || {}).posts || [];
    const post = posts.find(p => p.slug === decodeURIComponent(blogMatch[1]));
    if (post) {
      const seo = post.seo || {};
      return {
        title: `${seo.metaTitle || post.title} | ${company}`,
        description: (seo.metaDescription || post.excerpt || '').slice(0, 155),
        ogImage: seo.ogImage || '',
        ...base
      };
    }
  }

  return metaMap[path] || {
    title: `${company} | Professional Cleaning Services`,
    description: 'Professional carpet, upholstery, and floor cleaning services.',
    ...base
  };
}

function renderMetaTags(path, CMS, baseUrl) {
  const meta = getMeta(path, CMS);
  const canonical = baseUrl + path;
  return `
    <title>${escHtml(meta.title)}</title>
    <meta name="description" content="${escHtml(meta.description)}">
    <link rel="canonical" href="${escHtml(canonical)}">
    ${meta.noIndex ? '<meta name="robots" content="noindex, nofollow">' : ''}
    <meta property="og:title" content="${escHtml(meta.title)}">
    <meta property="og:description" content="${escHtml(meta.description)}">
    <meta property="og:url" content="${escHtml(canonical)}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escHtml(meta.siteName)}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${escHtml(meta.title)}">
    <meta name="twitter:description" content="${escHtml(meta.description)}">`;
}

function renderStructuredData(CMS) {
  const g = CMS.global || {};
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': g.companyName || 'Shiny Rhino',
    'telephone': g.phoneRaw || g.phone || '',
    'email': g.email || '',
    'url': '/',
    'description': CMS.home?.hero?.subtitle || 'Professional cleaning services',
    'openingHours': [
      g.hours?.weekday || 'Mo-Fr 07:00-20:00',
      g.hours?.saturday || 'Sa 08:00-17:00'
    ],
    'priceRange': '$$',
    'serviceType': ['Carpet Cleaning', 'Upholstery Cleaning', 'Tile & Grout Cleaning', 'Hardwood Floor Cleaning', 'Water Damage Restoration']
  };
  return `<script type="application/ld+json">${JSON.stringify(ld)}</script>`;
}

// --- Page Content Renderers ---

function ssrHome(CMS) {
  const d = CMS.home || {};
  const hero = d.hero || {};
  const services = CMS.services || {};
  const trust = d.trust || {};
  const stats = d.stats || [];
  const serviceKeys = ['carpet','upholstery','tile','hardwood','rug','stone','vehicle','water'];

  return `
    <section class="hero hero--gradient">
      <div class="container hero-content hero-content--center">
        <h1>${escHtml(hero.title)}</h1>
        <p class="hero-sub">${escHtml(hero.subtitle)}</p>
        <div class="hero-buttons">
          <a href="/quote" class="btn btn-primary btn-lg" data-link>${escHtml(hero.ctaPrimary || 'Get a Quote')}</a>
          <a href="tel:${escHtml((CMS.global||{}).phoneRaw)}" class="btn btn-outline btn-lg">${escHtml(hero.ctaSecondary || 'Call Us')}</a>
        </div>
      </div>
    </section>
    <section class="services-section">
      <div class="container">
        <h2 class="section-title">${escHtml(d.servicesTitle)}</h2>
        <p class="section-subtitle">${escHtml(d.servicesSubtitle)}</p>
        <ul class="services-grid">
          ${serviceKeys.map(key => {
            const svc = services[key];
            return svc ? `<li><a href="/services/${key}" data-link><h3>${escHtml(svc.title)}</h3></a></li>` : '';
          }).join('')}
        </ul>
      </div>
    </section>
    <section class="trust-section">
      <div class="container">
        <h2 class="section-title">${escHtml(trust.title)}</h2>
        <p>${escHtml(trust.description)}</p>
        ${(trust.items||[]).map(item => `
          <div class="trust-item"><h3>${escHtml(item.title)}</h3><p>${escHtml(item.description)}</p></div>
        `).join('')}
      </div>
    </section>
    <section class="trust-stats"><div class="container"><div class="stats-grid">
      ${stats.map(s => `<div><div class="stat-number">${escHtml(s.number)}</div><div class="stat-label">${escHtml(s.label)}</div></div>`).join('')}
    </div></div></section>
    <section class="faq-section"><div class="container">
      <h2 class="section-title">Frequently Asked Questions</h2>
      ${(((CMS.faq||{}).categories||[])[0]||{questions:[]}).questions.slice(0,4).map(q => `
        <div class="faq-item"><h3>${escHtml(q.q)}</h3><p>${escHtml(q.a)}</p></div>
      `).join('')}
    </div></section>`;
}

function ssrService(CMS, key) {
  const svc = (CMS.services || {})[key];
  if (!svc) return '<h1>Service Not Found</h1>';
  return `
    <section class="service-hero">
      <div class="container">
        <h1>${escHtml(svc.title)}</h1>
        <p>${escHtml(svc.heroText)}</p>
      </div>
    </section>
    <section class="service-content">
      <div class="container container--narrow">
        <h2>${escHtml(svc.title)}</h2>
        <p>${escHtml(svc.content)}</p>
        ${(svc.features||[]).map(f => `<div><h3>${escHtml(f.title)}</h3><p>${escHtml(f.description)}</p></div>`).join('')}
      </div>
    </section>
    ${svc.process ? `<section class="process-section"><div class="container">
      <h2 class="section-title">${escHtml(svc.process.title)}</h2>
      ${svc.process.steps.map((step,i) => `<div><h3>Step ${i+1}: ${escHtml(step.title)}</h3><p>${escHtml(step.description)}</p></div>`).join('')}
    </div></section>` : ''}
    ${svc.faq && svc.faq.length ? `<section class="faq-section"><div class="container">
      <h2 class="section-title">Frequently Asked Questions</h2>
      ${svc.faq.map(q => `<div class="faq-item"><h3>${escHtml(q.q)}</h3><p>${escHtml(q.a)}</p></div>`).join('')}
    </div></section>` : ''}
    ${svc.commercial ? `<section><div class="container">
      <h2>${escHtml(svc.commercial.title)}</h2><p>${escHtml(svc.commercial.description)}</p>
      <a href="/quote/commercial">Get Commercial Quote</a>
    </div></section>` : ''}`;
}

function ssrQuote(CMS, isCommercial) {
  const pricing = CMS.pricing || { categories: [] };
  return `
    <section class="calc-page">
      <div class="calc-header${isCommercial ? ' calc-header--biz' : ''}">
        ${isCommercial
          ? '<h1>COMMERCIAL CLEANING SERVICES</h1><p>Custom pricing for offices, facilities &amp; commercial spaces. Build your service package below.</p>'
          : '<h1>NO HASSLE PRICING &amp; CLEANING</h1><p>Pick your items, see your price instantly. No surprises.</p>'}
      </div>
      <div class="calc-layout"><div class="calc-main">
        ${pricing.categories.map(cat => `
          <div class="calc-category">
            <h2>${escHtml(cat.name)}</h2>
            ${cat.items.map(item => `
              <div class="calc-item">
                <h3>${escHtml(item.name)}</h3>
                <p>${escHtml(item.description)}</p>
                <p><strong>$${item.price} / ${escHtml(item.unit)}</strong></p>
                ${(item.addons||[]).length ? `<p>Add-ons: ${item.addons.map(a => `${escHtml(a.name)} (+$${a.price})`).join(', ')}</p>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div></div>
    </section>`;
}

function ssrProducts(CMS) {
  const d = CMS.products || {};
  return `
    <section class="page-content"><div class="container">
      <h1>${escHtml(d.title)}</h1>
      <div class="products-grid">
        ${(d.items||[]).map(item => `
          <div class="product-card">
            <h3>${escHtml(item.name)}</h3>
            <p>${escHtml(item.description)}</p>
            <p class="product-price">${escHtml(item.price)}</p>
          </div>
        `).join('')}
      </div>
    </div></section>`;
}

function ssrAbout(CMS) {
  const d = CMS.about || {};
  return `
    <section class="hero hero--gradient"><div class="container hero-content hero-content--center">
      <h1>${escHtml(d.title)}</h1><p class="hero-sub">${escHtml(d.heroText)}</p>
    </div></section>
    <section class="about-content"><div class="container">
      <p>${escHtml(d.content)}</p>
      ${(d.sections||[]).map(sec => `<div><h2>${escHtml(sec.title)}</h2><p>${escHtml(sec.text)}</p></div>`).join('')}
    </div></section>`;
}

function ssrBlog(CMS) {
  const d = CMS.blog || {};
  const posts = (d.posts || []).filter(p => p.status === 'published');
  return `
    <section class="hero hero--gradient"><div class="container hero-content hero-content--center">
      <h1>${escHtml(d.title)}</h1><p class="hero-sub">${escHtml(d.subtitle)}</p>
    </div></section>
    <section class="blog-section"><div class="container">
      ${posts.map(post => `
        <article>
          <h2><a href="/blog/${escHtml(post.slug)}">${escHtml(post.title)}</a></h2>
          <p>${escHtml(post.excerpt)}</p>
          <p><small>${escHtml(post.author || '')} &middot; ${escHtml(post.date || '')}</small></p>
        </article>
      `).join('')}
    </div></section>`;
}

function ssrBlogPost(CMS, slug) {
  const posts = (CMS.blog || {}).posts || [];
  const post = posts.find(p => p.slug === slug);
  if (!post) return '<section class="page-content"><div class="container"><h1>Post Not Found</h1></div></section>';
  return `
    <article class="blog-post"><div class="container blog-post-container">
      <h1>${escHtml(post.title)}</h1>
      <p><small>By ${escHtml(post.author || '')} &middot; ${escHtml(post.date || '')}</small></p>
      <div class="blog-post-content">${post.content || escHtml(post.excerpt)}</div>
    </div></article>`;
}

function ssrFAQ(CMS) {
  const d = CMS.faq || {};
  return `
    <section class="page-content"><div class="container">
      <h1>${escHtml(d.title || 'Frequently Asked Questions')}</h1>
      ${(d.categories||[]).map(cat => `
        <section><h2>${escHtml(cat.name)}</h2>
          ${cat.questions.map(q => `<div class="faq-item"><h3>${escHtml(q.q)}</h3><p>${escHtml(q.a)}</p></div>`).join('')}
        </section>
      `).join('')}
    </div></section>`;
}

function ssrLocations(CMS) {
  const d = CMS.locations || {};
  return `
    <section class="locations-hero"><div class="container">
      <h1>${escHtml(d.title)}</h1><p>${escHtml(d.subtitle)}</p>
    </div></section>`;
}

function ssrContact(CMS) {
  const d = CMS.contact || {};
  return `
    <section class="contact-section"><div class="container">
      <h1>${escHtml(d.title)}</h1><p>${escHtml(d.subtitle)}</p>
      <p>Phone: ${escHtml((d.info||{}).phone)}</p>
      <p>Email: ${escHtml((d.info||{}).email)}</p>
      <p>Hours: ${escHtml((d.info||{}).hours)}</p>
    </div></section>`;
}

function ssrProductDetail(CMS, slug) {
  const d = CMS.products || {};
  const items = d.items || [];
  const item = items.find(i => i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug);
  if (!item) return '<section class="page-content"><div class="container"><h1>Product Not Found</h1></div></section>';
  return `
    <section class="page-content"><div class="container" style="max-width:800px;">
      <h1>${escHtml(item.name)}</h1>
      <p>${escHtml(item.description)}</p>
      <p class="product-price">${escHtml(item.price)}</p>
      <a href="/products">Back to Products</a>
    </div></section>`;
}

function renderPage(path, CMS) {
  const serviceMatch = path.match(/^\/services\/(\w+)$/);
  if (serviceMatch) return ssrService(CMS, serviceMatch[1]);

  const productMatch = path.match(/^\/products\/(.+)$/);
  if (productMatch) return ssrProductDetail(CMS, decodeURIComponent(productMatch[1]));

  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) return ssrBlogPost(CMS, decodeURIComponent(blogMatch[1]));

  const renderers = {
    '/': ssrHome,
    '/quote': ssrQuote,
    '/quote/commercial': (cms) => ssrQuote(cms, true),
    '/products': ssrProducts,
    '/about': ssrAbout,
    '/blog': ssrBlog,
    '/faq': ssrFAQ,
    '/locations': ssrLocations,
    '/contact': ssrContact,
    '/sh-admin': () => '',
  };
  const fn = renderers[path];
  return fn ? fn(CMS) : '';
}

function generateSitemap(baseUrl, CMS) {
  const staticRoutes = ['/', '/quote', '/quote/commercial', '/products', '/about', '/blog', '/faq', '/locations', '/contact'];
  const serviceRoutes = Object.keys(CMS.services || {}).map(k => `/services/${k}`);
  const productRoutes = ((CMS.products || {}).items || []).map(item =>
    '/products/' + item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  );
  const blogRoutes = ((CMS.blog || {}).posts || [])
    .filter(p => p.status === 'published' && p.slug)
    .map(p => '/blog/' + p.slug);
  const allRoutes = [...staticRoutes, ...serviceRoutes, ...productRoutes, ...blogRoutes];

  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  allRoutes.forEach(route => {
    const priority = route === '/' ? '1.0' : route.startsWith('/services') ? '0.8' : '0.6';
    const freq = route === '/' ? 'weekly' : 'monthly';
    xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  });
  xml += '</urlset>';
  return xml;
}

module.exports = { renderMetaTags, renderStructuredData, renderPage, generateSitemap };
