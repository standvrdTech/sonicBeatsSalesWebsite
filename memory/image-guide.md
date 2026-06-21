---
name: image-guide
description: Where to put images for each section of the SonicBeats website — hero, collection, compare, gallery
metadata:
  type: reference
---

# SonicBeats — Image Guide

All product data lives in **`js/catalog.js`**. Images are referenced from there and used automatically across every section. You never touch HTML to add a product — only the catalog file and the image folder.

---

## Adding a new product (hero + collection + compare)

1. Drop the product photo into **`assets/slides/`**
   - Name it after the product slug, e.g. `assets/slides/vega.webp`
   - Recommended: at least 1920×1080px, WebP format, dark/transparent background so it blends into the slide overlay

2. Open **`js/catalog.js`** and add a new entry to `CATALOG`:
   ```js
   {
     slug: 'vega',
     name: 'Vega',
     series: 'COSMIC SERIES',
     tagline: 'Your tagline here.',
     price: 'From €999',
     desc: 'Product description...',
     features: ['Feature 1', 'Feature 2', 'Feature 3', 'Lifetime warranty'],
     specs: [
       { label: 'Price',        value: 'From €999' },
       { label: 'Battery',      value: '20 hours' },
       { label: 'Connectivity', value: 'Bluetooth 5.2' },
       { label: 'Materials',    value: 'Your materials' },
       { label: 'Driver',       value: '3″ Full Range' },
       { label: 'Warranty',     value: 'Lifetime' },
     ],
     img: 'assets/slides/vega.webp',   // ← the image you just dropped in
     inCollection: true,   // show in the Collection section grid
     inCompare: true,      // show in the Compare models tabs
   },
   ```

3. Save. The product appears in:
   - **Hero slideshow** (always — every product in CATALOG gets a slide)
   - **Collection grid** (if `inCollection: true`)
   - **Compare tabs** (if `inCompare: true`)

---

## Section-by-section image locations

| Section | Folder | Used in |
|---|---|---|
| Hero slideshow | `assets/slides/` | Full-bleed background per slide |
| Collection cards | `assets/slides/` | Same image, cover-cropped to card |
| Compare panels | `assets/slides/` | Same image, cover-cropped to panel |
| Gallery | `assets/gallery/` | Separate lifestyle/workshop photos |

> **One image, three sections.** The same file in `assets/slides/` is reused for the hero, collection card thumbnail, and compare panel visual. You only need one photo per product.

---

## Adding gallery photos

Gallery photos are **separate** from product shots — they're lifestyle images, workshop shots, or detail close-ups.

1. Drop photos into **`assets/gallery/`**
   - e.g. `assets/gallery/workshop-bench.webp`
   - Recommended: at least 1200×900px, WebP format

2. Open **`js/catalog.js`** and add an entry to `GALLERY`:
   ```js
   { img: 'assets/gallery/workshop-bench.webp', label: 'The Workshop', size: '' },
   ```

   `size` controls the grid layout:
   - `''` — square tile (default)
   - `'tall'` — portrait tile, spans 2 rows
   - `'wide'` — landscape tile, spans 2 columns

3. Save. The photo appears in the Gallery section automatically.

---

## Story section image

The story section has a placeholder SVG on the right side. To replace it with a real photo:
- Put the image at `assets/story/workshop.webp` (any name)
- In `index.html`, find `<div class="story__img-placeholder">` and replace it with:
  ```html
  <img src="assets/story/workshop.webp" alt="The SonicBeats Workshop" style="width:100%;height:100%;object-fit:cover;border-radius:2px;" />
  ```

---

## Image tips

- **Format**: WebP is preferred for performance. JPEG/PNG also work.
- **Size**: Hero images should be at least 1920×1080. Collection cards display at 240px tall. Gallery items can be any aspect ratio — the CSS handles cropping.
- **Dark subjects work best**: The hero slideshow uses a dark vignette overlay for text readability. Images with dark backgrounds or dark subjects blend most naturally.
- **No white edges**: Images are used as CSS `background-image` with `background-size: cover`, so there are no visible image borders or edges.
