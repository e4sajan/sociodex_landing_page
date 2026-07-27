/**
 * SocioDex Bloom Memory Maker - Creator Page Controller
 * Controls forms, theme swatches, corporate logo uploader, dynamic schedule timeline,
 * simulated voice notes, QR code renderer, and phone preview.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypeSelector();
  initThemeSwatches();
  initCorporateToggle();
  initTimelineEditor();
  initMediaUploaders();
  initFormSubmission();
  initPrivacyModeSync();
});

// State
let selectedType = 'wish';
let selectedTheme = 'terracotta';
let uploadedLogoDataUrl = null;
let uploadedPhotosDataUrls = [];
let simulatedVoiceNoteAdded = false;

/* ==========================================================================
   1. PAGE TYPE SELECTOR
   ========================================================================== */
function initTypeSelector() {
  const pills = document.querySelectorAll('.type-pill-btn');
  const recipientWrap = document.getElementById('field-recipient-wrap');
  const coupleWrap = document.getElementById('field-couple-wrap');
  const firstWishWrap = document.getElementById('field-first-wish-wrap');
  const inviteSection = document.getElementById('section-invite-details');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      selectedType = pill.dataset.type;

      if (selectedType === 'wish') {
        if (recipientWrap) recipientWrap.style.display = 'block';
        if (firstWishWrap) firstWishWrap.style.display = 'block';
        if (coupleWrap) coupleWrap.style.display = 'none';
        if (inviteSection) inviteSection.style.display = 'none';
      } else {
        if (recipientWrap) recipientWrap.style.display = 'none';
        if (firstWishWrap) firstWishWrap.style.display = 'none';
        if (coupleWrap) coupleWrap.style.display = 'block';
        if (inviteSection) inviteSection.style.display = 'block';
      }
    });
  });
}

/* ==========================================================================
   2. THEME SWATCHES SELECTOR
   ========================================================================== */
function initThemeSwatches() {
  const swatches = document.querySelectorAll('.theme-swatch-card');

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      selectedTheme = swatch.dataset.theme;
    });
  });
}

/* ==========================================================================
   3. CORPORATE BRANDING MODE
   ========================================================================== */
function initCorporateToggle() {
  const toggle = document.getElementById('toggle-corporate');
  const uploadWrap = document.getElementById('corporate-logo-upload-wrap');
  const logoInput = document.getElementById('input-corporate-logo');
  const previewBox = document.getElementById('logo-preview-box');
  const previewImg = document.getElementById('logo-preview-img');
  const removeBtn = document.getElementById('btn-remove-logo');

  if (toggle) {
    toggle.addEventListener('change', () => {
      if (uploadWrap) uploadWrap.style.display = toggle.checked ? 'block' : 'none';
    });
  }

  if (logoInput) {
    logoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          uploadedLogoDataUrl = evt.target.result;
          if (previewImg) previewImg.src = uploadedLogoDataUrl;
          if (previewBox) previewBox.style.display = 'flex';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      uploadedLogoDataUrl = null;
      if (logoInput) logoInput.value = '';
      if (previewBox) previewBox.style.display = 'none';
    });
  }
}

/* ==========================================================================
   4. DYNAMIC TIMELINE SCHEDULE EDITOR
   ========================================================================== */
function initTimelineEditor() {
  const container = document.getElementById('timeline-editor-container');
  const addBtn = document.getElementById('btn-add-timeline-row');

  if (addBtn && container) {
    addBtn.addEventListener('click', () => {
      const row = document.createElement('div');
      row.className = 'timeline-row-item';
      row.innerHTML = `
        <input type="text" class="form-input timeline-time" placeholder="Time (e.g. 6:30 PM)" style="width:140px;">
        <input type="text" class="form-input timeline-event" placeholder="Event (e.g. Dinner & Speeches)">
        <button type="button" class="btn-remove-row">✕</button>
      `;
      container.appendChild(row);
    });
  }

  if (container) {
    container.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remove-row')) {
        const row = e.target.closest('.timeline-row-item');
        if (row) row.remove();
      }
    });
  }
}

