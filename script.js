/**
 * SocioDex Launch Landing Page Script
 * Crafted with Vanilla JavaScript (No External Libraries)
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNavbarScroll();
  initIntersectionObserver();
  initFaqAccordion();
  initMockupTabs();
  initInteractiveReactions();
  initModals();
  initCanvasConfetti();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. SCROLL PROGRESS INDICATOR
   -------------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* --------------------------------------------------------------------------
   2. NAVBAR BLUR & SCROLLED STATE
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   3. INTERSECTION OBSERVER FOR ANIMATIONS
   -------------------------------------------------------------------------- */
function initIntersectionObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.reveal-fade-up, .reveal-scale-in, .reveal-fade-left, .reveal-fade-right'
  );

  animatedElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items first
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. MOCKUP INTERACTIVE TABS
   -------------------------------------------------------------------------- */
function initMockupTabs() {
  const tabs = document.querySelectorAll('.mockup-tab');
  const feedCards = document.querySelectorAll('.feed-card-dynamic');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;
      if (!category) return;

      feedCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'block';
          card.classList.add('reveal-active');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. INTERACTIVE HEART & REACTION COUNTERS
   -------------------------------------------------------------------------- */
function initInteractiveReactions() {
  const likeButtons = document.querySelectorAll('.like-btn-demo');

  likeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const countSpan = btn.querySelector('.heart-count');
      if (countSpan) {
        let currentCount = parseInt(countSpan.textContent, 10);
        countSpan.textContent = currentCount + 1;
      }

      // Create floating heart particle effect
      createHeartParticle(e.clientX, e.clientY);
    });
  });
}

function createHeartParticle(x, y) {
  const heart = document.createElement('div');
  heart.innerHTML = '❤️';
  heart.style.position = 'fixed';
  heart.style.left = `${x - 10}px`;
  heart.style.top = `${y - 10}px`;
  heart.style.fontSize = '1.4rem';
  heart.style.pointerEvents = 'none';
  heart.style.zIndex = '9999';
  heart.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
  heart.style.opacity = '1';

  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = `translate(${Math.random() * 40 - 20}px, -80px) scale(1.4)`;
    heart.style.opacity = '0';
  });

  setTimeout(() => {
    heart.remove();
  }, 1000);
}

/* --------------------------------------------------------------------------
   7. MODAL TOGGLES
   -------------------------------------------------------------------------- */
function initModals() {
  const earlyAccessBtns = document.querySelectorAll('.btn-trigger-early-access');
  const demoBtns = document.querySelectorAll('.btn-trigger-demo');
  const earlyAccessModal = document.getElementById('early-access-modal');
  const demoModal = document.getElementById('demo-modal');
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-overlay');

  earlyAccessBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (earlyAccessModal) earlyAccessModal.classList.add('active');
    });
  });

  demoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (demoModal) demoModal.classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || btn.classList.contains('modal-close-btn')) {
        if (earlyAccessModal) earlyAccessModal.classList.remove('active');
        if (demoModal) demoModal.classList.remove('active');
      }
    });
  });

  // Early access form submit
  const form = document.getElementById('early-access-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMessage = document.getElementById('form-success-state');
      form.style.display = 'none';
      if (successMessage) successMessage.style.display = 'block';

      // Fire confetti celebration
      triggerConfettiExplosion();
    });
  }
}

/* --------------------------------------------------------------------------
   8. PURE JAVASCRIPT CANVAS CONFETTI
   -------------------------------------------------------------------------- */
let canvas, ctx, particles = [];

function initCanvasConfetti() {
  canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function triggerConfettiExplosion() {
  if (!canvas || !ctx) return;
  particles = [];
  const colors = ['#E4603C', '#EBC85A', '#3D2436', '#C94B29', '#FBF6EC'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  animateConfetti();
}

function animateConfetti() {
  if (!ctx || particles.length === 0) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3; // Gravity
    p.opacity -= 0.012;
    p.rotation += p.rotationSpeed;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.opacity);
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();

    if (p.opacity <= 0 || p.y > canvas.height) {
      particles.splice(index, 1);
    }
  });

  if (particles.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}

/* --------------------------------------------------------------------------
   9. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
