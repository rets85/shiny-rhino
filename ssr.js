// ============================================
// Server-Side Rendering for SEO
// Generates HTML content, meta tags, structured data for each route
// ============================================

const fs = require('fs');
const path = require('path');

function escHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function stripHtml(s) {
  if (!s) return '';
  return String(s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

// ============================================
// META TAGS - SEO-optimized titles & descriptions
// ============================================

function getMeta(path, CMS) {
  const g = CMS.global || {};
  const company = g.companyName || 'Shiny Rhino';
  const base = { siteName: company, phone: g.phone || '' };

  const metaMap = {
    '/': {
      title: `Professional Carpet Cleaning Services | ${company}`,
      description: 'Expert carpet, upholstery, tile, and floor cleaning for homes and businesses. IICRC certified technicians, eco-friendly products. Get your free instant quote today.',
      ...base
    },
    '/quote': {
      title: `Instant Carpet Cleaning Price Calculator | ${company}`,
      description: 'Get an instant, no-obligation quote for carpet cleaning, upholstery, tile, and more. See your exact price in seconds, no phone call required.',
      ...base
    },
    '/quote/commercial': {
      title: `Commercial Cleaning Services & Pricing | ${company}`,
      description: 'Custom cleaning packages for offices, retail, and commercial spaces. Build your service plan and see pricing instantly. Free commercial estimates.',
      ...base
    },
    '/products': {
      title: `Professional Cleaning Products for Home Use | ${company}`,
      description: 'Shop the same professional-grade cleaning products our technicians use. Carpet spotters, upholstery cleaners, and protective treatments delivered to your door.',
      ...base
    },
    '/about': {
      title: `About Shiny Rhino: 25+ Years of Cleaning Excellence`,
      description: 'Learn about our IICRC certified technicians, eco-friendly cleaning methods, and 25+ years of experience serving homes and businesses nationwide.',
      ...base
    },
    '/blog': {
      title: `Carpet Cleaning Tips & Expert Advice | ${company} Blog`,
      description: 'Expert carpet care tips, stain removal guides, and cleaning advice from our professional technicians. Keep your home cleaner and healthier.',
      ...base
    },
    '/faq': {
      title: `Carpet Cleaning FAQ: Your Questions Answered | ${company}`,
      description: 'Answers to common questions about carpet cleaning, pricing, drying times, pet stain removal, and more. Everything you need to know before booking.',
      ...base
    },
    '/locations': {
      title: `Find a Carpet Cleaning Location Near You | ${company}`,
      description: 'Find your local Shiny Rhino cleaning team. Enter your zip code to see service availability and schedule your appointment today.',
      ...base
    },
    '/contact': {
      title: `Contact Us: Schedule a Cleaning | ${company}`,
      description: 'Get in touch with Shiny Rhino. Call (484) 630-1533, email us, or fill out our contact form. We respond within 24 hours.',
      ...base
    },
    '/sh-admin': {
      title: `Admin Dashboard | ${company}`,
      description: 'Administration dashboard.',
      noIndex: true,
      ...base
    },
  };

  // Service pages - optimized titles with keywords
  const serviceMatch = path.match(/^\/services\/(\w+)$/);
  if (serviceMatch) {
    const key = serviceMatch[1];
    const svc = (CMS.services || {})[key];
    if (svc) {
      const serviceMeta = {
        carpet: {
          title: `Professional Carpet Cleaning Services | ${company}`,
          description: 'Deep carpet cleaning using truck-mounted hot water extraction. Remove allergens, stains, and bacteria. IICRC certified. Book your cleaning today.'
        },
        upholstery: {
          title: `Upholstery & Furniture Cleaning Services | ${company}`,
          description: 'Professional sofa, chair, and furniture cleaning. Safe for all fabric types. Remove allergens, stains, and odors. Get your free quote now.'
        },
        tile: {
          title: `Tile & Grout Cleaning and Sealing Services | ${company}`,
          description: 'Restore your tile and grout to like-new condition. High-pressure cleaning, grout color restoration, and professional sealing. Free estimates available.'
        },
        hardwood: {
          title: `Hardwood Floor Cleaning & Restoration | ${company}`,
          description: 'Safe, pH-balanced hardwood floor cleaning that protects your finish. Deep clean, buff, and condition your wood floors. Book today.'
        },
        rug: {
          title: `Area Rug Cleaning: Oriental & Fine Rug Care | ${company}`,
          description: 'Expert area rug cleaning for oriental, Persian, wool, and synthetic rugs. Individual assessment, gentle cleaning, and odor removal.'
        },
        stone: {
          title: `Natural Stone Cleaning, Sealing & Restoration | ${company}`,
          description: 'Professional marble, granite, travertine, and slate cleaning. Stone-safe products, stain removal, honing, polishing, and sealing services.'
        },
        water: {
          title: `24/7 Water Damage Restoration Services | ${company}`,
          description: 'Emergency water damage restoration available 24/7. Fast response, water extraction, structural drying, and full restoration. Call now.'
        },
        vehicle: {
          title: `Car, Boat & RV Interior Cleaning | ${company}`,
          description: 'Professional interior cleaning for cars, trucks, boats, and RVs. Deep extraction cleaning, stain removal, and odor elimination.'
        }
      };
      return {
        title: (serviceMeta[key] || {}).title || `${svc.title} | ${company}`,
        description: (serviceMeta[key] || {}).description || (svc.heroText || '').slice(0, 155),
        ...base
      };
    }
  }

  // Product detail pages
  const productMatch = path.match(/^\/products\/(.+)$/);
  if (productMatch) {
    const items = ((CMS.products || {}).items || []);
    const slug = decodeURIComponent(productMatch[1]);
    const item = items.find(i => i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug);
    if (item) {
      return {
        title: `${item.name} | ${company} Products`,
        description: (item.description || '').slice(0, 155) + ' Shop professional cleaning products.',
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
        title: seo.metaTitle || `${post.title} | ${company}`,
        description: (seo.metaDescription || post.excerpt || '').slice(0, 160),
        ogImage: seo.ogImage || '',
        ogType: 'article',
        ...base
      };
    }
  }

  return metaMap[path] || {
    title: `Professional Carpet & Floor Cleaning Services | ${company}`,
    description: 'Expert carpet, upholstery, tile, and floor cleaning services for homes and businesses. Get your free instant quote today.',
    ...base
  };
}

function renderMetaTags(path, CMS, baseUrl) {
  const meta = getMeta(path, CMS);
  const canonical = baseUrl + (path === '/' ? '' : path);
  const ogType = meta.ogType || 'website';
  const ogImage = meta.ogImage || (baseUrl + '/logo.png');

  return `
    <title>${escHtml(meta.title)}</title>
    <meta name="description" content="${escHtml(meta.description)}">
    <link rel="canonical" href="${escHtml(canonical)}">
    ${meta.noIndex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">'}
    <meta property="og:title" content="${escHtml(meta.title)}">
    <meta property="og:description" content="${escHtml(meta.description)}">
    <meta property="og:url" content="${escHtml(canonical)}">
    <meta property="og:type" content="${ogType}">
    <meta property="og:site_name" content="${escHtml(meta.siteName)}">
    <meta property="og:image" content="${escHtml(ogImage)}">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="${ogType === 'article' ? 'summary_large_image' : 'summary'}">
    <meta name="twitter:title" content="${escHtml(meta.title)}">
    <meta name="twitter:description" content="${escHtml(meta.description)}">
    <meta name="twitter:image" content="${escHtml(ogImage)}">`;
}

// ============================================
// STRUCTURED DATA - JSON-LD Schemas
// ============================================

function renderStructuredData(path, CMS, baseUrl) {
  const g = CMS.global || {};
  const company = g.companyName || 'Shiny Rhino';
  const schemas = [];

  // Organization/LocalBusiness schema (all pages)
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': baseUrl + '/#organization',
    'name': company,
    'telephone': g.phoneRaw || g.phone || '',
    'email': g.email || '',
    'url': baseUrl,
    'logo': baseUrl + '/logo.png',
    'image': baseUrl + '/logo.png',
    'description': 'Professional carpet, upholstery, tile, and floor cleaning services for homes and businesses. IICRC certified technicians with 25+ years of experience.',
    'priceRange': '$$',
    'openingHoursSpecification': [
      { '@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday'], 'opens': '07:00', 'closes': '20:00' },
      { '@type': 'OpeningHoursSpecification', 'dayOfWeek': 'Saturday', 'opens': '08:00', 'closes': '17:00' }
    ],
    'sameAs': [g.social?.facebook, g.social?.instagram, g.social?.tiktok, g.social?.youtube].filter(u => u && u !== '#'),
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Cleaning Services',
      'itemListElement': [
        { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Carpet Cleaning' }},
        { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Upholstery Cleaning' }},
        { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Tile & Grout Cleaning' }},
        { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Hardwood Floor Cleaning' }},
        { '@type': 'Offer', 'itemOffered': { '@type': 'Service', 'name': 'Water Damage Restoration' }}
      ]
    }
  };
  schemas.push(orgSchema);

  // WebSite schema with SearchAction (homepage)
  if (path === '/') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': company,
      'url': baseUrl,
      'publisher': { '@id': baseUrl + '/#organization' }
    });
  }

  // BreadcrumbList schema (all pages except home)
  const breadcrumbs = getBreadcrumbs(path, CMS, baseUrl);
  if (breadcrumbs.length > 1) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((bc, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': bc.name,
        'item': bc.url
      }))
    });
  }

  // Service schema for service pages
  const serviceMatch = path.match(/^\/services\/(\w+)$/);
  if (serviceMatch) {
    const key = serviceMatch[1];
    const svc = (CMS.services || {})[key];
    if (svc) {
      const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': svc.title,
        'description': svc.heroText || svc.content || '',
        'provider': { '@id': baseUrl + '/#organization' },
        'url': baseUrl + path,
        'serviceType': svc.title,
        'areaServed': { '@type': 'Country', 'name': 'United States' }
      };
      schemas.push(serviceSchema);

      // FAQPage schema for service FAQs
      if (svc.faq && svc.faq.length) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': svc.faq.map(q => ({
            '@type': 'Question',
            'name': q.q,
            'acceptedAnswer': { '@type': 'Answer', 'text': q.a }
          }))
        });
      }
    }
  }

  // BlogPosting schema for blog posts
  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    const posts = (CMS.blog || {}).posts || [];
    const post = posts.find(p => p.slug === decodeURIComponent(blogMatch[1]));
    if (post) {
      const wordCount = stripHtml(post.content || '').split(/\s+/).length;
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.title,
        'description': post.excerpt || '',
        'author': { '@type': 'Person', 'name': post.author || company },
        'publisher': {
          '@type': 'Organization',
          'name': company,
          'logo': { '@type': 'ImageObject', 'url': baseUrl + '/logo.png' }
        },
        'datePublished': post.date || '',
        'dateModified': post.date || '',
        'url': baseUrl + path,
        'mainEntityOfPage': { '@type': 'WebPage', '@id': baseUrl + path },
        'image': (post.seo || {}).ogImage || BLOG_IMAGES[decodeURIComponent(blogMatch[1])] || baseUrl + '/logo.png',
        'wordCount': wordCount
      });
    }
  }

  // Blog listing - CollectionPage schema
  if (path === '/blog') {
    const posts = ((CMS.blog || {}).posts || []).filter(p => p.status === 'published');
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Cleaning Tips & Expert Advice',
      'description': 'Expert carpet care tips, stain removal guides, and cleaning advice.',
      'url': baseUrl + '/blog',
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': posts.slice(0, 10).map((post, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'url': baseUrl + '/blog/' + post.slug
        }))
      }
    });
  }

  // FAQPage schema for FAQ page
  if (path === '/faq') {
    const allQuestions = [];
    ((CMS.faq || {}).categories || []).forEach(cat => {
      (cat.questions || []).forEach(q => {
        allQuestions.push({
          '@type': 'Question',
          'name': q.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': q.a }
        });
      });
    });
    if (allQuestions.length) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': allQuestions
      });
    }
  }

  // Product schema for products page
  if (path === '/products' || path.startsWith('/products/')) {
    const items = ((CMS.products || {}).items || []);
    if (path === '/products') {
      items.forEach(item => {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Product',
          'name': item.name,
          'description': item.description || '',
          'brand': { '@type': 'Brand', 'name': company },
          'offers': {
            '@type': 'Offer',
            'price': String(item.price || '').replace(/[^0-9.]/g, ''),
            'priceCurrency': 'USD',
            'availability': 'https://schema.org/InStock',
            'seller': { '@id': baseUrl + '/#organization' }
          }
        });
      });
    } else {
      const slug = decodeURIComponent(path.replace('/products/', ''));
      const item = items.find(i => i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug);
      if (item) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Product',
          'name': item.name,
          'description': item.description || '',
          'brand': { '@type': 'Brand', 'name': company },
          'offers': {
            '@type': 'Offer',
            'price': String(item.price || '').replace(/[^0-9.]/g, ''),
            'priceCurrency': 'USD',
            'availability': 'https://schema.org/InStock',
            'seller': { '@id': baseUrl + '/#organization' }
          }
        });
      }
    }
  }

  return schemas.map(s => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('\n    ');
}

