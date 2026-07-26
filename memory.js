/**
 * SocioDex Flagship Memory Page Interactive Engine
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initPresetSwitcher();
  initLetterFolds();
  initAudioPlayers();
  initReactionParticles();
  initWallFilters();
  initLightbox();
  initCreationModal();
  initConfetti();
});

/* ==========================================================================
   1. CELEBRATION PRESET SWITCHER ENGINE
   ========================================================================== */
const presetsData = {
  birthday: {
    title: "Happy 30th Birthday, Sarah! ✨",
    subtitle: "Golden Hour Backyard Party — Gathered with 247 friends and family from around the world.",
    occasionTag: "🎂 Birthday Celebration",
    coverImg: "assets/images/birthday.jpg",
    portraitImg: "assets/images/birthday.jpg",
    waxIcon: "✨",
    contributors: "247",
    wishes: "386",
    photos: "812",
    videos: "34",
    storyText: `"Today we're celebrating someone who has inspired friends, family, and colleagues through kindness, curiosity, and unforgettable memories. Turning 30 isn't just another year—it's a celebration of every life you've touched."`,
    creatorName: "David Vance & Family",
    creatorRel: "Organized with love for Sarah • July 2026",
    themeColor: "#E4603C"
  },
  wedding: {
    title: "Rahul & Priya's Wedding 💍",
    subtitle: "Sunset Vineyard Ceremony & Reception — 312 guests celebrating forever love.",
    occasionTag: "💍 Wedding Celebration",
    coverImg: "assets/images/wedding.jpg",
    portraitImg: "assets/images/wedding.jpg",
    waxIcon: "💍",
    contributors: "312",
    wishes: "540",
    photos: "1,200",
    videos: "58",
    storyText: `"From college study groups to walking down the aisle together, Rahul and Priya's love story has been an anchor for all of us. Thank you for sharing your big day with everyone!"`,
    creatorName: "Ananya & Rohan (Maid of Honor & Best Man)",
    creatorRel: "Curated for Rahul & Priya • June 2026",
    themeColor: "#C94B29"
  },
  farewell: {
    title: "Farewell, Michael! 👋",
    subtitle: "5 Incredible Years of Leadership, Product Vision, and Unmatched Team Spirit.",
    occasionTag: "👋 Farewell Tribute",
    coverImg: "assets/images/farewell.jpg",
    portraitImg: "assets/images/farewell.jpg",
    waxIcon: "🎓",
    contributors: "184",
    wishes: "290",
    photos: "450",
    videos: "22",
    storyText: `"Five incredible years of mentorship, late-night release celebrations, and endless laughs. Michael, you may be moving to new adventures, but your impact will remain forever."`,
    creatorName: "Engineering & Design Guild",
    creatorRel: "Created by Colleagues • May 2026",
    themeColor: "#5C3A50"
  },
  team: {
    title: "Team Alpha Product Milestone 🏆",
    subtitle: "Celebrating 1,000,000 users and 3 years of relentless innovation.",
    occasionTag: "🏆 Team Milestone",
    coverImg: "assets/images/birthday.jpg",
    portraitImg: "assets/images/farewell.jpg",
    waxIcon: "🚀",
    contributors: "95",
    wishes: "160",
    photos: "380",
    videos: "18",
    storyText: `"Three years ago we started with an idea scribbled on a napkin. Today we celebrate the sweat, late nights, and triumph of Team Alpha."`,
    creatorName: "Founding Team",
    creatorRel: "SocioDex Milestone • April 2026",
    themeColor: "#3D2436"
  }
};

function initPresetSwitcher() {
  const buttons = document.querySelectorAll('#preset-selector-group .preset-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      if (!presetsData[presetKey]) return;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      applyPreset(presetsData[presetKey]);
      triggerConfettiExplosion();
    });
  });
}

