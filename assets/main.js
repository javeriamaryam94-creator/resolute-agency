(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile navigation: keyboard accessible, closes after selection and on Escape.
  const nav = document.querySelector('.navlinks');
  const menu = document.querySelector('.menu-btn');
  if (nav && menu) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation menu');
      menu.textContent = '☰';
    };
    menu.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
      menu.textContent = isOpen ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
        menu.focus();
      }
    });
    document.addEventListener('click', event => {
      if (nav.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
  }

  // Reveal content without making it permanently invisible if IntersectionObserver is unavailable.
  const revealItems = document.querySelectorAll('.reveal');
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Current year.
  document.querySelectorAll('[data-year]').forEach(node => { node.textContent = String(new Date().getFullYear()); });

  // Canvas-based binary matrix. Scales for high-density screens and pauses when not visible.
  const canvas = document.querySelector('.matrix-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const chars = '010101100101001101';
      let columns = [];
      let width = 0;
      let height = 0;
      let raf = 0;
      let active = true;
      const fontSize = 13;
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const count = Math.ceil(width / fontSize);
        columns = Array.from({ length: count }, () => Math.random() * (height / fontSize));
      };
      const draw = () => {
        if (!active || document.hidden) { raf = 0; return; }
        ctx.fillStyle = 'rgba(7, 9, 20, 0.13)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = `${fontSize}px monospace`;
        columns.forEach((y, i) => {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * fontSize;
          ctx.fillStyle = Math.random() > 0.975 ? 'rgba(206, 187, 255, .95)' : 'rgba(133, 105, 230, .55)';
          ctx.fillText(char, x, y * fontSize);
          columns[i] = y * fontSize > height && Math.random() > 0.975 ? 0 : y + 0.55;
        });
        raf = window.requestAnimationFrame(draw);
      };
      const start = () => { if (!prefersReducedMotion && active && !document.hidden && !raf) raf = window.requestAnimationFrame(draw); };
      const stop = () => { if (raf) window.cancelAnimationFrame(raf); raf = 0; };
      resize();
      if (prefersReducedMotion) {
        ctx.fillStyle = 'rgba(7, 9, 20, 1)';
        ctx.fillRect(0, 0, width, height);
        ctx.font = `${fontSize}px monospace`;
        for (let x = 0; x < width; x += fontSize) for (let y = 16; y < height; y += 25) {
          ctx.fillStyle = 'rgba(133, 105, 230, .42)';
          ctx.fillText(chars[(x + y) % chars.length], x, y);
        }
      } else {
        start();
        if ('IntersectionObserver' in window) {
          const visibilityObserver = new IntersectionObserver(entries => {
            active = entries[0].isIntersecting;
            active ? start() : stop();
          });
          visibilityObserver.observe(canvas);
        }
        document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
        window.addEventListener('resize', () => { resize(); if (active) start(); });
      }
    }
  }

  // Email-draft forms. The page never claims a message was sent automatically.
  document.querySelectorAll('form[data-mailto]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const emailAddress = form.dataset.mailto;
      if (!emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) return;
      const fields = new FormData(form);
      const email = fields.get('Email');
      let body = '';
      fields.forEach((value, key) => { body += `${key}: ${String(value).trim()}\n`; });
      const subject = form.dataset.subject || 'Website enquiry — Resolute Agency';
      const status = form.querySelector('.form-status');
      if (status) status.textContent = 'Opening your email app with the enquiry prepared. Review it and tap Send to complete your request.';
      const mailto = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
    });
  });
})();
