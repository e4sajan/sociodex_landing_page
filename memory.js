/**
 * SocioDex Flagship Memory Page Controller
 * Pure Vanilla JavaScript integrated with store.js
 */

let currentSlug = 'sarah-30th';
let currentMemory = null;
let currentUser = null;
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  // Parse URL Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const slugParam = urlParams.get('slug');
  const guestIdParam = urlParams.get('gid');

  if (slugParam) currentSlug = slugParam;

  currentUser = MemoryStore.getCurrentUser();

  // Load Memory Data
  loadMemoryPage(currentSlug, guestIdParam);

  initAuthHandlers();
  initUnwrapHandler();
  initPresetDemoBtns();
  initWallFilterBtns();
  initCreationModalHandlers();
  initAdminDrawerHandlers();
  initLightboxHandlers();
  initAudioPlayerListeners();
  initReactionListeners();
  initReplyListeners();
  initConfettiCanvas();
});

/* ==========================================================================
   1. MEMORY DATA RENDER ENGINE
   ========================================================================== */
function loadMemoryPage(slug, guestId) {
  currentMemory = MemoryStore.getMemoryBySlug(slug);

  if (!currentMemory) {
    // 404 State
    document.getElementById('main-memory-bar').style.display = 'none';
    document.getElementById('main-memory-content').style.display = 'none';
    document.getElementById('not-found-container').style.display = 'block';
    return;
  }

  // Seed sample contributions if empty
  currentMemory = MemoryStore.seedMemoryIfNeeded(currentMemory);

  // Apply Theme Colors
  const theme = THEMES[currentMemory.themeId] || THEMES.terracotta;
  document.documentElement.style.setProperty('--theme-bg', theme.bg);
  document.documentElement.style.setProperty('--theme-accent', theme.accent);
  document.documentElement.style.setProperty('--theme-card', theme.cardBg);

  // Render Header Details
  renderHeaderDetails();

  // Render Event Details (If invitation)
  renderInvitationDetails();

  // Render Guest RSVP Banner (If guest)
  renderGuestRSVP(guestId);

  // Render Featured Memories & Contribution Wall
  renderFeaturedMemories();
  renderKeepsakeWall();

  // Render Shared Gallery
  renderSharedGallery();

  // Render Host Admin Button State
  updateAdminButtonState();

  // Gift Unwrapping Reveal check
  const isRevealed = sessionStorage.getItem(`revealed_${slug}`);
  const overlay = document.getElementById('gift-unwrap-overlay');
  if (!isRevealed && overlay) {
    overlay.style.display = 'flex';
  } else if (overlay) {
    overlay.style.display = 'none';
  }
}

/* ==========================================================================
   2. HEADER & HERO DETAILS
   ========================================================================== */
function renderHeaderDetails() {
  const isWish = currentMemory.pageType === 'wish';
  const displayTitle = isWish 
    ? `Happy ${currentMemory.occasion}, ${currentMemory.recipient}! ✨`
    : `${currentMemory.coupleNames || 'Celebration'} 💍`;

  document.title = `${displayTitle} — SocioDex Memory Space`;

  const mainTitle = document.getElementById('hero-main-title');
  const subtitle = document.getElementById('hero-subtitle-text');
  const occasionTag = document.getElementById('hero-occasion-tag');
  const coverImg = document.getElementById('hero-cover-image');
  const portraitImg = document.getElementById('hero-portrait-image');

  const countContrib = document.getElementById('stat-contributors-count');
  const countWishes = document.getElementById('stat-wishes-count');
  const countPhotos = document.getElementById('stat-photos-count');

  const storyText = document.getElementById('story-body-text');
  const creatorName = document.getElementById('story-creator-name');
  const creatorRel = document.getElementById('story-creator-rel');

  if (mainTitle) mainTitle.textContent = displayTitle;
  if (subtitle) subtitle.textContent = `${currentMemory.occasion} Celebration — Hosted by ${currentMemory.from}`;
  if (occasionTag) occasionTag.textContent = `✨ ${currentMemory.occasion} Celebration`;

  if (coverImg && currentMemory.photos && currentMemory.photos.length > 0) {
    coverImg.src = currentMemory.photos[0];
  }
  if (portraitImg && currentMemory.photos && currentMemory.photos.length > 0) {
    portraitImg.src = currentMemory.photos[0];
  }

  // Corporate logo
  const logoWrap = document.getElementById('hero-corporate-logo-wrap');
  const logoImg = document.getElementById('hero-corporate-logo-img');
  if (currentMemory.isCorporate && currentMemory.corporateLogo && logoWrap && logoImg) {
    logoImg.src = currentMemory.corporateLogo;
    logoWrap.style.display = 'block';
  } else if (logoWrap) {
    logoWrap.style.display = 'none';
  }

  // Stats
  const approvedContribs = (currentMemory.contributions || []).filter(c => c.status === 'approved');
  if (countContrib) countContrib.textContent = Math.max(approvedContribs.length, 12);
  if (countWishes) countWishes.textContent = Math.max(approvedContribs.length, 18);
  if (countPhotos) countPhotos.textContent = (currentMemory.photos || []).length + 42;

  // Story
  if (storyText) {
    storyText.textContent = (currentMemory.wishes && currentMemory.wishes.length > 0)
      ? `"${currentMemory.wishes[0]}"`
      : `"Today we're celebrating someone who has inspired friends, family, and colleagues through kindness, curiosity, and unforgettable memories."`;
  }
  if (creatorName) creatorName.textContent = currentMemory.from || 'David Vance & Family';
  if (creatorRel) creatorRel.textContent = `Date: ${currentMemory.date || 'August 2026'}`;
}

