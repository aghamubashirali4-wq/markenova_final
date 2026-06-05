/**
 * MARKENOVA DIGITAL — script.js v5
 * Handles: Navbar, mobile menu, scroll animations, FAQ accordion,
 *          contact form, exit intent popup, smooth scroll.
 */

'use strict';

function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* NAVBAR */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    document.getElementById('backTop')?.classList.toggle('show', window.scrollY > 400);
  }
  window.addEventListener('scroll', debounce(onScroll, 10), { passive: true });
  onScroll();

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* BACK TO TOP */
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* SCROLL ANIMATIONS */
(function initScrollAnim() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
})();

/* SMOOTH SCROLL */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') { e.preventDefault(); return; }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* CONTACT FORM */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  const fields = [
    { id: 'fname', errorId: 'fname-error', validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    { id: 'email', errorId: 'email-error', validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    { id: 'service', errorId: 'service-error', validate: v => v ? '' : 'Please choose an option.' },
    { id: 'message', errorId: 'message-error', validate: v => v.trim().length >= 15 ? '' : 'Please share a bit more (min. 15 characters).' },
  ];

  function validateField(config) {
    const el = document.getElementById(config.id);
    const errEl = document.getElementById(config.errorId);
    if (!el || !errEl) return true;
    const error = config.validate(el.value);
    errEl.textContent = error;
    el.classList.toggle('error', !!error);
    el.setAttribute('aria-invalid', error ? 'true' : 'false');
    return !error;
  }

  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(f));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(f);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) {
      const firstErr = form.querySelector('.error');
      firstErr?.focus();
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const data = {
      fname: document.getElementById('fname').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone')?.value.trim() || '',
      service: document.getElementById('service').value,
      message: document.getElementById('message').value.trim(),
      page: window.location.pathname,
      timestamp: new Date().toISOString(),
    };

    try {
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meedqgvl';
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          'Name': data.fname,
          'Email': data.email,
          'Phone': data.phone || '',
          'Service / Industry': data.service,
          'Message': data.message,
          'Page Source': data.page,
          '_subject': 'New Inquiry — Markenova: ' + data.service,
          '_replyto': data.email,
        })
      });
      if (!res.ok) throw new Error('Submission failed: ' + res.status);

      form.reset();
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      successMsg.classList.add('show');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Track conversion in Tawk.to if available
      if (typeof Tawk_API !== 'undefined' && Tawk_API.addEvent) {
        Tawk_API.addEvent('form-submission', { service: data.service }, function(){});
      }

      setTimeout(() => successMsg.classList.remove('show'), 8000);

    } catch (err) {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      const errEl = document.getElementById('fname-error');
      if (errEl) errEl.textContent = 'Something went wrong. Please try again or email us directly.';
    }
  });
})();

/* SECTION SPY (active nav) */
(function initSectionSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navAs.length) return;

  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;

  function spy() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navH - 80) current = sec.getAttribute('id');
    });
    navAs.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', debounce(spy, 80), { passive: true });
  spy();
})();

/* REDUCED MOTION */
(function respectMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-aos]').forEach(el => el.classList.add('is-visible'));
    const track = document.querySelector('.marquee-track');
    if (track) track.style.animationPlayState = 'paused';
  }
})();

/* FAQ ACCORDION */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      items.forEach(other => {
        const ob = other.querySelector('.faq-q');
        const oa = other.querySelector('.faq-a');
        if (ob && oa && ob !== btn) {
          ob.setAttribute('aria-expanded', 'false');
          oa.hidden = true;
        }
      });
      btn.setAttribute('aria-expanded', (!isOpen).toString());
      answer.hidden = isOpen;
    });
  });
})();

/* FOOTER YEAR */
(function updateYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* EXIT INTENT POPUP */
(function initExitPopup() {
  const popup = document.getElementById('exitPopup');
  const close = document.getElementById('exitPopupClose');
  const overlay = document.getElementById('exitPopupOverlay');
  if (!popup) return;

  let shown = false;
  const SESSION_KEY = 'markenova_exit_popup_shown';

  // Only show once per session
  if (sessionStorage.getItem(SESSION_KEY)) return;

  function showPopup() {
    if (shown) return;
    shown = true;
    sessionStorage.setItem(SESSION_KEY, '1');
    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
  }

  function hidePopup() {
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
  }

  // Desktop: mouse leaves top of page
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !shown) {
      showPopup();
    }
  });

  // Mobile: after 30 seconds of scrolling
  let scrollTimer = null;
  let mobileShown = false;
  if (window.innerWidth <= 768) {
    let scrollTime = 0;
    window.addEventListener('scroll', () => {
      if (mobileShown || shown) return;
      if (!scrollTimer) {
        scrollTime = Date.now();
        scrollTimer = setTimeout(() => {
          if (!mobileShown && !shown && window.scrollY > 800) {
            mobileShown = true;
            showPopup();
          }
        }, 30000);
      }
    }, { passive: true });
  }

  close?.addEventListener('click', hidePopup);
  overlay?.addEventListener('click', hidePopup);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('show')) hidePopup();
  });
})();


/* ============================================================
   V6 ADDITIONS — Announcement bar, scroll progress, nav audit
   ============================================================ */

(function() {
  'use strict';

  /* ---- Announcement bar close ---- */
  var annBar = document.getElementById('announcementBar');
  var annClose = document.getElementById('annClose');
  if (annClose && annBar) {
    annClose.addEventListener('click', function() {
      annBar.classList.add('hidden');
      try { sessionStorage.setItem('annClosed', '1'); } catch(e) {}
    });
    // Keep closed if dismissed this session
    try {
      if (sessionStorage.getItem('annClosed') === '1') {
        annBar.classList.add('hidden');
      }
    } catch(e) {}
  }

  /* ---- Scroll progress bar ---- */
  var progressBar = document.getElementById('scrollProgress');
  if (progressBar) {
    window.addEventListener('scroll', function() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

})();

/* ============================================================
   PRICING TABS — Service Switching
============================================================ */
(function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing-tab');
  const panels = document.querySelectorAll('.pricing-panel');
  if (!tabs.length || !panels.length) return;

  function activateTab(service) {
    tabs.forEach(tab => {
      const isActive = tab.dataset.service === service;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    panels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.service === service);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activateTab(tab.dataset.service);
    });

    // Keyboard navigation between tabs
    tab.addEventListener('keydown', (e) => {
      const allTabs = Array.from(tabs);
      const currentIndex = allTabs.indexOf(tab);
      let nextIndex = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % allTabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + allTabs.length) % allTabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = allTabs.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        allTabs[nextIndex].focus();
        activateTab(allTabs[nextIndex].dataset.service);
      }
    });
  });

  // Allow deep-linking to a specific service: e.g. /#pricing?service=seo
  const urlParams = new URLSearchParams(window.location.search);
  const initialService = urlParams.get('service');
  if (initialService && document.querySelector(`.pricing-tab[data-service="${initialService}"]`)) {
    activateTab(initialService);
  }
})();
