/**
 * SonicBeats — app.js v4
 *  0. CatalogRenderer  — builds DOM from catalog.js data
 *  1. CursorLight
 *  2. ThemeToggle      — dark ↔ white
 *  3. StickyNav
 *  4. MobileMenu
 *  5. ScrollReveal
 *  6. SpeakerSound
 *  7. CartDrawer
 *  8. FilmModal
 *  9. ContactForm
 * 10. SmoothAnchor
 * 11. ScrollProgress
 * 12. Toast
 * 13. Slideshow
 * 14. CompareTabs
 * 15. NavHighlight
 */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ── 0. CATALOG RENDERER ──────────────────────────────────────── */
const CatalogRenderer = (() => ({
  init() {
    if (typeof CATALOG === 'undefined') return;
    this.renderCollections();
    this.renderCompare();
    if (typeof GALLERY !== 'undefined') this.renderGallery();
  },

  renderSlides() {
    const slideshow = $('#slideshow');
    const dotsEl    = $('#hero-dots');
    const totalEl   = $('.hero-counter__total');
    if (!slideshow) return;

    slideshow.innerHTML = CATALOG.map((p, i) => `
      <div class="slide${i === 0 ? ' slide--active' : ''}"
           data-idx="${i}" data-name="${p.name}" data-tagline="${p.tagline}"
           aria-label="${p.name} speaker"
           style="background-image:url('${p.img}')">
        <div class="slide__overlay"></div>
      </div>`).join('');

    if (dotsEl) {
      dotsEl.innerHTML = CATALOG.map((p, i) => `
        <button class="hero-dot${i === 0 ? ' hero-dot--active' : ''}"
                data-idx="${i}" role="tab"
                aria-selected="${i === 0}" aria-label="${p.name}"></button>`).join('');
    }

    if (totalEl) totalEl.textContent = String(CATALOG.length).padStart(2, '0');
  },

  renderCollections() {
    const grid = $('#collections-grid');
    if (!grid) return;
    const products = CATALOG.filter(p => p.inCollection);

    grid.innerHTML = products.map((p, i) => `
      <div class="collection-card reveal" data-delay="${i * 100}"
           tabindex="0" role="article" aria-label="${p.name} collection">
        <div class="collection-card__inner">
          <div class="collection-card__front">
            <div class="collection-card__visual"
                 style="background-image:url('${p.img}')"></div>
            <div class="collection-card__info">
              <h3 class="collection-card__name">${p.name.toUpperCase()}</h3>
              <p class="collection-card__tagline">${p.tagline}</p>
              <span class="collection-card__price">${p.price}</span>
              <a href="#custom" class="collection-card__link">ORDER NOW</a>
            </div>
          </div>
          <div class="collection-card__hover-overlay">
            <p>Starting from <strong>${p.price.replace('From ', '')}</strong></p>
            <ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
            <a href="#custom" class="btn btn--primary btn--sm">ORDER NOW</a>
          </div>
        </div>
      </div>`).join('');
  },

  renderCompare() {
    const tabsEl   = $('#compare-tabs');
    const panelsEl = $('#compare-panels');
    if (!tabsEl || !panelsEl) return;
    const products = CATALOG.filter(p => p.inCompare);

    tabsEl.innerHTML = products.map((p, i) => `
      <button class="compare__tab${i === 0 ? ' compare__tab--active' : ''}"
              data-model="${p.slug}" role="tab" aria-selected="${i === 0}">
        ${p.name.toUpperCase()}
      </button>`).join('');

    panelsEl.innerHTML = products.map((p, i) => `
      <div class="compare__panel${i === 0 ? ' compare__panel--active' : ''}"
           data-model="${p.slug}" role="tabpanel">
        <div class="compare__visual"
             style="background-image:url('${p.img}')"></div>
        <div class="compare__info">
          <div class="compare__series">${p.series}</div>
          <h3 class="compare__name">${p.name}</h3>
          <p class="compare__desc">${p.desc}</p>
          <div class="compare__specs">
            ${p.specs.map(s => `
              <div class="compare__spec">
                <span class="compare__spec-label">${s.label}</span>
                <span class="compare__spec-value">${s.value}</span>
              </div>`).join('')}
          </div>
          <a href="#custom" class="btn btn--primary">CONFIGURE YOURS</a>
        </div>
      </div>`).join('');
  },

  renderGallery() {
    const grid = $('#gallery-grid');
    if (!grid) return;

    grid.innerHTML = GALLERY.map(item => {
      const sizeClass = item.size === 'tall' ? ' gallery__item--tall'
                      : item.size === 'wide' ? ' gallery__item--wide' : '';
      return `
        <div class="gallery__item${sizeClass}"
             style="background-image:url('${item.img}')">
          <div class="gallery__item-overlay"><span>${item.label}</span></div>
        </div>`;
    }).join('');
  },
}))();