function getBreadcrumbs(path, CMS, baseUrl) {
  const crumbs = [{ name: 'Home', url: baseUrl + '/' }];

  if (path === '/') return crumbs;

  const routeNames = {
    '/quote': 'Get a Quote',
    '/quote/commercial': 'Commercial Quote',
    '/products': 'Products',
    '/about': 'About Us',
    '/blog': 'Blog',
    '/faq': 'FAQ',
    '/locations': 'Locations',
    '/contact': 'Contact'
  };

  if (routeNames[path]) {
    crumbs.push({ name: routeNames[path], url: baseUrl + path });
    return crumbs;
  }

  const serviceMatch = path.match(/^\/services\/(\w+)$/);
  if (serviceMatch) {
    const svc = (CMS.services || {})[serviceMatch[1]];
    crumbs.push({ name: 'Services', url: baseUrl + '/services/carpet' });
    if (svc) crumbs.push({ name: svc.title, url: baseUrl + path });
    return crumbs;
  }

  const blogMatch = path.match(/^\/blog\/(.+)$/);
  if (blogMatch) {
    crumbs.push({ name: 'Blog', url: baseUrl + '/blog' });
    const post = ((CMS.blog || {}).posts || []).find(p => p.slug === decodeURIComponent(blogMatch[1]));
    if (post) crumbs.push({ name: post.title, url: baseUrl + path });
    return crumbs;
  }

  const productMatch = path.match(/^\/products\/(.+)$/);
  if (productMatch) {
    crumbs.push({ name: 'Products', url: baseUrl + '/products' });
    const items = ((CMS.products || {}).items || []);
    const slug = decodeURIComponent(productMatch[1]);
    const item = items.find(i => i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug);
    if (item) crumbs.push({ name: item.name, url: baseUrl + path });
    return crumbs;
  }

  return crumbs;
}