/* ==========================================================================
   3. INVITATION DETAILS & GUEST RSVP
   ========================================================================== */
function renderInvitationDetails() {
  const section = document.getElementById('section-invitation-details');
  if (!section) return;

  if (currentMemory.isInvitation || currentMemory.pageType === 'invite') {
    section.style.display = 'block';

    const venueName = document.getElementById('invite-venue-name');
    const venueAddr = document.getElementById('invite-venue-addr');
    const mapsBtn = document.getElementById('btn-maps-link');
    const dressCode = document.getElementById('invite-dress-code');
    const registryNotes = document.getElementById('invite-registry-notes');
    const timelineContainer = document.getElementById('invite-schedule-timeline');

    if (venueName) venueName.textContent = currentMemory.venueName || 'Grand Garden Estate';
    if (venueAddr) venueAddr.textContent = currentMemory.venueAddress || '742 Evergreen Terrace, Springfield';
    if (mapsBtn && currentMemory.venueMapsUrl) mapsBtn.href = currentMemory.venueMapsUrl;
    if (dressCode) dressCode.textContent = currentMemory.dressCode || 'Garden Cocktail / Formal';
    if (registryNotes) registryNotes.textContent = currentMemory.registryInfo || 'Your presence is our gift!';

    if (timelineContainer) {
      timelineContainer.innerHTML = '';
      const schedule = (currentMemory.timeline && currentMemory.timeline.length > 0)
        ? currentMemory.timeline
        : [
            { time: '5:00 PM', event: 'Guest Arrival & Welcome Champagne' },
            { time: '6:00 PM', event: 'Ceremony & Toasts' },
            { time: '7:30 PM', event: 'Dinner & Live Music' }
          ];

      schedule.forEach(row => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.gap = '1rem';
        item.style.alignItems = 'center';
        item.style.padding = '0.6rem 0.8rem';
        item.style.background = 'white';
        item.style.borderRadius = '12px';
        item.style.border = '1px solid rgba(36,22,33,0.08)';
        item.innerHTML = `
          <strong style="color:var(--theme-accent); font-size:0.9rem; min-width:80px;">${row.time}</strong>
          <span style="font-size:0.95rem; color:var(--color-ink);">${row.event}</span>
        `;
        timelineContainer.appendChild(item);
      });
    }
  } else {
    section.style.display = 'none';
  }
}

