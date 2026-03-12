You are writing the THIRD and final section of a carpet cleaning location page for Shiny Rhino, a professional carpet and deep cleaning company. This page targets {city}, {state}.

Write PURE HTML content (no markdown, no code fences, no DOCTYPE/html/head/body tags). Output ONLY the HTML content that goes inside the page body.

## Required Structure (in this exact order):

### 1. H2: "Frequently Asked Questions About Carpet Cleaning in {city}"
Write 6-8 FAQ items using this exact HTML structure:

<div class="loc-faq">
  <div class="loc-faq-item">
    <h3 class="loc-faq-q">Question text here?</h3>
    <div class="loc-faq-a"><p>Answer text here.</p></div>
  </div>
</div>

Required FAQ topics (make answers specific to {city} area):
1. How long does professional carpet cleaning take?
2. How often should I have my carpets professionally cleaned?
3. Is professional carpet cleaning safe for pets and children?
4. How long until carpets are dry after cleaning?
5. Do you move furniture during cleaning?
6. What is the best carpet cleaning method?
Plus 2 questions specific to {city} or {state} (local climate, common issues, etc.)

### 2. H2: "Why Choose Shiny Rhino in {city}"
- 3-4 bullet points or short paragraphs about company differentiators:
  - IICRC-certified technicians
  - Truck-mounted hot water extraction equipment
  - Transparent pricing with no hidden fees
  - 100% satisfaction guarantee
  - Locally operated, serving {city} and surrounding areas

### 3. H2: "Schedule Your Carpet Cleaning in {city} Today"
- CTA section with 1-2 paragraphs encouraging the reader to book
- Include this exact HTML for the CTA buttons:

<div class="loc-cta-buttons">
  <a href="/quote" class="btn btn-primary btn-lg">Get Your Free Quote</a>
  <a href="tel:4846301533" class="btn btn-outline btn-lg">Call (484) 630-1533</a>
</div>

### 4. Schema Markup (output at the very end, after all visible content)
Output FOUR separate script blocks with full structured data:

**Schema 1 - LocalBusiness:**
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Shiny Rhino - {city}",
  "description": "Professional carpet cleaning and deep cleaning services in {city}, {state}",
  "url": "https://myshinyrhino.com/locations/{state_slug}/{city_slug}",
  "telephone": "+14846301533",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "{city}",
    "addressRegion": "{state_abbrev}",
    "addressCountry": "US"
  },
  "areaServed": {
    "@type": "City",
    "name": "{city}, {state}"
  },
  "priceRange": "$$",
  "image": "https://myshinyrhino.com/logo.png",
  "openingHoursSpecification": [
    {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "07:00", "closes": "20:00"},
    {"@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "08:00", "closes": "17:00"}
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Cleaning Services",
    "itemListElement": [
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Carpet Cleaning", "url": "https://myshinyrhino.com/services/carpet"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Upholstery Cleaning", "url": "https://myshinyrhino.com/services/upholstery"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Tile & Grout Cleaning", "url": "https://myshinyrhino.com/services/tile"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Hardwood Floor Cleaning", "url": "https://myshinyrhino.com/services/hardwood"}},
      {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Water Damage Restoration", "url": "https://myshinyrhino.com/services/water"}}
    ]
  }
}
</script>

**Schema 2 - FAQPage:**
Build this dynamically from ALL the FAQ questions above. Use this exact format:
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text here."
      }
    }
  ]
}
</script>

**Schema 3 - Service:**
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Professional Carpet Cleaning in {city}",
  "description": "IICRC-certified carpet cleaning, upholstery cleaning, tile and grout cleaning services in {city}, {state_abbrev}",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Shiny Rhino",
    "url": "https://myshinyrhino.com"
  },
  "areaServed": {
    "@type": "City",
    "name": "{city}",
    "containedInPlace": {
      "@type": "State",
      "name": "{state}"
    }
  },
  "serviceType": "Carpet Cleaning",
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "25",
    "highPrice": "300",
    "priceCurrency": "USD"
  }
}
</script>

**Schema 4 - WebPage:**
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Carpet Cleaning in {city}, {state_abbrev}",
  "description": "Professional carpet cleaning services in {city}, {state_abbrev}. Hot water extraction, upholstery cleaning, tile and grout.",
  "url": "https://myshinyrhino.com/locations/{state_slug}/{city_slug}",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Shiny Rhino",
    "url": "https://myshinyrhino.com"
  },
  "about": {
    "@type": "City",
    "name": "{city}, {state}"
  }
}
</script>

## Writing Style (CRITICAL for SEO):
- Write in SHORT, self-contained paragraphs of 30-50 words each
- Each paragraph should make ONE clear point that can stand alone as a quotable passage
- Avoid walls of text over 100 words per paragraph
- Use clear topic sentences that answer specific questions a searcher might ask
- FAQ answers should be concise (2-3 sentences) and directly answer the question

## Rules:
- Use {city} name 5-8 times naturally throughout the content
- Write 600-800 words total (excluding schema)
- Pure HTML only. No markdown. No code fences.
- No em dashes or en dashes. Use regular hyphens only.
- Schema JSON must be valid - escape all quotes properly
- Include ALL FOUR schema blocks (LocalBusiness, FAQPage, Service, WebPage)
- FAQPage schema must include EVERY FAQ question/answer from the content above
- Do NOT wrap output in ```html``` or any code blocks