// ============================================
// PAGE CONTENT RENDERERS
// ============================================

const SERVICE_IMAGES = {
  carpet: 'https://images.unsplash.com/photo-1576523163790-18a073e1fb7e?w=600&h=400&fit=crop&q=75',
  upholstery: 'https://images.unsplash.com/photo-1519494140681-8b17d830a3e9?w=600&h=400&fit=crop&q=75',
  tile: 'https://images.unsplash.com/photo-1721564130772-c9ee561ab87b?w=600&h=400&fit=crop&q=75',
  hardwood: 'https://images.unsplash.com/photo-1722604828977-395d52c3cd23?w=600&h=400&fit=crop&q=75',
  rug: 'https://images.unsplash.com/photo-1695197943218-be1bb14b6894?w=600&h=400&fit=crop&q=75',
  stone: 'https://images.unsplash.com/photo-1762246433202-6e2cff902b1e?w=600&h=400&fit=crop&q=75',
  vehicle: 'https://images.unsplash.com/photo-1748569747438-b6b5f18a46b9?w=600&h=400&fit=crop&q=75',
  water: 'https://images.unsplash.com/photo-1632098725022-17e8c2916574?w=600&h=400&fit=crop&q=75'
};

const BLOG_IMAGES = {
  'how-to-remove-carpet-stains': 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&h=450&fit=crop&q=75',
  'how-often-professional-carpet-cleaning': 'https://images.unsplash.com/photo-1576523163790-18a073e1fb7e?w=800&h=450&fit=crop&q=75',
  'steam-cleaning-vs-dry-cleaning-carpet': 'https://images.unsplash.com/photo-1758273238947-7eb530b408e4?w=800&h=450&fit=crop&q=75',
  'get-rid-of-pet-odor-carpet': 'https://images.unsplash.com/photo-1481391032119-d89fee407e44?w=800&h=450&fit=crop&q=75',
  'complete-guide-cleaning-tile-grout': 'https://images.unsplash.com/photo-1721564130772-c9ee561ab87b?w=800&h=450&fit=crop&q=75',
  'hidden-spots-deep-cleaning': 'https://images.unsplash.com/photo-1627037118196-2a3c22a22eea?w=800&h=450&fit=crop&q=75',
  'year-round-deep-clean-schedule': 'https://images.unsplash.com/photo-1504115744733-85e946e6c323?w=800&h=450&fit=crop&q=75',
  'rental-vs-professional-carpet-cleaning': 'https://images.unsplash.com/photo-1758523670634-df4e12ed7a26?w=800&h=450&fit=crop&q=75',
  'dirty-upholstery-air-quality': 'https://images.unsplash.com/photo-1519494140681-8b17d830a3e9?w=800&h=450&fit=crop&q=75',
  'daily-habits-carpet-care': 'https://images.unsplash.com/photo-1550514704-b5f6163b466a?w=800&h=450&fit=crop&q=75',
  'pet-owners-guide-clean-floors': 'https://images.unsplash.com/photo-1722604828977-395d52c3cd23?w=800&h=450&fit=crop&q=75',
  'spring-carpet-deep-clean': 'https://images.unsplash.com/photo-1444012236767-1b471c68781c?w=800&h=450&fit=crop&q=75'
};