function renderGuestRSVP(guestId) {
  const wrap = document.getElementById('guest-rsvp-banner-wrap');
  if (!wrap) return;

  if (guestId || (currentMemory.rsvps && Object.keys(currentMemory.rsvps).length > 0)) {
    wrap.style.display = 'block';
    const guestKey = guestId || 'guest-1';
    const rsvp = currentMemory.rsvps[guestKey] || { name: 'Guest Friend', status: 'pending' };

    const guestNameEl = document.getElementById('rsvp-guest-name-text');
    const detailEl = document.getElementById('rsvp-status-detail-text');
    const btnAttend = document.getElementById('btn-rsvp-attending');
    const btnDecline = document.getElementById('btn-rsvp-declined');

    if (guestNameEl) guestNameEl.textContent = `Hi ${rsvp.name || 'Guest'}! Will you be joining us?`;
    if (detailEl) {
      detailEl.textContent = rsvp.status === 'attending'
        ? '✓ You are confirmed as Attending!'
        : rsvp.status === 'declined'
        ? '✕ You marked as Declined.'
        : 'Please confirm your attendance below.';
    }

    if (btnAttend) {
      btnAttend.onclick = () => {
        MemoryStore.updateMemory(currentMemory.slug, (mem) => {
          mem.rsvps = mem.rsvps || {};
          mem.rsvps[guestKey] = { guestId: guestKey, name: rsvp.name || 'Guest', status: 'attending', timestamp: new Date().toISOString() };
          return mem;
        });
        loadMemoryPage(currentMemory.slug, guestKey);
        triggerConfettiExplosion();
      };
    }

    if (btnDecline) {
      btnDecline.onclick = () => {
        MemoryStore.updateMemory(currentMemory.slug, (mem) => {
          mem.rsvps = mem.rsvps || {};
          mem.rsvps[guestKey] = { guestId: guestKey, name: rsvp.name || 'Guest', status: 'declined', timestamp: new Date().toISOString() };
          return mem;
        });
        loadMemoryPage(currentMemory.slug, guestKey);
      };
    }

    // RSVP Stat count update
    const attendingCount = Object.values(currentMemory.rsvps || {}).filter(r => r.status === 'attending').length;
    const rsvpPill = document.getElementById('stat-rsvp-pill');
    const rsvpCountEl = document.getElementById('stat-rsvp-count');
    if (rsvpPill && rsvpCountEl) {
      rsvpCountEl.textContent = attendingCount;
      rsvpPill.style.display = 'flex';
    }
  } else {
    wrap.style.display = 'none';
  }
}

/* ==========================================================================
   4. FEATURED & KEEPSAKE WALL RENDERER
   ========================================================================== */
