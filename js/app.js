/**
 * SonicBeats — app.js
 * Modules (all vanilla JS, zero dependencies):
 *  1. CursorLight      — radial gradient follows mouse
 *  2. ThemeToggle      — dark ↔ light (wood) mode with localStorage
 *  3. StickyNav        — header becomes solid on scroll
 *  4. MobileMenu       — hamburger open/close
 *  5. ScrollReveal     — IntersectionObserver fade-in
 *  6. SpeakerTilt      — hero speaker 3D tilt on mouse proximity
 *  7. SpeakerSound     — Web Audio API subtle bass pulse on hover
 *  8. CartDrawer       — add-to-cart + drawer open/close
 *  9. FilmModal        — watch film modal
 * 10. ContactForm      — form submit with validation
 * 11. ParallaxHero     — subtle parallax on hero content
 * 12. Toast            — notification helper
 * 13. SmoothAnchor     — smooth-scroll nav links
 */

/* ── UTILITIES ────────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* ── 12. TOAST (defined early so modules can call it) ─────────── */
const Toast = (() => {
  const el = $('#toast');
  let timer;
  return {
    show(msg, duration = 3000) {
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

  // Use CSS custom properties + transform for GPU-accelerated movement
  const onMove = (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const x = e.clientX;
      const y = e.clientY;
      light.style.transform = `translate(${x - 350}px, ${y - 350}px)`;
    });
  };

  return {
    init() {
      window.addEventListener('mousemove', onMove, { passive: true });
    }
  };
})();

/* ── 2. THEME TOGGLE ──────────────────────────────────────────── */
const ThemeToggle = (() => {
  const html = document.documentElement;
  const btn = $('#theme-toggle');
  const label = btn?.querySelector('.theme-toggle__label');
  const STORAGE_KEY = 'sb-theme';

  const THEMES = {
    dark:  { label: 'WOOD', title: 'Switch to wood (light) theme' },
    light: { label: 'DARK', title: 'Switch to dark theme' }
  };

  function apply(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (label) label.textContent = THEMES[theme].label;
    if (btn) btn.title = THEMES[theme].title;
  }

  function toggle() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    // Flash transition overlay for polish
    html.classList.add('theme-transitioning');
    setTimeout(() => html.classList.remove('theme-transitioning'), 600);
    apply(next);
    SpeakerSound.playThemeClick();
  }

  return {
    init() {
      const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
      apply(saved);
      btn?.addEventListener('click', toggle);
    }
  };
})();

/* ── 3. STICKY NAV ────────────────────────────────────────────── */
const StickyNav = (() => {
  const header = $('#site-header');
  return {
    init() {
      const observer = new IntersectionObserver(
        ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
        { rootMargin: '-72px 0px 0px 0px' }
      );
      // Observe a sentinel at the top of the page
      const sentinel = document.createElement('div');
      sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;pointer-events:none';
      document.body.prepend(sentinel);
      observer.observe(sentinel);
    }
  };
})();

/* ── 4. MOBILE MENU ───────────────────────────────────────────── */
const MobileMenu = (() => {
  const btn = $('#menu-toggle');
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
    { rootMargin: '0px 0px -60px 0px', threshold: 0.08 }
  );

  return {
    init() {
      $$('.reveal').forEach(el => observer.observe(el));
    }
  };
})();

