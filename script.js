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

  // ========== Tap bomb light + random flying robot ==========
  let lastTapFxTime = 0;
  const fxLayer = document.createElement('div');
  fxLayer.className = 'fx-layer';
  document.body.appendChild(fxLayer);

  const tapLight = document.createElement('div');
  tapLight.className = 'tap-light';
  fxLayer.appendChild(tapLight);

  function createTapBombEffect(x, y) {
    const now = Date.now();
    if (now - lastTapFxTime < 120) return;
    lastTapFxTime = now;

    tapLight.style.setProperty('--x', x + 'px');
    tapLight.style.setProperty('--y', y + 'px');
    tapLight.classList.remove('active');
    void tapLight.offsetWidth;
    tapLight.classList.add('active');

    const wave = document.createElement('span');
    wave.className = 'tap-bomb-wave';
    wave.style.left = x + 'px';
    wave.style.top = y + 'px';
    fxLayer.appendChild(wave);

    for (let i = 0; i < 18; i += 1) {
      const spark = document.createElement('span');
      spark.className = 'tap-bomb-spark';
      spark.style.left = x + 'px';
      spark.style.top = y + 'px';
      spark.style.setProperty('--dx', (Math.random() * 640 - 320).toFixed(1) + 'px');
      spark.style.setProperty('--dy', (Math.random() * 640 - 320).toFixed(1) + 'px');
      spark.style.setProperty('--dur', (650 + Math.random() * 350).toFixed(0) + 'ms');
      fxLayer.appendChild(spark);
      spark.addEventListener('animationend', function () {
        spark.remove();
      }, { once: true });
    }

    wave.addEventListener('animationend', function () {
      wave.remove();
    }, { once: true });
  }

  if (window.PointerEvent) {
    document.addEventListener('pointerdown', function (event) {
      if (event.pointerType !== 'touch') return;
      createTapBombEffect(event.clientX, event.clientY);
    }, { passive: true, capture: true });
  }

  document.addEventListener('touchstart', function (event) {
    if (!event.touches || !event.touches.length) return;
    const touch = event.touches[0];
    createTapBombEffect(touch.clientX, touch.clientY);
  }, { passive: true, capture: true });

  const robot = document.createElement('div');
  robot.className = 'flying-robot';
  robot.innerHTML = '<i class="fas fa-robot" aria-hidden="true"></i>';
  document.body.appendChild(robot);

  const robotChat = document.createElement('div');
  robotChat.className = 'robot-chat-modal';
  robotChat.innerHTML = [
    '<div class="robot-chat-card" role="dialog" aria-modal="true" aria-label="Robot chat">',
    '  <div class="robot-chat-head">',
    '    <div class="robot-chat-title-wrap">',
    '      <div class="robot-chat-avatar"><i class="fas fa-robot" aria-hidden="true"></i></div>',
    '      <div>',
    '        <h3 class="robot-chat-title">Hamed Robot</h3>',
    '        <p class="robot-chat-status">Online</p>',
    '      </div>',
    '    </div>',
    '    <button class="robot-chat-close" type="button" aria-label="Close chat">&times;</button>',
    '  </div>',
    '  <div class="robot-chat-body">',
    '    <div class="robot-chat-msg robot-chat-msg-bot">',
    '      Hello I am the robot created by Hamed Dhieb How can I help you',
    '    </div>',
    '  </div>',
    '  <div class="robot-chat-input-row">',
    '    <input type="text" class="robot-chat-input" placeholder="Type your message..." aria-label="Type your message" />',
    '    <button type="button" class="robot-chat-send" aria-label="Send message"><i class="fas fa-paper-plane" aria-hidden="true"></i></button>',
    '  </div>',
    '</div>'
  ].join('');
  document.body.appendChild(robotChat);

  const robotChatClose = robotChat.querySelector('.robot-chat-close');
  const robotChatBody = robotChat.querySelector('.robot-chat-body');
  const robotChatInput = robotChat.querySelector('.robot-chat-input');
  const robotChatSend = robotChat.querySelector('.robot-chat-send');
  let robotFlightTimer = null;
  const robotConversation = [
    {
      role: 'system',
      content: 'You are Hamed Robot, a concise helpful assistant on Hamed Dhieb portfolio website.'
    }
  ];

  function scrollChatToBottom() {
    if (!robotChatBody) return;
    robotChatBody.scrollTop = robotChatBody.scrollHeight;
  }

  function addChatMessage(text, type) {
    if (!robotChatBody || !text) return;
    const msg = document.createElement('div');
    msg.className = 'robot-chat-msg ' + (type === 'user' ? 'robot-chat-msg-user' : 'robot-chat-msg-bot');
    msg.textContent = text;
    robotChatBody.appendChild(msg);
    scrollChatToBottom();
  }

  async function getRobotReplyFromApi() {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: robotConversation.slice(-12)
        })
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      if (data && data.reply) return data.reply;
      throw new Error('Invalid reply');
    } catch (error) {
      return 'I am having a connection issue right now. Please try again in a moment.';
    }
  }

  async function handleSendChatMessage() {
    if (!robotChatInput) return;
    const text = robotChatInput.value.trim();
    if (!text) return;

    addChatMessage(text, 'user');
    robotChatInput.value = '';
    robotChatInput.focus();
    robotConversation.push({ role: 'user', content: text });

    if (robotChatSend) {
      robotChatSend.disabled = true;
    }
    if (robotChatInput) {
      robotChatInput.disabled = true;
    }

    addChatMessage('Typing...', 'bot');
    const pendingMessage = robotChatBody ? robotChatBody.lastElementChild : null;
    const reply = await getRobotReplyFromApi();
    robotConversation.push({ role: 'assistant', content: reply });

    if (pendingMessage) {
      pendingMessage.remove();
    }
    addChatMessage(reply, 'bot');

    if (robotChatSend) {
      robotChatSend.disabled = false;
    }
    if (robotChatInput) {
      robotChatInput.disabled = false;
      robotChatInput.focus();
    }
  }

  function flyRobotRandomly() {
    const margin = 40;
    const maxX = Math.max(margin, window.innerWidth - margin);
    const maxY = Math.max(margin, window.innerHeight - margin);
    const x = margin + Math.random() * (maxX - margin);
    const y = margin + Math.random() * (maxY - margin);
    const rot = Math.random() * 36 - 18;
    const dur = 1600 + Math.random() * 2200;
    const flip = Math.random() > 0.5 ? 1 : -1;

    robot.style.transitionDuration = dur.toFixed(0) + 'ms';
    robot.style.transform = 'translate(' + x.toFixed(0) + 'px, ' + y.toFixed(0) + 'px) rotate(' + rot.toFixed(1) + 'deg) scaleX(' + flip + ')';
  }

  function stopRobotFlight() {
    if (robotFlightTimer) {
      clearInterval(robotFlightTimer);
      robotFlightTimer = null;
    }
  }

  function startRobotFlight() {
    stopRobotFlight();
    robotFlightTimer = setInterval(flyRobotRandomly, 1800);
  }

  function openRobotChat() {
    stopRobotFlight();
    robotChat.classList.add('open');
    if (robotChatInput) {
      window.setTimeout(function () {
        robotChatInput.focus();
      }, 120);
    }
    scrollChatToBottom();
  }

  function closeRobotChat() {
    robotChat.classList.remove('open');
    startRobotFlight();
  }

  robot.addEventListener('click', openRobotChat);
  robot.addEventListener('touchstart', openRobotChat, { passive: true });

  if (robotChatClose) {
    robotChatClose.addEventListener('click', closeRobotChat);
  }

  if (robotChatSend) {
    robotChatSend.addEventListener('click', handleSendChatMessage);
  }

  if (robotChatInput) {
    robotChatInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSendChatMessage();
      }
    });
  }

  flyRobotRandomly();
  startRobotFlight();

  // ========== Init ==========
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