function renderFeaturedMemories() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const contribs = (currentMemory.contributions || []).filter(c => c.status === 'approved');

  if (contribs.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--color-ink-muted);">No featured memories yet. Be the first to leave one below!</p>`;
    return;
  }

  contribs.slice(0, 4).forEach((c, idx) => {
    const card = document.createElement('div');
    card.className = 'featured-card';
    const badges = ['❤️ Most Heartfelt', '📸 Favorite Photo', '🎙️ Audio Highlight', '⭐ Creator Pick'];
    
    card.innerHTML = `
      <span class="pin-badge">${badges[idx % badges.length]}</span>
      <p style="font-size:1.05rem; font-style:italic; margin-bottom:1rem; color:var(--color-ink);">"${c.text}"</p>
      ${c.mediaUrl ? `<div style="border-radius:12px; overflow:hidden; height:160px; margin-bottom:1rem;"><img src="${c.mediaUrl}" style="width:100%; height:100%; object-fit:cover;"></div>` : ''}
      <div style="display:flex; align-items:center; gap:0.6rem; margin-top:auto; padding-top:0.6rem; border-top:1px solid rgba(36,22,33,0.08);">
        <div style="width:32px; height:32px; border-radius:50%; background:var(--theme-accent); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.8rem;">${c.authorAvatar || 'EW'}</div>
        <div>
          <strong style="font-size:0.85rem; display:block;">${c.authorName}</strong>
          <span style="font-size:0.75rem; color:var(--color-ink-muted);">${c.timestamp}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderKeepsakeWall() {
  const wall = document.getElementById('keepsake-grid');
  if (!wall) return;
  wall.innerHTML = '';

  const isOwner = MemoryStore.isOwnerOrAdmin(currentMemory, currentUser);
  let list = (currentMemory.contributions || []).filter(c => isOwner || c.status === 'approved');

  // Filter by category
  if (currentFilter !== 'all') {
    list = list.filter(c => c.mediaType === currentFilter);
  }

  // Sort pinned first, then newest
  list.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  if (list.length === 0) {
    wall.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--color-ink-muted); padding:2rem;">No keepsakes found in this category.</p>`;
    return;
  }

  list.forEach(c => {
    const card = document.createElement('div');
    card.className = `keepsake-card ${c.mediaType === 'photo' ? 'card-style-polaroid' : 'card-style-letter'}`;
    card.dataset.id = c.id;

    // Reactions count
    const rx = (currentMemory.reactions && currentMemory.reactions[c.id]) || { heart: [], clap: [], hug: [] };
    const userEmail = currentUser ? currentUser.email : '';
    const userReacted = rx.heart.includes(userEmail) ? 'heart' : rx.clap.includes(userEmail) ? 'clap' : rx.hug.includes(userEmail) ? 'hug' : null;

    // Replies
    const replies = (currentMemory.replies && currentMemory.replies[c.id]) || [];

    card.innerHTML = `
      ${c.isPinned ? `<span class="pin-badge">📌 Pinned by Host</span>` : ''}
      ${c.status === 'pending' ? `<span class="pending-badge">⏳ Pending Moderation</span>` : ''}

      ${c.mediaType === 'photo' && c.mediaUrl ? `
        <div style="border-radius:14px; overflow:hidden; margin-bottom:0.8rem; height:200px;">
          <img src="${c.mediaUrl}" style="width:100%; height:100%; object-fit:cover;">
        </div>
      ` : ''}

      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.6rem;">
        <div style="display:flex; align-items:center; gap:0.6rem;">
          <div style="width:36px; height:36px; border-radius:50%; background:var(--theme-accent); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.85rem;">
            ${c.authorAvatar || (c.authorName ? c.authorName.substring(0, 2).toUpperCase() : 'G')}
          </div>
          <div>
            <strong style="font-size:0.9rem; display:block;">${c.authorName}</strong>
            <span style="font-size:0.75rem; color:var(--color-ink-muted);">${c.timestamp}</span>
          </div>
        </div>
      </div>

      ${c.mediaType === 'audio' ? `
        <div class="audio-player-box">
          <button type="button" class="audio-play-btn">▶</button>
          <div class="audio-waveform-canvas">
            <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
            <div class="wave-bar"></div><div class="wave-bar"></div><div class="wave-bar"></div>
          </div>
          <span style="font-size:0.75rem;">0:35</span>
        </div>
      ` : ''}

      <p style="font-size:0.95rem; color:var(--color-ink); line-height:1.5; margin-bottom:0.8rem;">"${c.text}"</p>

      <!-- Reactions Bar (Single choice) -->
      <div style="display:flex; align-items:center; justify-content:space-between; padding-top:0.6rem; border-top:1px solid rgba(36,22,33,0.08);">
        <div class="reaction-btn-group" data-cid="${c.id}">
          <button type="button" class="reaction-btn ${userReacted === 'heart' ? 'active' : ''}" data-type="heart">❤️ ${(rx.heart || []).length}</button>
          <button type="button" class="reaction-btn ${userReacted === 'clap' ? 'active' : ''}" data-type="clap">👏 ${(rx.clap || []).length}</button>
          <button type="button" class="reaction-btn ${userReacted === 'hug' ? 'active' : ''}" data-type="hug">🫂 ${(rx.hug || []).length}</button>
        </div>

        <button type="button" class="wall-filter-btn btn-toggle-replies" style="padding:0.25rem 0.6rem; font-size:0.75rem;" data-cid="${c.id}">
          💬 Replies (${replies.length})
        </button>
      </div>

      <!-- Replies Thread Container -->
      <div class="replies-thread-box" id="replies-box-${c.id}" style="display:none;">
        <div class="replies-list" id="replies-list-${c.id}">
          ${replies.map(r => `
            <div class="reply-item">
              <strong style="font-size:0.8rem;">${r.authorName}:</strong> ${r.text}
            </div>
          `).join('')}
        </div>

        <div style="display:flex; gap:0.4rem; margin-top:0.6rem;">
          <input type="text" class="creation-input input-reply-text" placeholder="Write a reply..." style="padding:0.4rem 0.6rem; font-size:0.85rem;" data-cid="${c.id}">
          <button type="button" class="btn-add-memory btn-submit-reply" style="padding:0.4rem 0.8rem; font-size:0.8rem;" data-cid="${c.id}">Reply</button>
        </div>
      </div>

      <!-- Owner Moderation Actions -->
      ${isOwner ? `
        <div style="display:flex; gap:0.4rem; margin-top:0.6rem; padding-top:0.4rem; border-top:1px dashed rgba(36,22,33,0.1);">
          <button type="button" class="wall-filter-btn btn-owner-pin" style="padding:0.2rem 0.5rem; font-size:0.75rem;" data-cid="${c.id}">
            ${c.isPinned ? 'Unpin' : '📌 Pin'}
          </button>
          <button type="button" class="wall-filter-btn btn-owner-delete" style="padding:0.2rem 0.5rem; font-size:0.75rem; color:#B83227;" data-cid="${c.id}">
            🗑️ Delete
          </button>
        </div>
      ` : ''}
    `;

    wall.appendChild(card);
  });
}

function renderSharedGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const photos = currentMemory.photos || ['assets/images/birthday.jpg', 'assets/images/wedding.jpg', 'assets/images/farewell.jpg'];

  photos.forEach((src, idx) => {
    const item = document.createElement('div');
    item.className = `gallery-item ${idx % 3 === 0 ? 'tall' : ''}`;
    item.dataset.src = src;
    item.dataset.author = currentMemory.from || 'Host';
    item.dataset.caption = `Shared Memory #${idx + 1}`;

    item.innerHTML = `
      <img src="${src}" alt="Shared Photo ${idx}">
      <div class="gallery-overlay-meta">
        <div class="gallery-uploader">${currentMemory.from}</div>
        <div class="gallery-caption">Memory #${idx + 1}</div>
      </div>
    `;
    grid.appendChild(item);
  });
}

/* ==========================================================================
   5. AUTH SIMULATOR & USER BADGE
   ========================================================================== */
function updateAdminButtonState() {
  const adminBtn = document.getElementById('btn-toggle-admin-drawer');
  const authBadge = document.getElementById('btn-user-auth-badge');

  if (authBadge) {
    if (currentUser) {
      authBadge.textContent = `👤 ${currentUser.name}`;
      authBadge.title = `Logged in as ${currentUser.email}`;
    } else {
      authBadge.textContent = `👤 Sign In`;
    }
  }

  if (adminBtn) {
    const isOwner = MemoryStore.isOwnerOrAdmin(currentMemory, currentUser);
    adminBtn.style.display = isOwner ? 'inline-flex' : 'none';
  }
}

function initAuthHandlers() {
  const authBadge = document.getElementById('btn-user-auth-badge');
  const authModal = document.getElementById('sim-auth-modal');
  const authClose = document.getElementById('close-auth-modal');
  const authForm = document.getElementById('sim-auth-form');

  if (authBadge && authModal) {
    authBadge.addEventListener('click', () => {
      authModal.classList.add('active');
    });
  }

  if (authClose && authModal) {
    authClose.addEventListener('click', () => authModal.classList.remove('active'));
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('auth-input-name').value;
      const email = document.getElementById('auth-input-email').value;

      currentUser = MemoryStore.loginUser(name, email);
      authModal.classList.remove('active');

      updateAdminButtonState();
      renderKeepsakeWall();

      alert(`Welcome ${name}! You are now signed in as ${email}.`);
    });
  }
}

/* ==========================================================================
   6. UNWRAP & PRESETS DEMO
   ========================================================================== */
function initUnwrapHandler() {
  const unwrapBtn = document.getElementById('btn-unwrap-gift');
  const overlay = document.getElementById('gift-unwrap-overlay');

  if (unwrapBtn && overlay) {
    unwrapBtn.addEventListener('click', () => {
      triggerConfettiExplosion();
      sessionStorage.setItem(`revealed_${currentMemory.slug}`, 'true');
      overlay.style.opacity = '0';
      setTimeout(() => overlay.style.display = 'none', 500);
    });
  }
}

function initPresetDemoBtns() {
  const btns = document.querySelectorAll('#preset-selector-group .preset-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const presetKey = btn.dataset.preset;
      let slug = 'sarah-30th';
      if (presetKey === 'wedding') slug = 'demo-wedding';
      if (presetKey === 'farewell') slug = 'demo-farewell';
      if (presetKey === 'team') slug = 'demo-team';

      window.history.pushState({}, '', `memory.html?slug=${slug}`);
      currentSlug = slug;
      loadMemoryPage(currentSlug, null);
    });
  });
}

function initWallFilterBtns() {
  const btns = document.querySelectorAll('.wall-filter-btn[data-filter]');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderKeepsakeWall();
    });
  });
}