/* ── 6. SPEAKER TILT ──────────────────────────────────────────── */
const SpeakerTilt = (() => {
  const stage = $('#hero-speaker');
  if (!stage) return { init() {} };

  const MAX_TILT = 14; // degrees
  let isHovered = false;
  let animFrame;
  let lastX = 0, lastY = 0;

  function applyTilt(e) {
    cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;

      // Distance from centre, normalised -1..1
      const dx = (e.clientX - cx) / (window.innerWidth  / 2);
      const dy = (e.clientY - cy) / (window.innerHeight / 2);

      const rotX = clamp(-dy * MAX_TILT, -MAX_TILT, MAX_TILT);
      const rotY = clamp( dx * MAX_TILT, -MAX_TILT, MAX_TILT);

      stage.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05)`;
    });
  }

  function resetTilt() {
    stage.style.transform = '';
    stage.classList.remove('tilting');
  }

  return {
    init() {
      // Tilt while hovering the hero section
      const hero = $('#hero');
      if (!hero) return;

      hero.addEventListener('mousemove', (e) => {
        stage.classList.add('tilting');
        applyTilt(e);
      }, { passive: true });

      hero.addEventListener('mouseleave', () => {
        stage.classList.remove('tilting');
        resetTilt();
      });

      // Touch support (mobile tilt)
      hero.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        stage.classList.add('tilting');
        applyTilt(touch);
      }, { passive: true });
    }
  };
})();

/* ── 7. SPEAKER SOUND (Web Audio API) ────────────────────────── */
const SpeakerSound = (() => {
  let ctx = null;

  function ensureCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
  }

  /** Deep bass pulse — like a speaker coming alive */
  function playBassPulse() {
    try {
      ensureCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime);       // 55Hz bass note
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch (_) {}
  }

  /** Subtle metallic click — button hover */
  function playClick() {
    try {
      ensureCtx();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.2));
      }
      const src = ctx.createBufferSource();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 3000;
      src.buffer = buf;
      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      src.start();
    } catch (_) {}
  }

  /** Warm wood knock — used on light theme activate */
  function playThemeClick() {
    try {
      ensureCtx();
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'light') {
        // Wood knock: low thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else {
        // Dark mode: electronic chirp
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (_) {}
  }

  return {
    init() {
      // Bass pulse when hovering the main speaker
      const stage = $('#hero-speaker');
      if (stage) {
        let played = false;
        stage.addEventListener('mouseenter', () => {
          if (!played) { playBassPulse(); played = true; }
          setTimeout(() => { played = false; }, 1200);
        });
      }

      // Subtle click on primary buttons
      $$('.btn--primary').forEach(btn => {
        btn.addEventListener('mouseenter', () => playClick());
      });
    },
    playThemeClick,
    playClick
  };
})();

/* ── 8. CART DRAWER ───────────────────────────────────────────── */
const Cart = (() => {
  const drawer = $('#cart-drawer');
  const overlay = $('#cart-overlay');
  const cartBtn = $('#cart-btn');
  const closeBtn = $('#cart-close');
  const countEl = $('#cart-count');
  const STORAGE_KEY = 'sb-cart';

  let items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  function updateCount() {
    const total = items.reduce((s, i) => s + i.qty, 0);
    if (countEl) countEl.textContent = total;
    // Flash badge
    countEl?.classList.add('bump');
    setTimeout(() => countEl?.classList.remove('bump'), 300);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function open() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    renderItems();
  }

  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function addItem(name, price) {
    const existing = items.find(i => i.name === name);
    if (existing) { existing.qty++; }
    else { items.push({ name, price, qty: 1 }); }
    updateCount();
    Toast.show(`${name} added to cart ✓`);
    SpeakerSound.playClick();
  }

  function renderItems() {
    const inner = $('.cart-drawer__inner', drawer);
    // Clear existing item list
    $$('.cart-drawer__items', inner).forEach(el => el.remove());
    $$('.cart-drawer__total', inner).forEach(el => el.remove());

    const emptyEl = $('.cart-drawer__empty', inner);

    if (items.length === 0) {
      emptyEl.style.display = '';
      return;
    }

    emptyEl.style.display = 'none';

    const list = document.createElement('div');
    list.className = 'cart-drawer__items';
    list.style.cssText = 'flex:1;overflow-y:auto;padding:1.5rem 2rem;display:flex;flex-direction:column;gap:1rem;';

    items.forEach((item, idx) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:1rem 0;border-bottom:1px solid var(--border);';
      row.innerHTML = `
        <div style="flex:1">
          <p style="font-size:0.9rem;color:var(--text-primary)">${item.name}</p>
          <p style="font-size:0.78rem;color:var(--text-secondary)">€${item.price.toLocaleString()} × ${item.qty}</p>
        </div>
        <button data-idx="${idx}" class="cart-remove" style="font-size:0.75rem;color:var(--text-muted);padding:4px 8px;border:1px solid var(--border);border-radius:2px;background:none;cursor:pointer;transition:color 0.2s;">✕</button>
      `;
      list.appendChild(row);
    });

    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const totalEl = document.createElement('div');
    totalEl.className = 'cart-drawer__total';
    totalEl.style.cssText = 'padding:1.5rem 2rem;border-top:1px solid var(--border);';
    totalEl.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:1.5rem;font-size:0.9rem;color:var(--text-primary)">
        <span>Total</span>
        <span style="color:var(--accent-gold);font-family:'Cormorant Garamond',serif;font-size:1.1rem">€${total.toLocaleString()}</span>
      </div>
      <button class="btn btn--primary btn--full" id="checkout-btn">CHECKOUT</button>
    `;

    inner.appendChild(list);
    inner.appendChild(totalEl);

    // Remove item handlers
    $$('.cart-remove', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        items.splice(idx, 1);
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

/* ── 9. FILM MODAL ────────────────────────────────────────────── */
const FilmModal = (() => {
  const modal = $('#film-modal');
  const backdrop = $('#modal-backdrop');
  const closeBtn = $('#modal-close');
  const openBtn = $('#watch-film-btn');

  function open() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  return {
    init() {
      openBtn?.addEventListener('click', open);
      closeBtn?.addEventListener('click', close);
      backdrop?.addEventListener('click', close);
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('open')) close();
      });
    }
  };
})();

