/**
 * catalog.js — single source of truth for all SonicBeats products and gallery shots.
 *
 * HOW TO ADD A NEW PRODUCT:
 *   1. Drop the product image into assets/slides/   (e.g. assets/slides/vega.webp)
 *   2. Add an entry to CATALOG below — copy any existing entry as a template.
 *   3. Set inCollection: true to show it in the Collection grid.
 *   4. Set inCompare: true to show it in the Compare tab.
 *   5. Save. Done — the hero, collection, and compare sections update automatically.
 *
 * HOW TO ADD A GALLERY PHOTO:
 *   1. Drop the image into assets/gallery/   (e.g. assets/gallery/new-shot.webp)
 *   2. Add an entry to GALLERY below.
 *   3. Use size: 'tall' for portrait, size: 'wide' for landscape panoramas, or '' for square.
 */

const CATALOG = [
  {
    slug: 'enigma',
    name: 'Enigma',
    series: 'ARTIFACT SERIES',
    tagline: 'Bold design. Powerful performance.',
    price: 'From €895',
    desc: 'The Enigma is our statement piece — a bold geometric form with handcrafted walnut sides and a precision-tuned lattice grille. Built for those who want their sound system to command a room.',
    features: ['Battery: 18 hours', 'Bluetooth 5.0', 'Handcrafted walnut & steel', 'Lifetime warranty'],
    specs: [
      { label: 'Price',        value: 'From €895' },
      { label: 'Battery',      value: '18 hours' },
      { label: 'Connectivity', value: 'Bluetooth 5.0' },
      { label: 'Materials',    value: 'Walnut & Steel' },
      { label: 'Driver',       value: '3″ Full Range + Tweeter' },
      { label: 'Warranty',     value: 'Lifetime' },
    ],
    img: 'assets/slides/enigma.webp',
    inCollection: true,
    inCompare: true,
  },
  {
    slug: 'infinity',
    name: 'Infinity',
    series: 'SPHERE SERIES',
    tagline: 'Timeless materials. Endless sound.',
    price: 'From €1,190',
    desc: 'A perfect sphere of marble and brass, the Infinity delivers 360° omnidirectional sound. It fills a room evenly — no sweet spot required. For those who live in sound.',
    features: ['360° omnidirectional sound', 'Marble & brass finish', 'Wi-Fi + Bluetooth 5.2', 'Lifetime warranty'],
    specs: [
      { label: 'Price',        value: 'From €1,190' },
      { label: 'Sound',        value: '360° Omnidirectional' },
      { label: 'Connectivity', value: 'Wi-Fi + Bluetooth 5.2' },
      { label: 'Materials',    value: 'Marble & Brass' },
      { label: 'Driver',       value: 'Coaxial 360° Array' },
      { label: 'Warranty',     value: 'Lifetime' },
    ],
    img: 'assets/slides/infinity.webp',
    inCollection: true,
    inCompare: true,
  },
  {
    slug: 'tinymen',
    name: 'TinyMen',
    series: 'PORTABLE SERIES',
    tagline: 'Compact in size. Big on experience.',
    price: 'From €395',
    desc: "Don't let the size fool you. The TinyMen packs 30 hours of audio into a pocket-sized IP67-rated body. The same obsessive tuning process, just scaled for adventure.",
    features: ['Pocket-sized powerhouse', 'IP67 waterproof', '30h battery life', 'Lifetime warranty'],
    specs: [
      { label: 'Price',        value: 'From €395' },
      { label: 'Battery',      value: '30 hours' },
      { label: 'Connectivity', value: 'Bluetooth 5.1' },
      { label: 'Rating',       value: 'IP67 Waterproof' },
      { label: 'Driver',       value: '2″ Full Range' },
      { label: 'Warranty',     value: 'Lifetime' },
    ],
    img: 'assets/slides/tinymen.webp',
    inCollection: true,
    inCompare: true,
  },
  {
    slug: 'blackbox',
    name: 'BlackBox',
    series: 'STUDIO SERIES',
    tagline: 'Deep bass. Cinematic immersion.',
    price: 'From €990',
    desc: 'A low-profile soundbar with an integrated subwoofer and matte carbon body. The BlackBox delivers cinematic bass that you feel in your chest — engineered for studio-grade immersion.',
    features: ['Subwoofer integrated', 'Matte carbon finish', 'Room-filling stereo', 'Lifetime warranty'],
    specs: [
      { label: 'Price',        value: 'From €990' },
      { label: 'Bass',         value: 'Integrated Subwoofer' },
      { label: 'Connectivity', value: 'Bluetooth 5.0 + Optical' },
      { label: 'Materials',    value: 'Matte Carbon' },
      { label: 'Driver',       value: 'Stereo + 5″ Subwoofer' },
      { label: 'Warranty',     value: 'Lifetime' },
    ],
    img: 'assets/slides/blackbox.webp',
    inCollection: true,
    inCompare: true,
  },
  {
    slug: 'normandie',
    name: 'Normandie',
    series: 'HERITAGE SERIES',
    tagline: 'European luxury. Uncompromised fidelity.',
    price: 'From €1,450',
    desc: 'The Normandie draws from a century of European craftsmanship. Hand-lacquered oak, hand-wound drivers, and a sound character that ages like fine wine.',
    features: ['Hand-lacquered oak', 'Hand-wound drivers', 'Audiophile-grade crossover', 'Lifetime warranty'],
    specs: [
      { label: 'Price',        value: 'From €1,450' },
      { label: 'Battery',      value: '22 hours' },
      { label: 'Connectivity', value: 'Bluetooth 5.2 + AUX' },
      { label: 'Materials',    value: 'Oak & Linen' },
      { label: 'Driver',       value: '4″ Full Range + Tweeter' },
      { label: 'Warranty',     value: 'Lifetime' },
    ],
    img: 'assets/slides/normandie.webp',
    inCollection: false,
    inCompare: false,
  },
  {
    slug: 'aurora',
    name: 'Aurora',
    series: 'LIMITED EDITION',
    tagline: 'Sound that fills the sky.',
    price: 'From €2,100',
    desc: 'Our most exclusive model. The Aurora is a limited-edition statement of light and sound — illuminated panels, matched driver pairs, and a form unlike anything else we have made.',
    features: ['Illuminated panels', 'Matched driver pairs', 'Limited to 50 units', 'Lifetime warranty'],
    specs: [
      { label: 'Price',        value: 'From €2,100' },
      { label: 'Edition',      value: 'Limited — 50 units' },
      { label: 'Connectivity', value: 'Wi-Fi + Bluetooth 5.3' },
      { label: 'Lighting',     value: 'Ambient LED array' },
      { label: 'Driver',       value: 'Matched Pair 3.5″ + Tweeter' },
      { label: 'Warranty',     value: 'Lifetime' },
    ],
    img: 'assets/slides/aurora.webp',
    inCollection: false,
    inCompare: false,
  },
  {
    slug: 'donager',
    name: 'Donager',
    series: 'LIMITED EDITION',
    tagline: 'Raw power. Refined soul.',
    price: 'From €1,750',
    desc: 'The Donager is built for those who demand presence. A striking industrial form with deep resonance and a soul that fills any space.',
    features: ['Industrial steel casing', 'Deep resonance tuning', 'Bluetooth 5.2', 'Lifetime warranty'],
    specs: [
      { label: 'Price',        value: 'From €1,750' },
      { label: 'Battery',      value: '20 hours' },
      { label: 'Connectivity', value: 'Bluetooth 5.2' },
      { label: 'Materials',    value: 'Industrial Steel' },
      { label: 'Driver',       value: '4″ Full Range + Sub' },
      { label: 'Warranty',     value: 'Lifetime' },
    ],
    img: 'assets/slides/donager.webp',
    inCollection: false,
    inCompare: false,
  },
];

const GALLERY = [
  { img: 'assets/gallery/enigma-walnut.webp',      label: 'Enigma — Walnut Edition',      size: 'tall' },
  { img: 'assets/gallery/infinity-marble.webp',    label: 'Infinity — Marble Series',     size: '' },
  { img: 'assets/gallery/workshop.webp',            label: 'The Workshop',                 size: '' },
  { img: 'assets/gallery/blackbox-studio.webp',    label: 'BlackBox — Studio Series',     size: 'wide' },
  { img: 'assets/gallery/tinymen-field.webp',      label: 'TinyMen — Field Edition',      size: '' },
  { img: 'assets/gallery/normandie-heritage.webp', label: 'Normandie — Heritage Series',  size: 'tall' },
];