/* ==========================================================================
   7. CREATION MODAL & POSTING WITH SIMULATED UPLOAD
   ========================================================================== */
function initCreationModalHandlers() {
  const triggerBtn = document.getElementById('trigger-memory-modal');
  const modal = document.getElementById('creation-modal');
  const closeBtn = document.getElementById('close-creation-modal');
  const form = document.getElementById('creation-form');
  const promptCards = document.querySelectorAll('.prompt-trigger-card');
  const messageInput = document.getElementById('input-message');
  const typeBtns = document.querySelectorAll('.media-type-selector .type-btn');
  const photoGroup = document.getElementById('modal-photo-upload-group');

  if (triggerBtn && modal) {
    triggerBtn.addEventListener('click', () => openCreationModal());
  }

  promptCards.forEach(card => {
    card.addEventListener('click', () => {
      const promptText = card.dataset.prompt;
      if (messageInput) messageInput.value = `"${promptText}"\n\n`;
      openCreationModal();
    });
  });

  function openCreationModal() {
    // Check contributionMode
    if (currentMemory.contributionMode === 'closed') {
      alert('Contributions for this memory page are currently closed by the host.');
      return;
    }

    if (!currentUser) {
      const authModal = document.getElementById('sim-auth-modal');
      if (authModal) authModal.classList.add('active');
      return;
    }

    if (modal) modal.classList.add('active');
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.dataset.type;
      if (photoGroup) photoGroup.style.display = type === 'photo' ? 'block' : 'none';
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const authorName = document.getElementById('input-author').value;
      const authorRel = document.getElementById('input-rel').value;
      const text = document.getElementById('input-message').value;
      const activeTypeBtn = document.querySelector('.media-type-selector .type-btn.active');
      const mediaType = activeTypeBtn ? activeTypeBtn.dataset.type : 'wish';

      const photoInput = document.getElementById('modal-photo-file');
      let uploadedPhotoUrl = null;

      const progressWrap = document.getElementById('upload-progress-bar-wrap');
      const progressFill = document.getElementById('upload-progress-fill');
      const submitBtn = document.getElementById('btn-submit-keepsake');

      if (submitBtn) submitBtn.disabled = true;
      if (progressWrap && progressFill) {
        progressWrap.style.display = 'block';
        progressFill.style.width = '0%';
        setTimeout(() => progressFill.style.width = '60%', 300);
        setTimeout(() => progressFill.style.width = '100%', 700);
      }

      setTimeout(() => {
        if (photoInput && photoInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            uploadedPhotoUrl = evt.target.result;
            saveNewContribution(authorName, authorRel, text, mediaType, uploadedPhotoUrl);
          };
          reader.readAsDataURL(photoInput.files[0]);
        } else {
          saveNewContribution(authorName, authorRel, text, mediaType, null);
        }
      }, 800);
    });
  }
}

function saveNewContribution(authorName, authorRel, text, mediaType, photoUrl) {
  const isAutoApprove = currentMemory.autoApprove !== false;
  const status = isAutoApprove ? 'approved' : 'pending';

  const newContrib = {
    id: `c_${Date.now()}`,
    authorName: authorName,
    authorEmail: currentUser ? currentUser.email : 'guest@example.com',
    authorAvatar: authorName.substring(0, 2).toUpperCase(),
    timestamp: 'Just now',
    text: text,
    mediaType: mediaType,
    mediaUrl: photoUrl || (mediaType === 'photo' ? 'assets/images/birthday.jpg' : null),
    status: status,
    isPinned: false
  };

  MemoryStore.updateMemory(currentMemory.slug, (mem) => {
    mem.contributions = mem.contributions || [];
    mem.contributions.unshift(newContrib);
    return mem;
  });

  loadMemoryPage(currentMemory.slug, null);

  const modal = document.getElementById('creation-modal');
  const progressWrap = document.getElementById('upload-progress-bar-wrap');
  const submitBtn = document.getElementById('btn-submit-keepsake');

  if (submitBtn) submitBtn.disabled = false;
  if (progressWrap) progressWrap.style.display = 'none';
  if (modal) modal.classList.remove('active');

  if (status === 'approved') {
    triggerConfettiExplosion();
    alert('✨ Your keepsake has been posted to the celebration wall!');
  } else {
    alert('⏳ Your keepsake has been submitted and is pending host approval.');
  }
}

