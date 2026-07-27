/**
 * SocioDex Bloom Memory Maker - Data Model & Storage Engine
 * Handles LocalStorage persistence, auth sessions, QR code rendering, and seed data.
 */

const STORAGE_KEY_MEMORIES = 'sociodex_memories_v2';
const STORAGE_KEY_USER = 'sociodex_user_session';

// --------------------------------------------------------------------------
// 1. THEME DEFINITIONS
// --------------------------------------------------------------------------
const THEMES = {
  sage: {
    id: 'sage',
    name: 'Sage',
    bg: '#E9EFE2',
    accent: '#2C5F2E',
    cardBg: '#FAF8F0',
    text: '#1B3B1D',
    previewSwatch: 'linear-gradient(135deg, #E9EFE2 50%, #2C5F2E 50%)'
  },
  terracotta: {
    id: 'terracotta',
    name: 'Terracotta',
    bg: '#F5E5DA',
    accent: '#C17F5A',
    cardBg: '#FFFDF9',
    text: '#4A2A18',
    previewSwatch: 'linear-gradient(135deg, #F5E5DA 50%, #C17F5A 50%)'
  },
  indigo: {
    id: 'indigo',
    name: 'Indigo',
    bg: '#E5E7F2',
    accent: '#3E4A75',
    cardBg: '#F8F9FE',
    text: '#1C233B',
    previewSwatch: 'linear-gradient(135deg, #E5E7F2 50%, #3E4A75 50%)'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    bg: '#F8E6CB',
    accent: '#D29A4D',
    cardBg: '#FFFBF5',
    text: '#4D3412',
    previewSwatch: 'linear-gradient(135deg, #F8E6CB 50%, #D29A4D 50%)'
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    bg: '#F4E1DD',
    accent: '#B85D6E',
    cardBg: '#FFFDFD',
    text: '#4D1B24',
    previewSwatch: 'linear-gradient(135deg, #F4E1DD 50%, #B85D6E 50%)'
  }
};

