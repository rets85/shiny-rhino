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
Output TWO separate script blocks:

**LocalBusiness Schema:**
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
  "image": "https://myshinyrhino.com/logo.png"
}
</script>

**FAQPage Schema:**
Build this dynamically from the FAQ questions above. Use valid JSON-LD with @type FAQPage.

## Rules:
- Use {city} name 5-8 times naturally throughout the content
- Write 600-800 words total (excluding schema)
- Pure HTML only. No markdown. No code fences.
- No em dashes or en dashes. Use regular hyphens only.
- Schema JSON must be valid - escape all quotes properly
- Do NOT wrap output in ```html``` or any code blocks