/* ── 12. TOAST ────────────────────────────────────────────────── */
const Toast = (() => {
  const el = $('#toast');
  let timer;
  return {
    show(msg, duration = 3000) {
      if (!el) return;
      el.textContent = msg;
      el.setAttribute('aria-hidden', 'false');
      el.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => {
        el.classList.remove('show');
        el.setAttribute('aria-hidden', 'true');
      }, duration);
    }
  };
})();

/* ── 1. CURSOR LIGHT ──────────────────────────────────────────── */
const CursorLight = (() => {
  const light = $('#cursor-light');
  let raf;
  return {
    init() {
      if (!light) return;
      window.addEventListener('mousemove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          light.style.transform = `translate(${e.clientX - 350}px, ${e.clientY - 350}px)`;
        });
      }, { passive: true });
    }
  };
})();

/* ── 2. THEME TOGGLE — dark ↔ white ──────────────────────────── */
const ThemeToggle = (() => {
  const html  = document.documentElement;
  const btn   = $('#theme-toggle');
  const label = $('#theme-label');
  const STORAGE_KEY = 'sb-theme';
  const CYCLE  = ['dark', 'white'];
  const LABELS = { dark: 'DARK', white: 'LIGHT' };

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (label) label.textContent = LABELS[theme] || theme.toUpperCase();
  }

  function cycle() {
    const current = html.getAttribute('data-theme') || 'dark';
    const idx  = CYCLE.indexOf(current);
    const next = CYCLE[(idx + 1) % CYCLE.length];
    apply(next);
    SpeakerSound.playThemeClick();
  }

  return {
    init() {
      const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
      apply(saved);
      btn?.addEventListener('click', cycle);
    }
  };
})();

/* ── 3. STICKY NAV ────────────────────────────────────────────── */
const StickyNav = (() => {
  const header = $('#site-header');
  return {
    init() {
      if (!header) return;
      const sentinel = document.createElement('div');
      sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;pointer-events:none';
      document.body.prepend(sentinel);
      const observer = new IntersectionObserver(
        ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
        { rootMargin: '-72px 0px 0px 0px' }
      );
      observer.observe(sentinel);
    }
  };
})();

/* ── 4. MOBILE MENU ───────────────────────────────────────────── */
const MobileMenu = (() => {
  const btn  = $('#menu-toggle');
  const menu = $('#mobile-menu');
  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
    btn.classList.toggle('open', isOpen);
    menu.classList.toggle('open', isOpen);
    menu.setAttribute('aria-hidden', String(!isOpen));
    btn.setAttribute('aria-expanded', String(isOpen));
  }

  return {
    init() {
      btn?.addEventListener('click', toggle);
      $$('.mobile-menu__link').forEach(link =>
        link.addEventListener('click', () => { if (isOpen) toggle(); })
      );
    }
  };
})();

/* ── 5. SCROLL REVEAL ─────────────────────────────────────────── */
const ScrollReveal = (() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px 0px 0px', threshold: 0.01 }
  );
  return {
    init() { $$('.reveal').forEach(el => observer.observe(el)); }
  };
})();

/* ── 6. SPEAKER SOUND ─────────────────────────────────────────── */
const SpeakerSound = (() => {
  let ctx = null;

  function ensureCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  }

  function playClick() {
    try {
      ensureCtx();
      const buf  = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.2));
      }
      const src    = ctx.createBufferSource();
      const gain   = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 3000;
      src.buffer = buf;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      src.start();
    } catch (_) {}
  }

  function playThemeClick() {
    try {
      ensureCtx();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (_) {}
  }

  return {
    init() {
      $$('.btn--primary').forEach(btn => {
        btn.addEventListener('mouseenter', () => playClick());
      });
    },
    playThemeClick,
    playClick
  };
})();