/* ── 10. CONTACT FORM ─────────────────────────────────────────── */
const ContactForm = (() => {
  const form = $('#contact-form');
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
        if (errors.length) {
          Toast.show(errors[0]);
          return;
        }
        // Simulate send
        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn.textContent = 'SENDING…';
        submitBtn.disabled = true;
        setTimeout(() => {
          successEl.textContent = 'Message sent! We\'ll be in touch within 24 hours.';
          form.reset();
          submitBtn.textContent = 'SEND MESSAGE';
          submitBtn.disabled = false;
          SpeakerSound.playClick();
        }, 1200);
      });
    }
  };
})();

/* ── 11. PARALLAX HERO ────────────────────────────────────────── */
const ParallaxHero = (() => {
  const content = $('.hero__content');
  const visual  = $('.hero__visual');
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const h = window.innerHeight;
      if (scrollY < h) {
        const progress = scrollY / h;
        if (content) content.style.transform = `translateY(${progress * 40}px)`;
        if (visual)  visual.style.transform  = `translateY(${progress * 20}px)`;
      }
      ticking = false;
    });
  }

  return {
    init() {
      // Only on desktop (skip on touch devices for performance)
      if (window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('scroll', onScroll, { passive: true });
      }
    }
  };
})();

/* ── 13. SMOOTH ANCHOR ────────────────────────────────────────── */
const SmoothAnchor = (() => {
  return {
    init() {
      $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
          const id = link.getAttribute('href').slice(1);
          if (!id) return;
          const target = document.getElementById(id);
          if (!target) return;
          e.preventDefault();
          const offset = 72; // nav height
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        });
      });
    }
  };
})();

/* ── SCROLL PROGRESS LINE ─────────────────────────────────────── */
const ScrollProgress = (() => {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0;
    background: linear-gradient(to right, var(--accent-gold-dk), var(--accent-gold), var(--accent-gold-lt));
    z-index: 9999;
    pointer-events: none;
    transition: width 0.1s linear;
  `;

  return {
    init() {
      document.body.appendChild(bar);
      window.addEventListener('scroll', () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
        bar.style.width = pct + '%';
      }, { passive: true });
    }
  };
})();

/* ── COLLECTION CARD KEYBOARD ─────────────────────────────────── */
const CollectionKeyboard = (() => {
  return {
    init() {
      $$('.collection-card').forEach(card => {
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const link = card.querySelector('.btn--primary');
            link?.click();
          }
        });
      });
    }
  };
})();

/* ── ACTIVE NAV HIGHLIGHT ON SCROLL ──────────────────────────── */
const NavHighlight = (() => {
  const sections = $$('section[id]');
  const links = $$('.nav__link');

  return {
    init() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              links.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.toggle('nav__link--active', href === `#${id}`);
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

/* ── CINEMA SECTION ANIMATED PORTS ───────────────────────────── */
const CinemaPorts = (() => {
  return {
    init() {
      const ports = $$('.cinema__bar-ports span');
      if (!ports.length) return;

      function animate() {
        ports.forEach((p, i) => {
          const delay = i * 60;
          const height = 8 + Math.random() * 28;
          setTimeout(() => {
            p.style.transition = 'height 0.15s ease';
            p.style.height = height + 'px';
            setTimeout(() => { p.style.height = '24px'; }, 180);
          }, delay);
        });
      }

      const observer = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          const interval = setInterval(animate, 300);
          observer.disconnect();
          // Clean up after 30 seconds
          setTimeout(() => clearInterval(interval), 30000);
        }
      }, { threshold: 0.5 });

      const cinema = $('#cinema');
      if (cinema) observer.observe(cinema);
    }
  };
})();

/* ── BOOT ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  CursorLight.init();
  ThemeToggle.init();
  StickyNav.init();
  MobileMenu.init();
  ScrollReveal.init();
  SpeakerTilt.init();
  SpeakerSound.init();
  Cart.init();
  FilmModal.init();
  ContactForm.init();
  ParallaxHero.init();
  SmoothAnchor.init();
  ScrollProgress.init();
  CollectionKeyboard.init();
  NavHighlight.init();
  CinemaPorts.init();

  // Trigger hero reveal immediately (above-fold)
  setTimeout(() => {
    $$('#hero .reveal').forEach(el => el.classList.add('visible'));
  }, 100);
});
