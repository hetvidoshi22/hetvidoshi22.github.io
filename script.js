/* ================================================================
   PORTFOLIO — JavaScript
   Particles · Navbar · Scroll Reveal · Counters · Cursor glow
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initActiveSectionHighlight();
  initAnimatedCounters();
  initBackToTop();
  initSmoothScroll();
  initContactForm();
  initCursorGlow();
});

/* ========================
   PARTICLE NETWORK (Amber)
   ======================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let animationId;
  let time = 0;

  const config = {
    particleCount: 60,
    maxDistance: 120,
    speed: 0.2,
    mouseRadius: 160,
  };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * config.speed;
      this.vy = (Math.random() - 0.5) * config.speed;
      this.baseSize = Math.random() * 1.3 + 0.4;
      this.size = this.baseSize;
      // Amber / gold / warm tones
      this.hue = 35 + Math.random() * 15; // 35-50 range (amber)
      this.saturation = 70 + Math.random() * 20;
      this.opacity = Math.random() * 0.4 + 0.2;
      this.pulseSpeed = Math.random() * 0.015 + 0.008;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }

    update(t) {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      this.size = this.baseSize + Math.sin(t * this.pulseSpeed + this.pulsePhase) * 0.3;

      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.mouseRadius) {
          const force = (config.mouseRadius - dist) / config.mouseRadius;
          this.vx -= (dx / dist) * force * 0.012;
          this.vy -= (dy / dist) * force * 0.012;
          this.opacity = Math.min(0.8, this.opacity + force * 0.25);
        } else {
          this.opacity += (0.3 - this.opacity) * 0.02;
        }
      }

      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > config.speed * 2.5) {
        this.vx = (this.vx / speed) * config.speed * 2.5;
        this.vy = (this.vy / speed) * config.speed * 2.5;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 60%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? Math.floor(config.particleCount * 0.4) : config.particleCount;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.maxDistance) {
          const opacity = (1 - dist / config.maxDistance) * 0.1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(40, 80%, 55%, ${opacity})`;
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }

    if (mouse.x !== null) {
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.mouseRadius) {
          const opacity = (1 - dist / config.mouseRadius) * 0.15;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `hsla(38, 85%, 60%, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    }
  }

  function animate() {
    time++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update(time);
      p.draw();
    });
    drawLines();
    animationId = requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });

  resize();
  createParticles();
  animate();
}

/* ========================
   CURSOR GLOW (Hero only)
   ======================== */
function initCursorGlow() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let isInHero = false;

  hero.addEventListener('mouseenter', () => {
    isInHero = true;
    glow.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', () => {
    isInHero = false;
    glow.style.opacity = '0';
  });

  document.addEventListener('mousemove', (e) => {
    if (isInHero) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  });
}

/* ========================
   NAVBAR
   ======================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ========================
   MOBILE MENU
   ======================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ========================
   SCROLL REVEAL
   ======================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px',
  });

  reveals.forEach(el => observer.observe(el));
}

/* ========================
   ACTIVE SECTION
   ======================== */
function initActiveSectionHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '-80px 0px -50% 0px',
  });

  sections.forEach(section => observer.observe(section));
}

/* ========================
   ANIMATED COUNTERS
   ======================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.counter, 10);
  const suffix = element.dataset.suffix || '';
  const prefix = element.dataset.prefix || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeOut * target);

    element.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ========================
   BACK TO TOP
   ======================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.pageYOffset > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========================
   SMOOTH SCROLL
   ======================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ========================
   CONTACT FORM
   ======================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    
    // Hide previous messages
    if (successMsg) successMsg.classList.remove('show');
    if (errorMsg) errorMsg.classList.remove('show');

    // Replace these with your actual IDs
    emailjs.sendForm('service_yophgse', 'template_aqs9etd', form)
      .then(() => {
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
        if (successMsg) successMsg.classList.add('show');
        form.reset();

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          if (successMsg) successMsg.classList.remove('show');
        }, 5000);
      })
      .catch((error) => {
        console.error('EmailJS Error:', error);
        btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Failed';
        if (errorMsg) errorMsg.classList.add('show');

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          if (errorMsg) errorMsg.classList.remove('show');
        }, 5000);
      });
  });
}
