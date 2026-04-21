/* ============================================================
   MUHAMMAD ILYAS — Portfolio Website | script.js
   ============================================================ */

/* ===== NAV SCROLL ===== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
function setMenuState(isOpen) {
  navLinks.classList.toggle('open', isOpen);
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
hamburger.addEventListener('click', () => {
  setMenuState(!navLinks.classList.contains('open'));
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    setMenuState(false);
  });
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    setMenuState(false);
    hamburger.focus();
  }
});

/* ===== ACTIVE NAV LINK (on scroll) ===== */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => observer.observe(s));

/* ===== PARTICLE CANVAS ===== */
(function initParticles() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPowerDevice = window.matchMedia('(max-width: 900px)').matches;
  if (reduceMotion || lowPowerDevice) return;
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 60;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16,185,129,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(16,185,129,${0.06 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===== SCROLL REVEAL ===== */
(function initScrollReveal() {
  const revealTargets = document.querySelectorAll(
    '.project-card, .skill-group, .pub-card, .about-grid, .contact-inner, .stat, .testimonial-wrap'
  );

  // Assign each element a data-index for correct stagger order
  revealTargets.forEach((el, idx) => {
    el.dataset.revealIndex = idx;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });

  // Track per-section counters for stagger
  const sectionCounters = new Map();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target.closest('section') || document.body;
        const count = sectionCounters.get(section) || 0;
        entry.target.style.transitionDelay = `${count * 0.08}s`;
        sectionCounters.set(section, count + 1);
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));

  const style = document.createElement('style');
  style.textContent = `.revealed { opacity: 1 !important; transform: none !important; }`;
  document.head.appendChild(style);
})();

/* ===== CONTACT FORM (Formspree) ===== */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = document.getElementById('form-feedback');
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        feedback.textContent = '✓ Message sent! I\'ll be in touch soon.';
        feedback.style.color = 'var(--emerald)';
        contactForm.reset();
      } else {
        feedback.textContent = '✗ Something went wrong. Please email me directly.';
        feedback.style.color = '#ef4444';
      }
    } catch {
      feedback.textContent = '✗ Network error. Please try again.';
      feedback.style.color = '#ef4444';
    } finally {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      setTimeout(() => { feedback.textContent = ''; }, 6000);
    }
  });
}

/* ===== TILT EFFECT on project cards ===== */
document.querySelectorAll('.project-card').forEach(card => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPowerDevice = window.matchMedia('(max-width: 900px)').matches;
  if (reduceMotion || lowPowerDevice) return;
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===== CURSOR GLOW ===== */
(function initCursorGlow() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lowPowerDevice = window.matchMedia('(max-width: 900px)').matches;
  if (reduceMotion || lowPowerDevice) return;
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();

/* ===== SCROLL PROGRESS BAR ===== */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ===== BACK TO TOP ===== */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ===== ANIMATED STAT COUNTERS ===== */
(function initStatCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  function parseTarget(el) {
    const raw = el.textContent.trim();
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[0-9.]/g, '');
    return { num, suffix };
  }

  function animateCount(el, target, suffix, duration = 1600) {
    el.classList.add('counting');
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
        el.classList.remove('counting');
      }
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const { num, suffix } = parseTarget(el);
        animateCount(el, num, suffix);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => {
    counterObserver.observe(el);
  });
})();
