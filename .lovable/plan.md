

## Plan: Full SEO Optimization

### Overview
Comprehensive SEO overhaul across `index.html`, component headings, image alt texts, and static files.

### Changes

**1. `index.html` — Meta tags, Schema, Fonts**
- Update `<title>` to specified value
- Add/replace: meta description, keywords, robots, canonical
- Update all OG tags (og:title, og:description, og:image using the collage image from `productImages`, og:url, og:type)
- Update Twitter card tags
- Add JSON-LD `<script>` for LocalBusiness schema
- Add JSON-LD `<script>` for 3 Product schemas (Athana Mirch ₹100/300g, Desi Mirch ₹100/300g, Nimbu Mitha Chatani)
- Add Cormorant Garamond to existing Google Fonts link (if not already present — checking existing font imports)

**2. `src/components/hero/HeroContent.tsx` — H1 tag**
- Change the H1 content from "Flavours of Tradition. / Taste of Home." to "Homemade Aachar & Papad — Marwad Maratha" (visually styled the same way)

**3. `src/components/products/ProductShowcaseHeader.tsx` — H2 tag**
- Change H2 from "Most Preferred Products" to "Our Products"

**4. `src/components/story/StorySection.tsx` — H2 tags**
- Change "From Our Family Kitchen to Your Home" → "About Marwad Maratha"
- Change "Loved by Families" → "Customer Reviews"

**5. `src/components/why-choose/WhyChooseSection.tsx` — H2 tag**
- Change heading to include "Why Choose Us" (replace "Rooted in Tradition. Crafted with Care.")

**6. `src/components/contact/ContactSection.tsx` — H2 tag**
- Change "Get in Touch" → "Contact Us"

**7. `src/components/layout/Navbar.tsx` — Logo alt text**
- Update logo `alt` to specified brand alt text

**8. `src/components/products/ProductCard.tsx` — Image alt text**
- Product images already use `product.name` as alt. The specific alt texts for named products will be handled by updating the product data or adding a mapping for known product names.

**9. `src/components/products/productData.ts` — Add alt text fields**
- Add `altText` property to Athana Mirch, Desi Mirch, Nimbu Mitha products with the specified SEO alt texts

**10. `src/components/hero/HeroCarousel.tsx` — Image alt texts**
- Update alt text for collage/product images to match specified values
- Add `width` and `height` attributes to hero images

**11. `public/sitemap.xml` — New file**
- Create with URLs: `/`, `/products`, `/about`, `/contact` under `https://marwadmaratha.in`

**12. `public/robots.txt` — Update**
- Simplify to `User-agent: * / Allow: / / Sitemap: https://marwadmaratha.in/sitemap.xml`

**13. Image performance**
- Verify `loading="lazy"` on below-fold images (already present on most)
- Add explicit `width`/`height` to product card images and hero images to prevent CLS

### Files Touched
- `index.html` (meta, schema, fonts)
- `src/components/hero/HeroContent.tsx` (H1)
- `src/components/hero/HeroCarousel.tsx` (alt texts, dimensions)
- `src/components/products/ProductShowcaseHeader.tsx` (H2)
- `src/components/products/ProductCard.tsx` (alt text + dimensions)
- `src/components/products/productData.ts` (altText fields)
- `src/components/story/StorySection.tsx` (H2s)
- `src/components/why-choose/WhyChooseSection.tsx` (H2)
- `src/components/contact/ContactSection.tsx` (H2)
- `src/components/layout/Navbar.tsx` (logo alt)
- `src/components/layout/Footer.tsx` (no heading changes needed)
- `public/sitemap.xml` (new)
- `public/robots.txt` (update)

