(() => {
  'use strict';

  // ---- Hero reveal on load ----
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // ---- Scroll progress bar ----
  const progressBar = document.getElementById('scroll-progress');

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  }

  // ---- Nav scroll shadow ----
  const nav = document.getElementById('nav');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    updateProgress();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Mobile nav toggle ----
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close mobile menu when a link is clicked
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Animated stat counters ----
  function animateCounter(el) {
    const raw = el.dataset.count;
    const target = parseFloat(raw);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals) || 0;
    const useComma = el.dataset.format === 'comma';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      let current = target * eased;

      let display;
      if (decimals > 0) {
        display = current.toFixed(decimals);
      } else if (useComma) {
        display = Math.floor(current).toLocaleString('en-US');
      } else {
        display = Math.floor(current).toString();
      }

      el.textContent = prefix + display + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---- Scroll fade-in animations + counter trigger ----
  const faders = document.querySelectorAll('.fade-in');
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const counterTriggered = new Set();

  if ('IntersectionObserver' in window) {
    // Observer for fade-in elements
    const fadeObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    faders.forEach(el => fadeObserver.observe(el));

    // Observer for counters
    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !counterTriggered.has(entry.target)) {
            counterTriggered.add(entry.target);
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => counterObserver.observe(el));
  } else {
    // Fallback: show everything
    faders.forEach(el => el.classList.add('visible'));
    counters.forEach(el => {
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals) || 0;
      const target = parseFloat(el.dataset.count);
      const useComma = el.dataset.format === 'comma';
      let display = decimals > 0 ? target.toFixed(decimals) : (useComma ? target.toLocaleString('en-US') : target.toString());
      el.textContent = prefix + display + suffix;
    });
  }

  // ---- Obfuscated email (anti-scraper) ----
  const u = 'carynne';
  const d = 'mciverbutton.com';
  const addr = u + '@' + d;
  const btn = document.getElementById('contact-btn');
  const emailEl = document.getElementById('contact-email');

  btn.href = 'mai' + 'lto:' + addr;
  emailEl.textContent = addr;

  // Initial call
  updateProgress();
})();