/* ==========================================================================
   8. SINGLE-CHOICE REACTIONS & REPLIES
   ========================================================================== */
function initReactionListeners() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.reaction-btn');
    if (!btn) return;

    const group = btn.closest('.reaction-btn-group');
    if (!group) return;

    if (!currentUser) {
      const authModal = document.getElementById('sim-auth-modal');
      if (authModal) authModal.classList.add('active');
      return;
    }

    const cid = group.dataset.cid;
    const reactType = btn.dataset.type;
    const userEmail = currentUser.email;

    MemoryStore.updateMemory(currentMemory.slug, (mem) => {
      mem.reactions = mem.reactions || {};
      mem.reactions[cid] = mem.reactions[cid] || { heart: [], clap: [], hug: [] };

      const rx = mem.reactions[cid];
      // Single choice: remove from all other reaction types first
      ['heart', 'clap', 'hug'].forEach(t => {
        rx[t] = (rx[t] || []).filter(em => em !== userEmail);
      });

      // Toggle current reaction
      if (!btn.classList.contains('active')) {
        rx[reactType].push(userEmail);
      }

      return mem;
    });

    loadMemoryPage(currentMemory.slug, null);
  });
}

function initReplyListeners() {
  document.addEventListener('click', (e) => {
    // Toggle reply thread view
    if (e.target.classList.contains('btn-toggle-replies')) {
      const cid = e.target.dataset.cid;
      const box = document.getElementById(`replies-box-${cid}`);
      if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
    }

    // Submit new reply
    if (e.target.classList.contains('btn-submit-reply')) {
      const cid = e.target.dataset.cid;
      const input = document.querySelector(`.input-reply-text[data-cid="${cid}"]`);
      if (!input || !input.value.trim()) return;

      if (!currentUser) {
        const authModal = document.getElementById('sim-auth-modal');
        if (authModal) authModal.classList.add('active');
        return;
      }

      const replyText = input.value.trim();

      MemoryStore.updateMemory(currentMemory.slug, (mem) => {
        mem.replies = mem.replies || {};
        mem.replies[cid] = mem.replies[cid] || [];
        mem.replies[cid].push({
          id: `r_${Date.now()}`,
          authorName: currentUser.name,
          authorEmail: currentUser.email,
          timestamp: 'Just now',
          text: replyText
        });
        return mem;
      });

      loadMemoryPage(currentMemory.slug, null);
    }

    // Owner Actions: Pin / Delete
    if (e.target.classList.contains('btn-owner-pin')) {
      const cid = e.target.dataset.cid;
      MemoryStore.updateMemory(currentMemory.slug, (mem) => {
        const item = mem.contributions.find(c => c.id === cid);
        if (item) item.isPinned = !item.isPinned;
        return mem;
      });
      loadMemoryPage(currentMemory.slug, null);
    }

    if (e.target.classList.contains('btn-owner-delete')) {
      const cid = e.target.dataset.cid;
      if (confirm('Delete this contribution?')) {
        MemoryStore.updateMemory(currentMemory.slug, (mem) => {
          mem.contributions = mem.contributions.filter(c => c.id !== cid);
          return mem;
        });
        loadMemoryPage(currentMemory.slug, null);
      }
    }
  });
}

/* ==========================================================================
   9. HOST ADMIN MODERATION DRAWER
   ========================================================================== */