function applyPreset(data) {
  const mainTitle = document.getElementById('hero-main-title');
  const subtitle = document.getElementById('hero-subtitle-text');
  const occasionTag = document.getElementById('hero-occasion-tag');
  const coverImg = document.getElementById('hero-cover-image');
  const portraitImg = document.getElementById('hero-portrait-image');
  const waxBadge = document.getElementById('hero-wax-badge');

  const countContrib = document.getElementById('stat-contributors-count');
  const countWishes = document.getElementById('stat-wishes-count');
  const countPhotos = document.getElementById('stat-photos-count');
  const countVideos = document.getElementById('stat-videos-count');

  const storyText = document.getElementById('story-body-text');
  const creatorName = document.getElementById('story-creator-name');
  const creatorRel = document.getElementById('story-creator-rel');

  if (mainTitle) mainTitle.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
  if (occasionTag) occasionTag.textContent = data.occasionTag;
  if (coverImg) coverImg.src = data.coverImg;
  if (portraitImg) portraitImg.src = data.portraitImg;
  if (waxBadge) waxBadge.textContent = data.waxIcon;

  if (countContrib) countContrib.textContent = data.contributors;
  if (countWishes) countWishes.textContent = data.wishes;
  if (countPhotos) countPhotos.textContent = data.photos;
  if (countVideos) countVideos.textContent = data.videos;

  if (storyText) storyText.textContent = data.storyText;
  if (creatorName) creatorName.textContent = data.creatorName;
  if (creatorRel) creatorRel.textContent = data.creatorRel;

  document.documentElement.style.setProperty('--color-terracotta', data.themeColor);
}

/* ==========================================================================
   2. LETTER FOLDABLE TOGGLE
   ========================================================================== */
function initLetterFolds() {
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.letter-fold-toggle');
    if (!toggle) return;

    const container = toggle.closest('.letter-foldable');
    if (!container) return;

    container.classList.toggle('open');
    if (container.classList.contains('open')) {
      toggle.textContent = '✉️ Close Letter';
    } else {
      toggle.textContent = '✉️ Open Full Letter...';
    }
  });
}

/* ==========================================================================
   3. AUDIO VOICE NOTE PLAYERS
   ========================================================================== */
function initAudioPlayers() {
  document.addEventListener('click', (e) => {
    const playBtn = e.target.closest('.audio-play-btn');
    if (!playBtn) return;

    const box = playBtn.closest('.audio-player-box');
    if (!box) return;

    const isPlaying = box.classList.contains('playing');
    
    // Stop all other audio boxes first
    document.querySelectorAll('.audio-player-box').forEach(b => {
      b.classList.remove('playing');
      const btn = b.querySelector('.audio-play-btn');
      if (btn) btn.textContent = '▶';
    });

    if (!isPlaying) {
      box.classList.add('playing');
      playBtn.textContent = '❚❚';
    } else {
      box.classList.remove('playing');
      playBtn.textContent = '▶';
    }
  });
}

/* ==========================================================================
   4. REACTION HEART PARTICLES
   ========================================================================== */
function initReactionParticles() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.reaction-trigger');
    if (!btn) return;

    const countSpan = btn.querySelector('.reaction-count');
    if (countSpan) {
      let count = parseInt(countSpan.textContent, 10);
      countSpan.textContent = count + 1;
    }
    btn.classList.add('liked');

    createHeartParticle(e.clientX, e.clientY);
  });
}

function createHeartParticle(x, y) {
  const particle = document.createElement('div');
  particle.innerHTML = '❤️';
  particle.style.position = 'fixed';
  particle.style.left = `${x - 10}px`;
  particle.style.top = `${y - 10}px`;
  particle.style.fontSize = '1.5rem';
  particle.style.pointerEvents = 'none';
  particle.style.zIndex = '999999';
  particle.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';

  document.body.appendChild(particle);

  requestAnimationFrame(() => {
    particle.style.transform = `translate(${(Math.random() - 0.5) * 60}px, -100px) scale(1.5)`;
    particle.style.opacity = '0';
  });

  setTimeout(() => particle.remove(), 1000);
}

