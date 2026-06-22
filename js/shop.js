/**
 * shop.js — SonicBeats shop page
 * Builds product listing from CATALOG (catalog.js) with colour swatches.
 */
(function () {
  const $ = id => document.getElementById(id);

  /* ── Theme ────────────────────────────────────────────────────── */
  const html      = document.documentElement;
  const toggleBtn = $('theme-toggle');
  const label     = $('theme-label');
  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('sb-theme', t);
    if (label) label.textContent = t === 'dark' ? 'DARK' : 'LIGHT';
  }
  applyTheme(localStorage.getItem('sb-theme') || 'dark');
  toggleBtn?.addEventListener('click', () =>
    applyTheme(html.getAttribute('data-theme') === 'dark' ? 'white' : 'dark'));

  /* ── Mobile menu ──────────────────────────────────────────────── */
  const menuBtn    = $('menu-toggle');
  const mobileMenu = $('mobile-menu');
  let menuOpen = false;
  menuBtn?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menuBtn.classList.toggle('open', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
    mobileMenu.setAttribute('aria-hidden', String(!menuOpen));
    menuBtn.setAttribute('aria-expanded', String(menuOpen));
  });

  /* ── Sticky nav ───────────────────────────────────────────────── */
  const header = $('site-header');
  if (header) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;pointer-events:none';
    document.body.prepend(sentinel);
    new IntersectionObserver(
      ([e]) => header.classList.toggle('scrolled', !e.isIntersecting),
      { rootMargin: '-72px 0px 0px 0px' }
    ).observe(sentinel);
  }

  if (typeof CATALOG === 'undefined') return;

  /* ── Model quick-nav pills ────────────────────────────────────── */
  const pillsEl = $('model-pills');
  if (pillsEl) {
    pillsEl.innerHTML = CATALOG.map(p => `
      <a class="shop-pill" href="#${p.slug}">${p.name}</a>`).join('');
  }

  /* ── Scroll-to if URL has hash (e.g. shop.html#blackbox) ─────── */
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  }

  /* ── Build product grid ───────────────────────────────────────── */
  const grid = $('shop-grid');
  if (!grid) return;

  grid.innerHTML = CATALOG.map(p => {
    const colors  = p.colors || [];
    const first   = colors[0];
    const heroImg = first ? first.img : p.img;

    const swatches = colors.map((c, ci) => `
      <button class="color-swatch${ci === 0 ? ' color-swatch--active' : ''}"
              data-img="${c.img}"
              data-fallback="${p.img}"
              data-color-name="${c.name}"
              style="background:${c.hex}"
              aria-label="${c.name}"
              title="${c.name}"></button>`).join('');

    const featureList = p.features.map(f => `<li>${f}</li>`).join('');

    const specRows = p.specs.map(s => `
      <div class="shop-card__spec">
        <span class="shop-card__spec-label">${s.label}</span>
        <span class="shop-card__spec-value">${s.value}</span>
      </div>`).join('');

    return `
      <article class="shop-card" id="${p.slug}" data-slug="${p.slug}">
        <div class="shop-card__left">
          <div class="shop-card__img-wrap">
            <img class="shop-card__img"
                 src="${heroImg}"
                 data-fallback="${p.img}"
                 alt="${p.name}"
                 loading="lazy"
                 onerror="this.src=this.dataset.fallback" />
          </div>
          ${colors.length ? `
          <div class="shop-card__thumb-row">
            ${colors.map((c, ci) => `
              <button class="shop-thumb${ci === 0 ? ' shop-thumb--active' : ''}"
                      data-img="${c.img}"
                      data-fallback="${p.img}"
                      data-color-name="${c.name}"
                      aria-label="${c.name}">
                <img src="${c.img}" alt="${c.name}" onerror="this.parentElement.style.background='${c.hex}';this.style.display='none'" />
              </button>`).join('')}
          </div>` : ''}
        </div>

        <div class="shop-card__right">
          <div class="shop-card__header">
            <span class="shop-card__series">${p.series}</span>
            <h2 class="shop-card__name">${p.name}</h2>
            <p class="shop-card__tagline">${p.tagline}</p>
          </div>

          <p class="shop-card__desc">${p.desc}</p>

          ${colors.length ? `
          <div class="shop-card__color-section">
            <div class="shop-card__color-label-row">
              <span class="shop-card__color-heading">COLOUR</span>
              <span class="shop-card__selected-color">${first ? first.name : ''}</span>
            </div>
            <div class="shop-card__swatches" role="group" aria-label="Colour options">
              ${swatches}
            </div>
          </div>` : ''}

          <ul class="shop-card__features">${featureList}</ul>

          <div class="shop-card__specs">${specRows}</div>

          <div class="shop-card__buy">
            <span class="shop-card__price">${p.price}</span>
            <a href="index.html#contact" class="btn btn--primary">ORDER NOW</a>
          </div>
        </div>
      </article>`;
  }).join('');

  /* ── Colour swatch / thumbnail click ─────────────────────────── */
  grid.addEventListener('click', e => {
    const swatch = e.target.closest('.color-swatch, .shop-thumb');
    if (!swatch) return;
    const card  = swatch.closest('.shop-card');
    const img   = card.querySelector('.shop-card__img');
    const label = card.querySelector('.shop-card__selected-color');

    /* Deactivate all swatches + thumbs in this card */
    card.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('color-swatch--active'));
    card.querySelectorAll('.shop-thumb').forEach(s => s.classList.remove('shop-thumb--active'));

    swatch.classList.add(swatch.classList.contains('shop-thumb') ? 'shop-thumb--active' : 'color-swatch--active');

    /* Also sync the matching sibling */
    const colorName = swatch.dataset.colorName;
    card.querySelectorAll('.color-swatch, .shop-thumb').forEach(s => {
      if (s.dataset.colorName === colorName) {
        s.classList.add(s.classList.contains('shop-thumb') ? 'shop-thumb--active' : 'color-swatch--active');
      }
    });

    img.src = swatch.dataset.img;
    if (label) label.textContent = colorName;
  });

})();