/* ── 7. CART DRAWER ───────────────────────────────────────────── */
const Cart = (() => {
  const drawer   = $('#cart-drawer');
  const overlay  = $('#cart-overlay');
  const cartBtn  = $('#cart-btn');
  const closeBtn = $('#cart-close');
  const countEl  = $('#cart-count');
  const STORAGE_KEY = 'sb-cart';

  let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  function updateCount() {
    const total = items.reduce((s, i) => s + i.qty, 0);
    if (countEl) countEl.textContent = total;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function open() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    renderItems();
  }

  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }

  function addItem(name, price) {
    const existing = items.find(i => i.name === name);
    if (existing) { existing.qty++; }
    else { items.push({ name, price, qty: 1 }); }
    updateCount();
    Toast.show(`${name} added to cart`);
    SpeakerSound.playClick();
  }

  function renderItems() {
    const inner = $('.cart-drawer__inner', drawer);
    $$('.cart-drawer__items', inner).forEach(el => el.remove());
    $$('.cart-drawer__total', inner).forEach(el => el.remove());

    const emptyEl = $('.cart-drawer__empty', inner);
    if (items.length === 0) { emptyEl.style.display = ''; return; }
    emptyEl.style.display = 'none';

    const list = document.createElement('div');
    list.className = 'cart-drawer__items';
    list.style.cssText = 'flex:1;overflow-y:auto;padding:1.5rem 2rem;display:flex;flex-direction:column;gap:1rem;';

    items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:1rem 0;border-bottom:1px solid var(--border);';
      row.innerHTML = `
        <div style="flex:1">
          <p style="font-size:0.88rem;color:var(--text-primary)">${item.name}</p>
          <p style="font-size:0.75rem;color:var(--text-secondary)">€${item.price.toLocaleString()} × ${item.qty}</p>
        </div>
        <button data-idx="${idx}" class="cart-remove" style="font-size:0.7rem;color:var(--text-muted);padding:4px 8px;border:1px solid var(--border);border-radius:2px;background:none;cursor:pointer;transition:color 0.2s;">✕</button>
      `;
      list.appendChild(row);
    });

    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const totalEl = document.createElement('div');
    totalEl.className = 'cart-drawer__total';
    totalEl.style.cssText = 'padding:1.5rem 2rem;border-top:1px solid var(--border);';
    totalEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;font-size:0.88rem;color:var(--text-primary)">
        <span>Total</span>
        <span style="font-family:'Orbitron',sans-serif;font-size:0.85rem">€${total.toLocaleString()}</span>
      </div>
      <button class="btn btn--primary btn--full" id="checkout-btn">CHECKOUT</button>
    `;

    inner.appendChild(list);
    inner.appendChild(totalEl);

    $$('.cart-remove', list).forEach(btn => {
      btn.addEventListener('click', () => {
        items.splice(parseInt(btn.dataset.idx), 1);
        updateCount();
        renderItems();
      });
    });

    $('#checkout-btn')?.addEventListener('click', () => {
      Toast.show('Checkout coming soon — thank you!');
    });
  }

  return {
    init() {
      cartBtn?.addEventListener('click', open);
      closeBtn?.addEventListener('click', close);
      overlay?.addEventListener('click', close);
      $$('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          addItem(btn.dataset.name, parseFloat(btn.dataset.price));
        });
      });
      updateCount();
    }
  };
})();

/* ── 8. FILM MODAL ────────────────────────────────────────────── */
const FilmModal = (() => {
  const modal    = $('#film-modal');
  const backdrop = $('#modal-backdrop');
  const closeBtn = $('#modal-close');

  function open() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  return {
    init() {
      closeBtn?.addEventListener('click', close);
      backdrop?.addEventListener('click', close);
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal?.classList.contains('open')) close();
      });
    }
  };
})();

/* ── 9. CONTACT FORM ──────────────────────────────────────────── */
const ContactForm = (() => {
  const form      = $('#contact-form');
  const successEl = $('#form-success');

  function validate(data) {
    const errors = [];
    if (!data.name.trim()) errors.push('Name is required');
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('Valid email required');
    if (!data.message.trim() || data.message.length < 10) errors.push('Message must be at least 10 characters');
    return errors;
  }

  return {
    init() {
      if (!form) return;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
          name:    form.elements['name'].value,
          email:   form.elements['email'].value,
          message: form.elements['message'].value,
        };
        const errors = validate(data);
        if (errors.length) { Toast.show(errors[0]); return; }

        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.textContent = 'SENDING…';
        submitBtn.disabled = true;
        setTimeout(() => {
          if (successEl) successEl.textContent = 'Message sent — we\'ll be in touch within 24 hours.';
          form.reset();
          submitBtn.textContent = 'SEND MESSAGE';
          submitBtn.disabled = false;
          SpeakerSound.playClick();
        }, 1200);
      });
    }
  };
})();

/* ── 10. SMOOTH ANCHOR ────────────────────────────────────────── */
const SmoothAnchor = (() => ({
  init() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }
}))();

/* ── 11. SCROLL PROGRESS ──────────────────────────────────────── */
const ScrollProgress = (() => ({
  init() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    }, { passive: true });
  }
}))();

/* ── 13. SLIDESHOW ────────────────────────────────────────────── */
const Slideshow = (() => {
  const INTERVAL  = 5000;
  const slides    = $$('.slide');
  const dots      = $$('.hero-dot');
  const prevBtn   = $('#slide-prev');
  const nextBtn   = $('#slide-next');
  const caption   = $('#hero-caption');
  const nameEl    = $('#slide-name');
  const tagEl     = $('#slide-tagline');
  const counterEl = $('#slide-current');

  let current = 0;
  let timer   = null;
  let busy    = false;

  function updateCaption(slide) {
    if (!caption) return;
    if (nameEl)    nameEl.textContent = slide.dataset.name    || '';
    if (tagEl)     tagEl.textContent  = slide.dataset.tagline || '';
    if (counterEl) counterEl.textContent = String(parseInt(slide.dataset.idx) + 1).padStart(2, '0');
  }

  function goTo(next, dir = 'next') {
    if (busy || next === current) return;
    busy = true;
    const prev       = current;
    current          = (next + slides.length) % slides.length;
    const exitClass  = dir === 'next' ? 'slide--exit-left'  : 'slide--exit-right';
    const enterClass = dir === 'next' ? 'slide--enter-right' : 'slide--enter-left';

    // Hide caption immediately at transition start
    caption?.classList.remove('visible');

    slides[prev].classList.remove('slide--active');
    slides[prev].classList.add(exitClass);
    slides[current].style.opacity = '0';
    slides[current].style.pointerEvents = 'none';
    slides[current].classList.add(enterClass);

    requestAnimationFrame(() => {
      slides[current].style.opacity = '';
      slides[current].style.pointerEvents = '';
    });

    // Update text at midpoint and show caption — arrives with the new slide
    setTimeout(() => {
      updateCaption(slides[current]);
      updateDots(current);
      caption?.classList.add('visible');
    }, 360);

    setTimeout(() => {
      slides[prev].classList.remove(exitClass);
      slides[current].classList.remove(enterClass);
      slides[current].classList.add('slide--active');
      busy = false;
    }, 720);
  }

  function updateDots(idx) {
    dots.forEach((d, i) => {
      d.classList.toggle('hero-dot--active', i === idx);
      d.setAttribute('aria-selected', String(i === idx));
    });
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1, 'next'), INTERVAL);
  }

  function addSwipe(el) {
    let startX = 0;
    el.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 40) return;
      dx < 0 ? goTo(current + 1, 'next') : goTo(current - 1, 'prev');
      startTimer();
    }, { passive: true });
  }

  return {
    init() {
      if (!slides.length) return;
      updateCaption(slides[0]);
      setTimeout(() => caption?.classList.add('visible'), 400);

      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goTo(i, i > current ? 'next' : 'prev'); startTimer(); });
      });
      prevBtn?.addEventListener('click', () => { goTo(current - 1, 'prev'); startTimer(); });
      nextBtn?.addEventListener('click', () => { goTo(current + 1, 'next'); startTimer(); });

      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { goTo(current + 1, 'next'); startTimer(); }
        if (e.key === 'ArrowLeft')  { goTo(current - 1, 'prev'); startTimer(); }
      });

      const slideshowEl = $('#slideshow');
      if (slideshowEl) {
        addSwipe(slideshowEl);
        slideshowEl.addEventListener('mouseenter', () => clearInterval(timer));
        slideshowEl.addEventListener('mouseleave', () => startTimer());
      }

      startTimer();
    }
  };
})();

/* ── 14. COMPARE TABS ─────────────────────────────────────────── */
const CompareTabs = (() => ({
  init() {
    const tabs   = $$('.compare__tab');
    const panels = $$('.compare__panel');
    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const model = tab.dataset.model;

        tabs.forEach(t => {
          t.classList.toggle('compare__tab--active', t === tab);
          t.setAttribute('aria-selected', String(t === tab));
        });

        panels.forEach(p => {
          const isActive = p.dataset.model === model;
          p.classList.toggle('compare__panel--active', isActive);
        });

        SpeakerSound.playClick();
      });
    });
  }
}))();

/* ── 15. NAV HIGHLIGHT ────────────────────────────────────────── */
const NavHighlight = (() => {
  const sections = $$('section[id]');
  const links    = $$('.nav__link');
  return {
    init() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              links.forEach(link => {
                link.classList.toggle('nav__link--active', link.getAttribute('href') === `#${id}`);
              });
            }
          });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      sections.forEach(s => observer.observe(s));
    }
  };
})();

/* ── BOOT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  CatalogRenderer.init(); // must run first — populates DOM for other modules
  CursorLight.init();
  ThemeToggle.init();
  StickyNav.init();
  MobileMenu.init();
  ScrollReveal.init();
  Slideshow.init();
  SpeakerSound.init();
  Cart.init();
  FilmModal.init();
  ContactForm.init();
  SmoothAnchor.init();
  ScrollProgress.init();
  CompareTabs.init();
  NavHighlight.init();
});