/* ==========================================================================
   5. MEDIA UPLOADERS & SIMULATED VOICE NOTES
   ========================================================================== */
function initMediaUploaders() {
  const dropzone = document.getElementById('dropzone-photos');
  const inputPhotos = document.getElementById('input-photos');
  const previewsGrid = document.getElementById('photo-previews-grid');

  if (dropzone && inputPhotos) {
    dropzone.addEventListener('click', () => inputPhotos.click());

    inputPhotos.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const dataUrl = evt.target.result;
          uploadedPhotosDataUrls.push(dataUrl);
          renderPhotoPreviews();
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Voice note recording simulator
  const recordBtn = document.getElementById('btn-record-voicenote');
  const statusTag = document.getElementById('voicenote-status-tag');

  if (recordBtn) {
    recordBtn.addEventListener('click', () => {
      recordBtn.disabled = true;
      recordBtn.textContent = '🔴 Recording Simulated Voice Note... (0:03)';

      setTimeout(() => {
        recordBtn.textContent = '🎙️ Simulate Voice Note Recording';
        recordBtn.disabled = false;
        simulatedVoiceNoteAdded = true;
        if (statusTag) statusTag.style.display = 'block';
      }, 2000);
    });
  }
}

function renderPhotoPreviews() {
  const grid = document.getElementById('photo-previews-grid');
  if (!grid) return;
  grid.innerHTML = '';

  uploadedPhotosDataUrls.forEach((url, idx) => {
    const card = document.createElement('div');
    card.className = 'media-preview-card';
    card.innerHTML = `
      <img src="${url}" alt="Preview ${idx}">
      <button type="button" class="btn-delete-preview" data-index="${idx}">✕</button>
    `;

    card.querySelector('img').addEventListener('click', () => {
      openLightbox(url);
    });

    card.querySelector('.btn-delete-preview').addEventListener('click', (e) => {
      e.stopPropagation();
      uploadedPhotosDataUrls.splice(idx, 1);
      renderPhotoPreviews();
    });

    grid.appendChild(card);
  });
}

function openLightbox(url) {
  const modal = document.getElementById('creator-lightbox');
  const img = document.getElementById('creator-lightbox-img');
  if (modal && img) {
    img.src = url;
    modal.style.display = 'flex';
    modal.onclick = () => modal.style.display = 'none';
  }
}

/* ==========================================================================
   6. FORM SUBMISSION & SUCCESS SCREEN
   ========================================================================== */
function initFormSubmission() {
  const form = document.getElementById('memory-creator-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const occasion = document.getElementById('input-occasion').value;
      const date = document.getElementById('input-date').value;
      const host = document.getElementById('input-host').value;

      const recipient = document.getElementById('input-recipient').value;
      const coupleNames = document.getElementById('input-couple').value;

      const firstWish = document.getElementById('input-first-wish').value;

      const isCorporate = document.getElementById('toggle-corporate').checked;

      // Validation Checks
      if (selectedType === 'wish' && !recipient.trim()) {
        alert('Please enter the Recipient Name for this Wish Book.');
        return;
      }

      if (selectedType === 'invite' && !coupleNames.trim()) {
        alert('Please enter the Couple / Celebrants Name for this Invitation Card.');
        return;
      }

      if (isCorporate && !uploadedLogoDataUrl) {
        alert('Corporate Branding is enabled. Please upload a company logo.');
        return;
      }

      // Collect Timeline schedule rows
      const timelineRows = [];
      document.querySelectorAll('.timeline-row-item').forEach(row => {
        const time = row.querySelector('.timeline-time').value;
        const event = row.querySelector('.timeline-event').value;
        if (time || event) {
          timelineRows.push({ time: time || 'Event', event: event || '' });
        }
      });

      // Generate Unique Slug
      const nameForSlug = selectedType === 'wish' ? recipient : coupleNames;
      const slug = MemoryStore.generateSlug(nameForSlug);

      // Build Memory Data Model
      const newMemory = {
        slug: slug,
        occasion: occasion,
        pageType: selectedType,
        isInvitation: selectedType === 'invite',
        recipient: recipient,
        coupleNames: coupleNames,
        from: host,
        date: date,
        themeId: selectedTheme,
        wishes: firstWish ? [firstWish] : [],
        photos: [...uploadedPhotosDataUrls],
        audios: simulatedVoiceNoteAdded ? [{ id: 'sim-audio-1', name: 'Host Voice Greeting (0:35)', url: '' }] : [],
        videos: [],
        visibility: "public",
        allowedActions: { addPhotos: true, addVideos: true, addComments: true },
        collaborators: [],
        comments: [],
        contributedMedia: [],
        collaborationRequests: [],
        contributionMode: "open",
        autoApprove: true,
        pinnedContributionIds: [],
        expiresAt: null,
        isCorporate: isCorporate,
        corporateLogo: uploadedLogoDataUrl,
        creatorEmail: "creator@example.com",
        createdAt: new Date().toISOString(),
        venueName: document.getElementById('input-venue-name')?.value || '',
        venueAddress: document.getElementById('input-venue-addr')?.value || '',
        venueMapsUrl: document.getElementById('input-maps-url')?.value || '',
        dressCode: document.getElementById('input-dress-code')?.value || '',
        registryInfo: document.getElementById('input-registry')?.value || '',
        timeline: timelineRows,
        rsvps: {},
        contributions: [],
        reactions: {},
        replies: {}
      };

      // Seed initial sample contributions if first wish exists
      if (firstWish) {
        newMemory.contributions.push({
          id: 'host-opening-wish',
          authorName: host,
          authorEmail: 'creator@example.com',
          authorAvatar: host.substring(0, 2).toUpperCase(),
          timestamp: 'Just now',
          text: firstWish,
          mediaType: 'text',
          status: 'approved',
          isPinned: true
        });
      }

      // Save to persistent LocalStorage
      MemoryStore.saveMemory(newMemory);

      // Show Success Screen
      displaySuccessScreen(newMemory);
    });
  }
}