/* ==========================================================================
   5. WALL CATEGORY FILTERS
   ========================================================================== */
function initWallFilters() {
  const filterBtns = document.querySelectorAll('.wall-filter-btn');
  const keepsakeCards = document.querySelectorAll('.keepsake-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      keepsakeCards.forEach(card => {
        if (filter === 'all' || card.dataset.type === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. LIGHTBOX MODAL
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-img');
  const authorEl = document.getElementById('lightbox-author');
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src;
      const author = item.dataset.author;
      const caption = item.dataset.caption;

      if (imgEl) imgEl.src = src;
      if (authorEl) authorEl.textContent = `Contributed by ${author}`;
      if (captionEl) captionEl.textContent = caption;

      if (modal) modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

/* ==========================================================================
   7. MEMORY CREATION MODAL & PROMPT DRAWER
   ========================================================================== */
function initCreationModal() {
  const modal = document.getElementById('creation-modal');
  const triggerBtn = document.getElementById('trigger-memory-modal');
  const closeBtn = document.getElementById('close-creation-modal');
  const form = document.getElementById('creation-form');
  const promptCards = document.querySelectorAll('.prompt-trigger-card');
  const messageInput = document.getElementById('input-message');

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => modal.classList.add('active'));
  }

  promptCards.forEach(card => {
    card.addEventListener('click', () => {
      const promptText = card.dataset.prompt;
      if (messageInput) messageInput.value = `"${promptText}"\n\n`;
      if (modal) modal.classList.add('active');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  // Type selector toggles inside modal
  const typeBtns = document.querySelectorAll('.type-btn');
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Handle new memory submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const author = document.getElementById('input-author').value;
      const rel = document.getElementById('input-rel').value;
      const msg = document.getElementById('input-message').value;

      // Append new memory card dynamically to the wall
      appendKeepsakeCard(author, rel, msg);

      // Increment stats counter
      const wishesCountEl = document.getElementById('stat-wishes-count');
      if (wishesCountEl) {
        let current = parseInt(wishesCountEl.textContent.replace(',', ''), 10);
        wishesCountEl.textContent = (current + 1).toLocaleString();
      }

      form.reset();
      modal.classList.remove('active');

      triggerConfettiExplosion();
    });
  }
}

function appendKeepsakeCard(author, rel, msg) {
  const wall = document.getElementById('keepsake-grid');
  if (!wall) return;

  const card = document.createElement('div');
  card.className = 'keepsake-card card-style-letter';
  card.dataset.type = 'wish';

  card.innerHTML = `
    <div class="card-header-bar">
      <div class="contributor-meta">
        <div class="contributor-avatar" style="background-color:var(--color-terracotta);">${author.substring(0,2).toUpperCase()}</div>
        <div>
          <div class="contributor-name">${author}</div>
          <div class="contributor-tag">${rel}</div>
        </div>
      </div>
      <span class="card-timestamp">Just now</span>
    </div>
    <p class="keepsake-text">"${msg}"</p>
    <div class="keepsake-card-footer">
      <div class="reaction-btn-group">
        <button class="reaction-btn reaction-trigger"><span class="reaction-icon">❤️</span> <span class="reaction-count">1</span></button>
      </div>
      <span style="font-size:0.75rem; color:var(--color-ink-light);">New Keepsake</span>
    </div>
  `;

  wall.prepend(card);
}

/* ==========================================================================
   8. CANVAS CONFETTI PHYSICS ENGINE
   ========================================================================== */
let canvas, ctx, particles = [];

function initConfetti() {
  canvas = document.getElementById('memory-confetti-canvas');
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
  const colors = ['#E4603C', '#EBC85A', '#3D2436', '#C94B29', '#FAF4E8'];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
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
    p.vy += 0.35;
    p.opacity -= 0.015;
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