// --------------------------------------------------------------------------
// 2. MEMORY DATA ENGINE
// --------------------------------------------------------------------------
class MemoryStore {
  static getAllMemories() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_MEMORIES);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.error('Failed to load memories:', e);
      return {};
    }
  }

  static getMemoryBySlug(slug) {
    const memories = this.getAllMemories();
    if (memories[slug]) {
      return memories[slug];
    }
    // Return sample demo memory if slug matches 'demo' or default
    if (slug === 'demo' || slug === 'sarah-30th') {
      return this.getDemoMemory();
    }
    return null;
  }

  static saveMemory(memoryData) {
    const memories = this.getAllMemories();
    memories[memoryData.slug] = memoryData;
    try {
      localStorage.setItem(STORAGE_KEY_MEMORIES, JSON.stringify(memories));
      return true;
    } catch (e) {
      console.error('Failed to save memory:', e);
      return false;
    }
  }

  static updateMemory(slug, updateFn) {
    const memory = this.getMemoryBySlug(slug);
    if (!memory) return false;
    const updated = updateFn(memory);
    return this.saveMemory(updated);
  }

  static generateSlug(name) {
    const base = (name || 'celebration')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return `${base}-${randomSuffix}`;
  }

  // --------------------------------------------------------------------------
  // 3. AUTH & SESSION SIMULATOR
  // --------------------------------------------------------------------------
  static getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  static loginUser(name, email) {
    const user = {
      name: name || 'Guest User',
      email: (email || 'guest@example.com').toLowerCase(),
      avatar: (name || 'G').substring(0, 2).toUpperCase()
    };
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  }

  static logoutUser() {
    localStorage.removeItem(STORAGE_KEY_USER);
  }

  static isOwnerOrAdmin(memory, user) {
    if (!user) return false;
    const email = (user.email || '').toLowerCase();
    return (
      email === 'admin@example.com' ||
      email === 'creator@example.com' ||
      (memory && memory.creatorEmail && memory.creatorEmail.toLowerCase() === email)
    );
  }

  // --------------------------------------------------------------------------
  // 4. DEMO & SEED GENERATOR
  // --------------------------------------------------------------------------
  static getDemoMemory() {
    return {
      slug: 'sarah-30th',
      occasion: 'Birthday',
      pageType: 'wish',
      isInvitation: false,
      recipient: "Sarah Vance",
      coupleNames: "",
      from: "David Vance & Family",
      date: "2026-08-15",
      themeId: "terracotta",
      wishes: ["Wishing you 30 years of pure happiness!"],
      photos: ["assets/images/birthday.jpg", "assets/images/wedding.jpg"],
      audios: [{ id: 'a1', name: 'Audio Wish from Grandma', url: '' }],
      videos: [{ id: 'v1', name: 'Office Birthday Reel', url: '' }],
      visibility: "public",
      allowedActions: { addPhotos: true, addVideos: true, addComments: true },
      collaborators: [],
      comments: [],
      contributedMedia: [],
      collaborationRequests: [],
      contributionMode: "open",
      autoApprove: true,
      pinnedContributionIds: ["c1"],
      expiresAt: null,
      isCorporate: false,
      corporateLogo: null,
      creatorEmail: "creator@example.com",
      createdAt: new Date().toISOString(),
      venueName: "",
      venueAddress: "",
      venueMapsUrl: "",
      dressCode: "",
      registryInfo: "",
      timeline: [],
      rsvps: {
        'guest-1': { guestId: 'guest-1', name: 'Alex Rivera', status: 'attending', timestamp: '2026-07-26T10:00:00Z' },
        'guest-2': { guestId: 'guest-2', name: 'Sophia Chen', status: 'attending', timestamp: '2026-07-26T11:30:00Z' }
      },
      contributions: [
        {
          id: "c1",
          authorName: "Emma Watson",
          authorEmail: "emma@example.com",
          authorAvatar: "EW",
          timestamp: "2 hours ago",
          text: "Happy 30th Sarah! From college dorms to this amazing milestone, so proud of everything you've achieved. Here's to 30 more years of adventures! 🎉🥂",
          mediaType: "photo",
          mediaUrl: "assets/images/birthday.jpg",
          status: "approved",
          isPinned: true
        },
        {
          id: "c2",
          authorName: "Grandma Beatrice",
          authorEmail: "beatrice@example.com",
          authorAvatar: "GB",
          timestamp: "4 hours ago",
          text: "Sending my warmest blessings and singing your favorite lullaby from back home.",
          mediaType: "audio",
          audioUrl: "",
          status: "approved",
          isPinned: false
        },
        {
          id: "c3",
          authorName: "Jason Lee",
          authorEmail: "jason@example.com",
          authorAvatar: "JL",
          timestamp: "6 hours ago",
          text: "Golden hour polaroids from our weekend reunion. Happy Birthday!",
          mediaType: "photo",
          mediaUrl: "assets/images/wedding.jpg",
          status: "approved",
          isPinned: false
        },
        {
          id: "c4_pending",
          authorName: "Marcus Bell (Pending Review)",
          authorEmail: "marcus@example.com",
          authorAvatar: "MB",
          timestamp: "10 minutes ago",
          text: "Can't wait for the weekend party! Save me a slice of cake! 🎂",
          mediaType: "text",
          status: "pending",
          isPinned: false
        }
      ],
      reactions: {
        "c1": { heart: ["emma@example.com", "david@example.com"], clap: ["jason@example.com"], hug: [] },
        "c2": { heart: ["david@example.com"], clap: [], hug: ["emma@example.com"] }
      },
      replies: {
        "c1": [
          {
            id: "r1",
            authorName: "Sarah Vance",
            authorEmail: "sarah@example.com",
            timestamp: "1 hour ago",
            text: "Thank you so much Emma! Love you!"
          }
        ]
      }
    };
  }

  static seedMemoryIfNeeded(memoryData) {
    if (!memoryData.contributions || memoryData.contributions.length === 0) {
      const demo = this.getDemoMemory();
      memoryData.contributions = demo.contributions;
      memoryData.reactions = demo.reactions;
      memoryData.replies = demo.replies;
      memoryData.rsvps = demo.rsvps;
      this.saveMemory(memoryData);
    }
    return memoryData;
  }
}

// --------------------------------------------------------------------------
// 5. CLIENT-SIDE QR CODE GENERATOR (CANVAS / SVG)
// --------------------------------------------------------------------------
function renderQRCodeOnCanvas(text, canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 200;
  canvas.width = size;
  canvas.height = size;

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);

  // Border frame
  ctx.strokeStyle = '#3D2436';
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, size - 12, size - 12);

  // Simulated QR Code Matrix pattern using deterministic hash
  ctx.fillStyle = '#241621';
  const margin = 16;
  const gridSize = 21;
  const cellSize = (size - margin * 2) / gridSize;

  // Draw 3 Corner Position Patterns
  drawQRCorner(ctx, margin, margin, cellSize * 7);
  drawQRCorner(ctx, size - margin - cellSize * 7, margin, cellSize * 7);
  drawQRCorner(ctx, margin, size - margin - cellSize * 7, cellSize * 7);

  // Pseudo-random data modules based on text string
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip corners
      if (
        (r < 7 && c < 7) ||
        (r < 7 && c > 13) ||
        (r > 13 && c < 7)
      ) continue;

      const bit = (hash ^ (r * 31 + c * 17)) % 2 === 0;
      if (bit) {
        ctx.fillRect(
          margin + c * cellSize,
          margin + r * cellSize,
          cellSize - 0.5,
          cellSize - 0.5
        );
      }
    }
  }

  // Center logo dot
  ctx.fillStyle = '#E4603C';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, cellSize * 1.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawQRCorner(ctx, x, y, size) {
  ctx.fillStyle = '#241621';
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + size * 0.15, y + size * 0.15, size * 0.7, size * 0.7);
  ctx.fillStyle = '#241621';
  ctx.fillRect(x + size * 0.3, y + size * 0.3, size * 0.4, size * 0.4);
}