function initAdminDrawerHandlers() {
  const triggerBtn = document.getElementById('btn-toggle-admin-drawer');
  const drawer = document.getElementById('admin-drawer-overlay');
  const closeBtn = document.getElementById('close-admin-drawer');
  const saveBtn = document.getElementById('btn-save-drawer-settings');

  if (triggerBtn && drawer) {
    triggerBtn.addEventListener('click', () => {
      // Sync radio options & auto approve
      const modeRadio = document.querySelector(`input[name="drawer-privacy"][value="${currentMemory.contributionMode || 'open'}"]`);
      if (modeRadio) modeRadio.checked = true;

      const autoApproveToggle = document.getElementById('drawer-auto-approve');
      if (autoApproveToggle) autoApproveToggle.checked = currentMemory.autoApprove !== false;

      renderModerationQueue();
      drawer.classList.add('active');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('active'));
  }

  if (saveBtn && drawer) {
    saveBtn.addEventListener('click', () => {
      const selectedMode = document.querySelector('input[name="drawer-privacy"]:checked')?.value || 'open';
      const autoApprove = document.getElementById('drawer-auto-approve')?.checked;
      const expiresAt = document.getElementById('drawer-expires-at')?.value || null;

      MemoryStore.updateMemory(currentMemory.slug, (mem) => {
        mem.contributionMode = selectedMode;
        mem.autoApprove = autoApprove;
        mem.expiresAt = expiresAt;
        return mem;
      });

      loadMemoryPage(currentMemory.slug, null);
      drawer.classList.remove('active');
      alert('✓ Host settings updated successfully.');
    });
  }
}

function renderModerationQueue() {
  const container = document.getElementById('moderation-queue-container');
  const countEl = document.getElementById('pending-count-text');
  if (!container) return;
  container.innerHTML = '';

  const pending = (currentMemory.contributions || []).filter(c => c.status === 'pending');
  if (countEl) countEl.textContent = pending.length;

  if (pending.length === 0) {
    container.innerHTML = `<p style="font-size:0.9rem; color:var(--color-ink-muted);">No pending contributions in queue.</p>`;
    return;
  }

  pending.forEach(c => {
    const item = document.createElement('div');
    item.style.padding = '0.8rem';
    item.style.background = '#FAF4E8';
    item.style.borderRadius = '12px';
    item.style.border = '1px solid rgba(36,22,33,0.1)';

    item.innerHTML = `
      <strong style="font-size:0.9rem;">${c.authorName}:</strong>
      <p style="font-size:0.85rem; margin:0.3rem 0;">"${c.text}"</p>
      <div style="display:flex; gap:0.5rem;">
        <button type="button" class="btn-add-memory btn-approve-pending" style="padding:0.3rem 0.8rem; font-size:0.8rem;" data-cid="${c.id}">Approve</button>
        <button type="button" class="wall-filter-btn btn-reject-pending" style="padding:0.3rem 0.8rem; font-size:0.8rem; color:#B83227;" data-cid="${c.id}">Reject</button>
      </div>
    `;

    item.querySelector('.btn-approve-pending').onclick = () => {
      MemoryStore.updateMemory(currentMemory.slug, (mem) => {
        const target = mem.contributions.find(x => x.id === c.id);
        if (target) target.status = 'approved';
        return mem;
      });
      loadMemoryPage(currentMemory.slug, null);
      renderModerationQueue();
    };

    item.querySelector('.btn-reject-pending').onclick = () => {
      MemoryStore.updateMemory(currentMemory.slug, (mem) => {
        mem.contributions = mem.contributions.filter(x => x.id !== c.id);
        return mem;
      });
      loadMemoryPage(currentMemory.slug, null);
      renderModerationQueue();
    };

    container.appendChild(item);
  });
}

/* ==========================================================================
   10. LIGHTBOX HANDLERS
   ========================================================================== */
function initLightboxHandlers() {
  const modal = document.getElementById('lightbox-modal');
  const imgEl = document.getElementById('lightbox-img');
  const authorEl = document.getElementById('lightbox-author');
  const captionEl = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;

    const src = item.dataset.src;
    const author = item.dataset.author;
    const caption = item.dataset.caption;

    if (imgEl) imgEl.src = src;
    if (authorEl) authorEl.textContent = `Contributed by ${author}`;
    if (captionEl) captionEl.textContent = caption;

    if (modal) modal.classList.add('active');
  });

  if (closeBtn && modal) {
    closeBtn.onclick = () => modal.classList.remove('active');
  }
}

/* ==========================================================================
   11. AUDIO PLAYER & CANVAS CONFETTI
   ========================================================================== */
function initAudioPlayerListeners() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.audio-play-btn');
    if (!btn) return;

    const box = btn.closest('.audio-player-box');
    if (!box) return;

    const isPlaying = box.classList.contains('playing');
    document.querySelectorAll('.audio-player-box').forEach(b => b.classList.remove('playing'));

    if (!isPlaying) {
      box.classList.add('playing');
      btn.textContent = '❚❚';
    } else {
      box.classList.remove('playing');
      btn.textContent = '▶';
    }
  });
}

let canvas, ctx, particles = [];

function initConfettiCanvas() {
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

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 3,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 14,
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
    p.vy += 0.3;
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