function displaySuccessScreen(memory) {
  const formCard = document.getElementById('creator-form-card');
  const successCard = document.getElementById('success-screen-card');

  if (formCard) formCard.style.display = 'none';
  if (successCard) successCard.classList.add('active');

  // Public URL
  const baseUrl = window.location.href.split('creator.html')[0];
  const publicUrl = `${baseUrl}memory.html?slug=${memory.slug}`;

  const urlInput = document.getElementById('success-public-url');
  const openBtn = document.getElementById('btn-open-public-page');
  const copyBtn = document.getElementById('btn-copy-url');

  if (urlInput) urlInput.value = publicUrl;
  if (openBtn) openBtn.href = publicUrl;

  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(publicUrl);
      copyBtn.textContent = '✓ Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy Link', 2000);
    };
  }

  // Render QR Code
  const qrCanvas = document.getElementById('qr-code-canvas');
  if (qrCanvas) {
    renderQRCodeOnCanvas(publicUrl, qrCanvas);
  }

  // Download QR Code image button
  const downloadQrBtn = document.getElementById('btn-download-qr');
  if (downloadQrBtn && qrCanvas) {
    downloadQrBtn.onclick = () => {
      const link = document.createElement('a');
      link.download = `QR-${memory.slug}.png`;
      link.href = qrCanvas.toDataURL();
      link.click();
    };
  }

  // Load Phone iframe preview
  const iframe = document.getElementById('phone-preview-iframe');
  if (iframe) {
    iframe.src = publicUrl;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==========================================================================
   7. PRIVACY MODE SYNCHRONIZATION
   ========================================================================== */
function initPrivacyModeSync() {
  const privacyRadios = document.querySelectorAll('input[name="privacy-mode"]');
  privacyRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selectedMode = radio.value;
      const urlInput = document.getElementById('success-public-url');
      if (urlInput && urlInput.value) {
        const urlParams = new URLSearchParams(urlInput.value.split('?')[1]);
        const slug = urlParams.get('slug');
        if (slug) {
          MemoryStore.updateMemory(slug, (mem) => {
            mem.contributionMode = selectedMode;
            return mem;
          });
        }
      }
    });
  });
}
