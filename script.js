/**
 * MARKENOVA DIGITAL — script.js
 * Handles: Navbar scroll, mobile menu, scroll animations,
 *          counter animations, result bar animations,
 *          contact form validation & submission.
 */

'use strict';

/* ============================================================
   UTILITY: debounce
============================================================ */
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* ============================================================
   NAVBAR — scroll shadow + mobile menu
============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

  // Scroll state
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    document.getElementById('backTop')?.classList.toggle('show', window.scrollY > 400);
  }
  window.addEventListener('scroll', debounce(onScroll, 10), { passive: true });
  onScroll();

  // Mobile toggle
  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================================
   BACK TO TOP
============================================================ */
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   SCROLL ANIMATIONS (AOS-lite)
============================================================ */
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

/* ============================================================
   COUNTER ANIMATION (hero stats)
============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.count');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = 16;
    const steps    = Math.round(duration / step);
    let current    = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (current >= steps) {
        clearInterval(timer);
        el.textContent = target;
      }
    }, step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   RESULT BARS ANIMATION
============================================================ */
(function initResultBars() {
  const items = document.querySelectorAll('.result-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger the bar animation
          setTimeout(() => {
            entry.target.classList.add('bar-animated');
          }, 150);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   SMOOTH SCROLL for anchor links
============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') { e.preventDefault(); return; }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   CONTACT FORM — validation & submission
============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  // Field config
  const fields = [
    { id: 'fname',   errorId: 'fname-error',   validate: v => v.trim().length >= 2 ? '' : 'Please enter your first name.' },
    { id: 'lname',   errorId: 'lname-error',   validate: v => v.trim().length >= 2 ? '' : 'Please enter your last name.' },
    { id: 'email',   errorId: 'email-error',   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    { id: 'service', errorId: 'service-error', validate: v => v ? '' : 'Please select a service.' },
    { id: 'message', errorId: 'message-error', validate: v => v.trim().length >= 20 ? '' : 'Please tell us a bit more (min. 20 characters).' },
  ];

  function validateField(config) {
    const el    = document.getElementById(config.id);
    const errEl = document.getElementById(config.errorId);
    if (!el || !errEl) return true;

    const error = config.validate(el.value);
    errEl.textContent = error;
    el.classList.toggle('error', !!error);
    el.setAttribute('aria-invalid', error ? 'true' : 'false');
    return !error;
  }

  // Live validation on blur
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    if (!el) return;
    el.addEventListener('blur', () => validateField(f));
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) validateField(f);
    });
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all
    let valid = true;
    fields.forEach(f => { if (!validateField(f)) valid = false; });
    if (!valid) {
      // Focus first error
      const firstErr = form.querySelector('.error');
      firstErr?.focus();
      return;
    }

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Collect data
    const data = {
      fname:   document.getElementById('fname').value.trim(),
      lname:   document.getElementById('lname').value.trim(),
      email:   document.getElementById('email').value.trim(),
      phone:   document.getElementById('phone')?.value.trim() || '',
      service: document.getElementById('service').value,
      budget:  document.getElementById('budget')?.value || '',
      message: document.getElementById('message').value.trim(),
      timestamp: new Date().toISOString(),
    };

    // Submit to Formspree
    try {
      const FORMSPREE_ENDPOINT = 'https://formspree.io/f/meedqgvl';
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          'First Name':  data.fname,
          'Last Name':   data.lname,
          'Email':       data.email,
          'Phone':       data.phone || '',
          'Service':     data.service,
          'Budget':      data.budget || '',
          'Message':     data.message,
          '_subject':    'New Inquiry — Markenova Website: ' + data.service,
          '_replyto':    data.email,
        })
      });
      if (!res.ok) throw new Error('Formspree responded with status ' + res.status);

      // Success
      form.reset();
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      successMsg.classList.add('show');
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Hide success after 6 seconds
      setTimeout(() => successMsg.classList.remove('show'), 6000);

    } catch (err) {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      // Show a generic error in the first error slot
      const errEl = document.getElementById('fname-error');
      if (errEl) errEl.textContent = 'Something went wrong. Please try again or email us directly.';
    }
  });

})();

/* ============================================================
   ACTIVE NAV LINK on scroll (section spy)
============================================================ */
(function initSectionSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navAs.length) return;

  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10
  ) || 72;

  function spy() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navH - 80) {
        current = sec.getAttribute('id');
      }
    });
    navAs.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', debounce(spy, 80), { passive: true });
  spy();
})();

/* ============================================================
   SERVICE CARD — keyboard accessibility
============================================================ */
(function initServiceCards() {
  document.querySelectorAll('.service-card .sc-link').forEach(link => {
    link.setAttribute('tabindex', '0');
  });
})();

/* ============================================================
   LAZY — reduce motion respect
============================================================ */
(function respectMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-aos]').forEach(el => {
      el.classList.add('is-visible');
    });
    // Pause marquee
    const track = document.querySelector('.marquee-track');
    if (track) track.style.animationPlayState = 'paused';
  }
})();

/* ============================================================
   FAQ ACCORDION
============================================================ */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      items.forEach(other => {
        const ob = other.querySelector('.faq-q');
        const oa = other.querySelector('.faq-a');
        if (ob && oa && ob !== btn) {
          ob.setAttribute('aria-expanded', 'false');
          oa.hidden = true;
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', (!isOpen).toString());
      answer.hidden = isOpen;
    });
  });
})();

/* ============================================================
   FOOTER YEAR — auto-update
============================================================ */
(function updateYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   FORMSPREE — ACTIVE (endpoint: meedqgvl)
   Form submissions go to hello@markenovadigital.com via Formspree.
   No further configuration needed.
============================================================ */

/* ============================================================
   META PIXEL — PageView fire on form success (optional)
   Uncomment after adding the Meta Pixel base code to <head>:
============================================================ */
// document.getElementById('contactForm')?.addEventListener('submit', () => {
//   if (typeof fbq !== 'undefined') {
//     fbq('track', 'Lead', { content_name: 'Contact Form Submission' });
//   }
// });

/* ============================================================
   GOOGLE ADS — Conversion tracking on form success (optional)
   Uncomment after adding Google Tag to <head>:
============================================================ */
// document.getElementById('formSuccess')?.addEventListener('DOMSubtreeModified', () => {
//   if (typeof gtag !== 'undefined') {
//     gtag('event', 'conversion', { 'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL' });
//   }
// });
