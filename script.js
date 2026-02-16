/**
 * Hamed Dhieb - Portfolio
 * Smooth scroll, navbar, animations, form, download CV
 */

(function () {
  'use strict';

  // ========== DOM refs ==========
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const navLinksEl = document.querySelector('.nav-links');
  const navCta = document.querySelector('.nav-cta');
  const navToggle = document.getElementById('navToggle');
  const navContainer = document.querySelector('.nav-container');
  const contactForm = document.getElementById('contactForm');
  const downloadCvBtn = document.getElementById('downloadCv');

  // ========== Sticky navbar + scroll class ==========
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    setActiveNavLink();
  }

  // ========== Active nav link based on section ==========
  function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ========== Smooth scroll for anchor links ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navLinksEl && navLinksEl.classList.contains('open')) {
          navLinksEl.classList.remove('open');
          if (navCta) navCta.classList.remove('open');
          if (navToggle) navToggle.classList.remove('active');
        }
      }
    });
  });

  // ========== Mobile menu toggle ==========
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      if (navLinksEl) navLinksEl.classList.toggle('open');
      if (navCta) navCta.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
  }

  // ========== Scroll reveal (intersection observer) ==========
  const revealEls = document.querySelectorAll('.section-title, .about-content, .stat-card, .service-card, .portfolio-card, .contact-wrapper');
  const revealOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, revealOptions);

  revealEls.forEach(function (el) {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ========== Contact form submit ==========
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) return;

      // Optional: send to backend or mailto
      const mailto = 'mailto:contact@hameddhieb.online?subject=Portfolio contact from ' + encodeURIComponent(name) + '&body=' + encodeURIComponent(message + '\n\n---\nReply to: ' + email);
      window.location.href = mailto;

      contactForm.reset();
    });
  }

  // ========== Download CV ==========
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', function (e) {
      e.preventDefault();
      // Placeholder: replace with your CV file path when you add one
      const cvUrl = 'assets/cv.pdf';
      const link = document.createElement('a');
      link.href = cvUrl;
      link.download = 'Hamed-Dhieb-CV.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ========== Footer year ==========
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ========== Parallax hero (light) ==========
  const heroParallax = document.querySelector('.hero-bg-parallax');
  if (heroParallax) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.15;
      heroParallax.style.transform = 'translateY(' + rate + 'px)';
    });
  }

  // ========== Init ==========
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