function ssrHome(CMS) {
  const d = CMS.home || {};
  const hero = d.hero || {};
  const services = CMS.services || {};
  const trust = d.trust || {};
  const stats = d.stats || [];
  const serviceKeys = ['carpet','upholstery','tile','hardwood','rug','stone','vehicle','water'];

  // Get latest blog posts for preview
  const blogPosts = ((CMS.blog || {}).posts || []).filter(p => p.status === 'published').slice(0, 3);

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
        <div class="services-grid">
          ${serviceKeys.map(key => {
            const svc = services[key];
            const img = SERVICE_IMAGES[key] || '';
            return svc ? `
            <a href="/services/${key}" class="service-tile" data-link>
              <img src="${img}" alt="${escHtml(svc.title)}" width="600" height="400" class="service-tile-img" loading="lazy">
              <div class="service-tile-overlay"></div>
              <div class="service-tile-content"><h3>${escHtml(svc.title)}</h3></div>
            </a>` : '';
          }).join('')}
        </div>
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
    </div></section>
    ${blogPosts.length ? `
    <section class="blog-preview-section"><div class="container">
      <h2 class="section-title">Latest Cleaning Tips & Advice</h2>
      <div class="blog-preview-grid">
        ${blogPosts.map(post => `
          <article class="blog-preview-card">
            <h3><a href="/blog/${escHtml(post.slug)}" data-link>${escHtml(post.title)}</a></h3>
            <p>${escHtml(post.excerpt)}</p>
            <a href="/blog/${escHtml(post.slug)}" data-link class="read-more">Read More</a>
          </article>
        `).join('')}
      </div>
      <div style="text-align:center;margin-top:2rem;"><a href="/blog" data-link class="btn btn-outline">View All Articles</a></div>
    </div></section>` : ''}`;
}

function ssrService(CMS, key) {
  const svc = (CMS.services || {})[key];
  if (!svc) return '<h1>Service Not Found</h1>';
  return `
    <section class="service-hero">
      <div class="container">
        <h1>${escHtml(svc.title)}</h1>
        <p>${escHtml(svc.heroText)}</p>
        <a href="/quote" data-link class="btn btn-primary btn-lg">Get Your Free Quote</a>
      </div>
    </section>
    <section class="service-content">
      <div class="container container--narrow">
        <h2>Why Choose ${escHtml(svc.title)} from Shiny Rhino</h2>
        <p>${escHtml(svc.content)}</p>
        ${(svc.features||[]).map(f => `<div class="feature-card"><h3>${escHtml(f.title)}</h3><p>${escHtml(f.description)}</p></div>`).join('')}
      </div>
    </section>
    ${svc.process ? `<section class="process-section"><div class="container">
      <h2 class="section-title">${escHtml(svc.process.title)}</h2>
      <div class="process-steps">
      ${svc.process.steps.map((step,i) => `<div class="process-step"><div class="step-number">${i+1}</div><h3>${escHtml(step.title)}</h3><p>${escHtml(step.description)}</p></div>`).join('')}
      </div>
    </div></section>` : ''}
    ${svc.faq && svc.faq.length ? `<section class="faq-section"><div class="container">
      <h2 class="section-title">Frequently Asked Questions About ${escHtml(svc.title)}</h2>
      ${svc.faq.map(q => `<div class="faq-item"><h3>${escHtml(q.q)}</h3><p>${escHtml(q.a)}</p></div>`).join('')}
    </div></section>` : ''}
    ${svc.commercial ? `<section class="cta-section"><div class="container">
      <h2>${escHtml(svc.commercial.title)}</h2><p>${escHtml(svc.commercial.description)}</p>
      <a href="/quote/commercial" data-link class="btn btn-primary">Get Commercial Quote</a>
    </div></section>` : ''}`;
}

function ssrQuote(CMS, isCommercial) {
  const pricing = CMS.pricing || { categories: [] };
  return `
    <section class="calc-page">
      <div class="calc-header${isCommercial ? ' calc-header--biz' : ''}">
        ${isCommercial
          ? '<h1>Commercial Cleaning Services Pricing</h1><p>Custom pricing for offices, facilities &amp; commercial spaces. Build your service package below.</p>'
          : '<h1>Carpet Cleaning Price Calculator</h1><p>Pick your items, see your price instantly. No hassle, no surprises, no obligation.</p>'}
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
      <p class="section-subtitle">The same professional-grade products our technicians trust, now available for your home.</p>
      <div class="products-grid">
        ${(d.items||[]).map(item => {
          const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return `
          <div class="product-card">
            <h3><a href="/products/${slug}" data-link>${escHtml(item.name)}</a></h3>
            <p>${escHtml(item.description)}</p>
            <p class="product-price">${escHtml(item.price)}</p>
          </div>`;
        }).join('')}
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
      ${(d.sections||[]).map(sec => `<div class="about-section"><h2>${escHtml(sec.title)}</h2><p>${escHtml(sec.text)}</p></div>`).join('')}
    </div></section>`;
}

function ssrBlog(CMS) {
  const d = CMS.blog || {};
  const posts = (d.posts || []).filter(p => p.status === 'published');
  return `
    <section class="hero hero--gradient"><div class="container hero-content hero-content--center">
      <h1>Carpet Cleaning Tips &amp; Expert Advice</h1>
      <p class="hero-sub">Practical guides, stain removal tips, and expert insights to help you maintain a cleaner, healthier home.</p>
    </div></section>
    <section class="blog-section"><div class="container">
      ${posts.map(post => {
        const img = BLOG_IMAGES[post.slug] || '';
        return `
        <article class="blog-card">
          ${img ? `<a href="/blog/${escHtml(post.slug)}" data-link><img src="${img}" alt="${escHtml(post.title)}" width="800" height="450" class="blog-card-img" loading="lazy"></a>` : ''}
          <h2><a href="/blog/${escHtml(post.slug)}" data-link>${escHtml(post.title)}</a></h2>
          <p class="blog-meta"><span>${escHtml(post.author || '')}</span> &middot; <time datetime="${escHtml(post.date || '')}">${escHtml(post.date || '')}</time>${post.category ? ` &middot; <span>${escHtml(post.category)}</span>` : ''}</p>
          <p>${escHtml(post.excerpt)}</p>
          <a href="/blog/${escHtml(post.slug)}" data-link class="read-more">Read More</a>
        </article>`;
      }).join('')}
    </div></section>`;
}

function ssrBlogPost(CMS, slug) {
  const posts = (CMS.blog || {}).posts || [];
  const post = posts.find(p => p.slug === slug);
  if (!post) return '<section class="page-content"><div class="container"><h1>Post Not Found</h1></div></section>';

  // Get related posts (same category, excluding current)
  const related = posts.filter(p => p.status === 'published' && p.slug !== slug && p.category === post.category).slice(0, 3);

  return `
    <article class="blog-post"><div class="container blog-post-container">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/" data-link>Home</a> &rsaquo; <a href="/blog" data-link>Blog</a> &rsaquo; <span>${escHtml(post.title)}</span></nav>
      <h1>${escHtml(post.title)}</h1>
      <div class="blog-meta"><span>By ${escHtml(post.author || '')}</span> &middot; <time datetime="${escHtml(post.date || '')}">${escHtml(post.date || '')}</time>${post.category ? ` &middot; <span class="blog-category">${escHtml(post.category)}</span>` : ''}</div>
      ${BLOG_IMAGES[slug] ? `<img src="${BLOG_IMAGES[slug]}" alt="${escHtml(post.title)}" width="800" height="450" class="blog-post-hero-img">` : ''}
      <div class="blog-post-content">${post.content || escHtml(post.excerpt)}</div>
      <div class="blog-post-cta">
        <h3>Ready for a Professional Clean?</h3>
        <p>Get an instant, no-obligation quote and see how affordable professional cleaning can be.</p>
        <a href="/quote" data-link class="btn btn-primary">Get Your Free Quote</a>
      </div>
    </div></article>
    ${related.length ? `
    <section class="related-posts"><div class="container">
      <h2>Related Articles</h2>
      <div class="blog-preview-grid">
        ${related.map(r => `
          <article class="blog-preview-card">
            <h3><a href="/blog/${escHtml(r.slug)}" data-link>${escHtml(r.title)}</a></h3>
            <p>${escHtml(r.excerpt)}</p>
          </article>
        `).join('')}
      </div>
    </div></section>` : ''}`;
}

function ssrFAQ(CMS) {
  const d = CMS.faq || {};
  return `
    <section class="page-content"><div class="container">
      <h1>Carpet Cleaning FAQ: Your Questions Answered</h1>
      <p class="section-subtitle">Find answers to the most common questions about our cleaning services, pricing, and process.</p>
      ${(d.categories||[]).map(cat => `
        <section class="faq-category"><h2>${escHtml(cat.name)}</h2>
          ${cat.questions.map(q => `<div class="faq-item"><h3>${escHtml(q.q)}</h3><p>${escHtml(q.a)}</p></div>`).join('')}
        </section>
      `).join('')}
      <div class="faq-cta">
        <h2>Still Have Questions?</h2>
        <p>Our team is happy to help. Give us a call or send a message.</p>
        <div class="hero-buttons">
          <a href="/contact" data-link class="btn btn-primary">Contact Us</a>
          <a href="tel:4846301533" class="btn btn-outline">Call (484) 630-1533</a>
        </div>
      </div>
    </div></section>`;
}

function ssrLocations(CMS) {
  const d = CMS.locations || {};
  const locDir = path.join(__dirname, 'public', 'locations');

  // Scan for generated state directories
  let stateCards = '';
  if (fs.existsSync(locDir)) {
    const states = fs.readdirSync(locDir)
      .filter(f => {
        const full = path.join(locDir, f);
        return fs.statSync(full).isDirectory() && /^[a-z]/.test(f);
      })
      .map(slug => {
        const cityCount = fs.readdirSync(path.join(locDir, slug)).filter(f => f.endsWith('.html')).length;
        const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return { slug, name, cityCount };
      })
      .filter(s => s.cityCount > 0)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (states.length > 0) {
      stateCards = `
      <section class="page-content"><div class="container">
        <h2 class="section-title">Browse by State</h2>
        <p class="section-subtitle">Select your state to find carpet cleaning services near you.</p>
        <div class="loc-state-grid">
          ${states.map(s => `<a href="/locations/${s.slug}" class="loc-state-card">${escHtml(s.name)}<span class="loc-state-count">${s.cityCount} cities</span></a>`).join('')}
        </div>
      </div></section>`;
    }
  }

  return `
    <section class="locations-hero"><div class="container">
      <h1>${escHtml(d.title || 'Find a Carpet Cleaning Location Near You')}</h1>
      <p>${escHtml(d.subtitle || 'Professional carpet cleaning services in cities across the United States. Select your state to get started.')}</p>
    </div></section>
    ${stateCards}`;
}

function ssrContact(CMS) {
  const d = CMS.contact || {};
  return `
    <section class="contact-section"><div class="container">
      <h1>${escHtml(d.title)}</h1><p>${escHtml(d.subtitle)}</p>
      <div class="contact-info">
        <div><h3>Phone</h3><p><a href="tel:4846301533">${escHtml((d.info||{}).phone)}</a></p></div>
        <div><h3>Email</h3><p><a href="mailto:${escHtml((d.info||{}).email)}">${escHtml((d.info||{}).email)}</a></p></div>
        <div><h3>Hours</h3><p>${escHtml((d.info||{}).hours)}</p></div>
      </div>
    </div></section>`;
}

function ssrProductDetail(CMS, slug) {
  const d = CMS.products || {};
  const items = d.items || [];
  const item = items.find(i => i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug);
  if (!item) return '<section class="page-content"><div class="container"><h1>Product Not Found</h1></div></section>';
  return `
    <section class="page-content"><div class="container" style="max-width:800px;">
      <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/" data-link>Home</a> &rsaquo; <a href="/products" data-link>Products</a> &rsaquo; <span>${escHtml(item.name)}</span></nav>
      <h1>${escHtml(item.name)}</h1>
      <p>${escHtml(item.description)}</p>
      <p class="product-price">${escHtml(item.price)}</p>
      <a href="/products" data-link class="btn btn-outline">Back to Products</a>
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

// ============================================
// SITEMAP
// ============================================

function generateSitemap(baseUrl, CMS) {
  const staticRoutes = [
    { path: '/', priority: '1.0', freq: 'weekly' },
    { path: '/quote', priority: '0.9', freq: 'monthly' },
    { path: '/quote/commercial', priority: '0.8', freq: 'monthly' },
    { path: '/products', priority: '0.7', freq: 'weekly' },
    { path: '/about', priority: '0.6', freq: 'monthly' },
    { path: '/blog', priority: '0.8', freq: 'daily' },
    { path: '/faq', priority: '0.7', freq: 'monthly' },
    { path: '/locations', priority: '0.7', freq: 'monthly' },
    { path: '/contact', priority: '0.6', freq: 'monthly' },
  ];

  const serviceRoutes = Object.keys(CMS.services || {}).map(k => ({
    path: `/services/${k}`, priority: '0.8', freq: 'monthly'
  }));

  const productRoutes = ((CMS.products || {}).items || []).map(item => ({
    path: '/products/' + item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    priority: '0.5', freq: 'monthly'
  }));

  const blogRoutes = ((CMS.blog || {}).posts || [])
    .filter(p => p.status === 'published' && p.slug)
    .map(p => ({
      path: '/blog/' + p.slug,
      priority: '0.7',
      freq: 'weekly'
    }));

  // Location pages - scan filesystem for generated pages
  const locationRoutes = [];
  const locDir = path.join(__dirname, 'public', 'locations');
  if (fs.existsSync(locDir)) {
    const stateDirs = fs.readdirSync(locDir).filter(f => {
      const full = path.join(locDir, f);
      return fs.statSync(full).isDirectory() && /^[a-z]/.test(f);
    });
    for (const stateSlug of stateDirs) {
      locationRoutes.push({ path: `/locations/${stateSlug}`, priority: '0.6', freq: 'monthly' });
      const cityFiles = fs.readdirSync(path.join(locDir, stateSlug)).filter(f => f.endsWith('.html'));
      for (const cityFile of cityFiles) {
        locationRoutes.push({
          path: `/locations/${stateSlug}/${cityFile.replace('.html', '')}`,
          priority: '0.5',
          freq: 'monthly'
        });
      }
    }
  }

  const allRoutes = [...staticRoutes, ...serviceRoutes, ...productRoutes, ...blogRoutes, ...locationRoutes];

  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  allRoutes.forEach(route => {
    xml += `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.freq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
  });
  xml += '</urlset>';
  return xml;
}

module.exports = { renderMetaTags, renderStructuredData, renderPage, generateSitemap };
