/**
 * gallery.js — SonicGallery standalone page
 * Builds masonry grid from GALLERY (catalog.js) and handles lightbox.
 */
(function () {
  const $ = id => document.getElementById(id);

  /* ── Theme toggle (reuse pattern from app.js) ──────────────── */
  const html      = document.documentElement;
  const toggleBtn = $('theme-toggle');
  const label     = $('theme-label');
  const LABELS    = { dark: 'DARK', white: 'LIGHT' };

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('sb-theme', t);
    if (label) label.textContent = LABELS[t] || t.toUpperCase();
  }
  applyTheme(localStorage.getItem('sb-theme') || 'dark');
  toggleBtn?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'white' : 'dark';
    applyTheme(next);
  });

  /* ── Mobile menu ───────────────────────────────────────────── */
  const menuBtn  = $('menu-toggle');
  const mobileMenu = $('mobile-menu');
  let menuOpen = false;
  menuBtn?.addEventListener('click', () => {
    menuOpen = !menuOpen;
    menuBtn.classList.toggle('open', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
    mobileMenu.setAttribute('aria-hidden', String(!menuOpen));
    menuBtn.setAttribute('aria-expanded', String(menuOpen));
  });

  /* ── Sticky nav ────────────────────────────────────────────── */
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

  /* ── Build masonry grid ────────────────────────────────────── */
  const grid = $('sg-grid');
  if (!grid || typeof GALLERY === 'undefined') return;

  grid.innerHTML = GALLERY.map((item, i) => `
    <div class="sg-item" data-idx="${i}" tabindex="0" role="button" aria-label="View ${item.label}">
      <img src="${item.img}" alt="${item.label}" loading="${i < 6 ? 'eager' : 'lazy'}" />
      <div class="sg-item__overlay">
        <span class="sg-item__label">${item.label}</span>
      </div>
    </div>`).join('');

  /* ── Lightbox ──────────────────────────────────────────────── */
  const lightbox  = $('sg-lightbox');
  const backdrop  = $('sg-lb-backdrop');
  const lbImg     = $('sg-lb-img');
  const lbLabel   = $('sg-lb-label');
  const lbCounter = $('sg-lb-counter');
  const closeBtn  = $('sg-lb-close');
  const prevBtn   = $('sg-lb-prev');
  const nextBtn   = $('sg-lb-next');
  let current = 0;

  function openLightbox(idx) {
    current = idx;
    showSlide(current);
    lightbox.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showSlide(idx) {
    const item = GALLERY[idx];
    lbImg.src       = item.img;
    lbImg.alt       = item.label;
    lbLabel.textContent   = item.label;
    lbCounter.textContent = `${idx + 1} / ${GALLERY.length}`;
  }

  function prev() { current = (current - 1 + GALLERY.length) % GALLERY.length; showSlide(current); }
  function next() { current = (current + 1) % GALLERY.length; showSlide(current); }

  /* Click tiles */
  grid.addEventListener('click', e => {
    const item = e.target.closest('.sg-item');
    if (item) openLightbox(parseInt(item.dataset.idx));
  });
  grid.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const item = e.target.closest('.sg-item');
      if (item) { e.preventDefault(); openLightbox(parseInt(item.dataset.idx)); }
    }
  });

  closeBtn?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  /* Touch swipe in lightbox */
  let touchX = 0;
  lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
  }, { passive: true });

})();
