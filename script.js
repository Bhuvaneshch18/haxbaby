/**
 * 🍼 PIP'S DREAM OS — INTERACTIVE ENGINE
 * Baby's First Website Hackathon (haX.baby 2026)
 * Zero external audio files — Pure Web Audio API & Canvas Magic
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SYSTEM CLOCK & INITIALIZATION
     ========================================================================== */
  const clockElement = document.getElementById('system-clock');
  function updateClock() {
    if (!clockElement) return;
    const now = new Date();
    // Format in IST (UTC+5:30) or local browser time
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    clockElement.textContent = `${timeStr} IST`;
  }
  updateClock();
  setInterval(updateClock, 1000);


  /* ==========================================================================
     2. WEB AUDIO API SYNTHESIZER (LULLABY & CLICK SOUNDS)
     ========================================================================== */
  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Play a soft, warm chime (sine or triangle tone with smooth exponential decay)
  function playTone(freq = 660, duration = 0.25, type = 'sine', volume = 0.12) {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.03);
    } catch (e) {
      // Audio safety fallback
    }
  }

  // Soft tactile clay pop for button clicks
  function playClayClick() {
    if (isMuted) return;
    playTone(320 + Math.random() * 120, 0.08, 'triangle', 0.06);
  }

  // Mute Toggle Controller (Strict Hackathon Requirement)
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.getElementById('sound-label');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      soundToggleBtn.setAttribute('aria-pressed', String(!isMuted));
      if (soundIcon) soundIcon.textContent = isMuted ? '🔇' : '🔔';
      if (soundLabel) soundLabel.textContent = isMuted ? 'Muted' : 'Sound On';

      if (!isMuted) {
        playTone(784, 0.2, 'sine', 0.1);
      }
    });
  }

  // Attach subtle clay click sounds to all interactive buttons
  document.querySelectorAll('button, .tab-item, .clay-btn').forEach(el => {
    el.addEventListener('click', () => playClayClick());
  });


  /* ==========================================================================
     3. THE LULLABY LAB: MUSIC BOX PLAYER
     ========================================================================== */
  const playLullabyBtn = document.getElementById('btn-play-lullaby');
  const playText = document.getElementById('play-text');
  const playIcon = document.getElementById('play-icon');
  const musicboxImg = document.getElementById('musicbox-img');
  const musicMeter = document.getElementById('music-meter');
  let isLullabyPlaying = false;
  let lullabyTimeouts = [];

  // Soothing Pentatonic Lullaby Melody (C5 Pentatonic scale frequencies)
  const lullabyMelody = [
    { freq: 523.25, dur: 0.4 }, // C5
    { freq: 587.33, dur: 0.4 }, // D5
    { freq: 659.25, dur: 0.5 }, // E5
    { freq: 783.99, dur: 0.5 }, // G5
    { freq: 880.00, dur: 0.6 }, // A5
    { freq: 783.99, dur: 0.4 }, // G5
    { freq: 659.25, dur: 0.4 }, // E5
    { freq: 587.33, dur: 0.5 }, // D5
    { freq: 523.25, dur: 0.7 }  // C5
  ];

  function stopLullaby() {
    isLullabyPlaying = false;
    lullabyTimeouts.forEach(t => clearTimeout(t));
    lullabyTimeouts = [];
    if (playText) playText.textContent = 'Wind & Play Lullaby';
    if (playIcon) playIcon.textContent = '▶';
    if (musicboxImg) musicboxImg.style.transform = '';
    if (musicMeter) musicMeter.classList.remove('playing');
  }

  function startLullaby() {
    initAudio();
    isLullabyPlaying = true;
    if (playText) playText.textContent = 'Playing Lullaby... (Stop)';
    if (playIcon) playIcon.textContent = '■';
    if (musicboxImg) musicboxImg.style.transform = 'rotate(-5deg) scale(1.05)';
    if (musicMeter) musicMeter.classList.add('playing');

    let accumulatedTime = 0;
    lullabyMelody.forEach((note, index) => {
      const timeout = setTimeout(() => {
        if (!isLullabyPlaying) return;
        playTone(note.freq, note.dur, 'sine', 0.15);
        // Spawn floating musical star note
        spawnMusicNote();
        // Check if finished
        if (index === lullabyMelody.length - 1) {
          setTimeout(stopLullaby, 800);
        }
      }, accumulatedTime * 1000);
      lullabyTimeouts.push(timeout);
      accumulatedTime += note.dur + 0.12;
    });
  }

  function spawnMusicNote() {
    const spawner = document.getElementById('note-spawner');
    if (!spawner) return;
    const note = document.createElement('span');
    const symbols = ['♪', '♫', '✨', '⭐', '💤'];
    note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    note.style.position = 'absolute';
    note.style.left = `${30 + Math.random() * 40}%`;
    note.style.bottom = '20px';
    note.style.fontSize = '1.4rem';
    note.style.color = '#f5c842';
    note.style.pointerEvents = 'none';
    note.style.transition = 'all 1.2s ease-out';
    spawner.appendChild(note);

    requestAnimationFrame(() => {
      note.style.transform = `translate(${(Math.random() - 0.5) * 60}px, -90px) scale(1.4)`;
      note.style.opacity = '0';
    });
    setTimeout(() => note.remove(), 1300);
  }

  if (playLullabyBtn) {
    playLullabyBtn.addEventListener('click', () => {
      if (isLullabyPlaying) {
        stopLullaby();
      } else {
        startLullaby();
      }
    });
  }


  /* ==========================================================================
     4. PIP'S INTERACTIVE EYE TRACKING (AMBER PUPIL RIG)
     ========================================================================== */
  const pipEyes = document.getElementById('pip-eyes');
  const leftPupil = document.getElementById('left-pupil');
  const rightPupil = document.getElementById('right-pupil');

  if (pipEyes && leftPupil && rightPupil) {
    const maxRadius = 6.5; // maximum movement in pixels within socket

    window.addEventListener('mousemove', (e) => {
      const rect = pipEyes.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - eyeCenterX;
      const deltaY = e.clientY - eyeCenterY;
      const angle = Math.atan2(deltaY, deltaX);

      const distance = Math.min(maxRadius, Math.hypot(deltaX, deltaY) / 20);
      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      leftPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
      rightPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }, { passive: true });

    // Touchscreen / Mobile Tilt Support
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma === null) return;
      const moveX = Math.max(-maxRadius, Math.min(maxRadius, e.gamma / 4));
      const moveY = Math.max(-maxRadius, Math.min(maxRadius, (e.beta - 40) / 4));
      leftPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
      rightPupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  }


  /* ==========================================================================
     5. SPARKLE CURSOR TRAIL (CANVAS API)
     ========================================================================== */
  const canvas = document.getElementById('sparkle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastSparkle = 0;
    window.addEventListener('mousemove', (e) => {
      if (reducedMotion.matches) return;
      const now = performance.now();
      if (now - lastSparkle < 35) return; // Smooth throttling
      lastSparkle = now;

      // Spawn 2 sparkle particles
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 16,
          y: e.clientY + (Math.random() - 0.5) * 16,
          size: Math.random() * 3.5 + 2,
          life: 1,
          decay: Math.random() * 0.03 + 0.02,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          color: ['#f5c842', '#a34063', '#ffffff', '#f4d2d7'][Math.floor(Math.random() * 4)]
        });
      }
    }, { passive: true });

    function renderSparkles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.life > 0);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;

        // Draw 4-point star
        ctx.beginPath();
        const spikes = 4;
        const outer = p.size;
        const inner = p.size / 2.2;
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outer : inner;
          const a = (i * Math.PI) / spikes - Math.PI / 2;
          const sx = p.x + Math.cos(a) * r;
          const sy = p.y + Math.sin(a) * r;
          i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderSparkles);
    }
    renderSparkles();
  }


  /* ==========================================================================
     6. DAY / NIGHT DREAM MOOD TOGGLE
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const isNight = html.getAttribute('data-theme') === 'night';
      const newTheme = isNight ? 'day' : 'night';
      html.setAttribute('data-theme', newTheme);

      if (themeIcon) themeIcon.textContent = newTheme === 'night' ? '🌙' : '☀️';
      if (themeLabel) themeLabel.textContent = newTheme === 'night' ? 'Night Shift' : 'Day Dream';

      // Meta theme color update
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute('content', newTheme === 'night' ? '#0d0f1a' : '#fff8f1');

      // Chime cue
      playTone(newTheme === 'night' ? 440 : 660, 0.25, 'triangle', 0.1);
    });
  }


  /* ==========================================================================
     7. NIGHTLIGHT COLLECTION: COLOR GLOW SWITCHER
     ========================================================================== */
  const swatches = document.querySelectorAll('.swatch-btn');
  const lanternGlow = document.getElementById('lantern-glow-effect');

  const glowColors = {
    gold: 'radial-gradient(circle, #f5c842 0%, transparent 70%)',
    berry: 'radial-gradient(circle, #a34063 0%, transparent 70%)',
    moon: 'radial-gradient(circle, #7c83fd 0%, transparent 70%)',
    mint: 'radial-gradient(circle, #6bdfa0 0%, transparent 70%)'
  };

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const colorKey = swatch.dataset.color;
      if (lanternGlow && glowColors[colorKey]) {
        lanternGlow.style.background = glowColors[colorKey];
      }
      playTone(520 + Math.random() * 200, 0.15, 'sine', 0.1);
    });
  });


  /* ==========================================================================
     8. DREAM DELIVERY ROUTES: MINI FLIGHT MAP
     ========================================================================== */
  const mapNodes = document.querySelectorAll('.map-node');
  const flyingPip = document.getElementById('flying-pip');
  const mapStatusText = document.getElementById('map-status-text');

  const coordinates = {
    'Bunny Burrows': { left: '15%', top: '25%' },
    'Cloud 9 Nursery': { left: '50%', top: '15%' },
    'Little Spook Tower': { left: '80%', top: '35%' }
  };

  mapNodes.forEach(node => {
    node.addEventListener('click', () => {
      mapNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const stopName = node.dataset.stop;
      if (mapStatusText) {
        mapStatusText.innerHTML = `CURRENT DISPATCH: <strong>${stopName} (Delivered!)</strong>`;
      }

      if (flyingPip && coordinates[stopName]) {
        flyingPip.style.left = coordinates[stopName].left;
        flyingPip.style.top = coordinates[stopName].top;
      }

      playTone(680, 0.2, 'sine', 0.12);
    });
  });


  /* ==========================================================================
     9. VISITOR COUNTER ODOMETER (LOCAL STORAGE)
     ========================================================================== */
  const odoLive = document.getElementById('odo-live');
  if (odoLive) {
    try {
      let visitCount = parseInt(localStorage.getItem('pip-dream-counter') || '1204', 10);
      visitCount += 1;
      localStorage.setItem('pip-dream-counter', visitCount.toString());
      const str = visitCount.toString().padStart(6, '0');
      const digits = document.querySelectorAll('.odometer-ticker .digit');
      if (digits.length === 6) {
        digits.forEach((d, idx) => {
          d.textContent = str[idx];
        });
      }
    } catch (e) {
      // Storage unavailable
    }
  }


  /* ==========================================================================
     10. GUESTBOOK WALL SIDE QUEST (+2 PTS)
     ========================================================================== */
  const guestbookForm = document.getElementById('guestbook-form');
  const wishesWall = document.getElementById('wishes-wall');
  const initialWishes = [
    { author: 'Luna the Moth', message: 'May your nightcap never lose its stars! 🌙' },
    { author: 'Barnaby Ghost', message: 'The lullaby lab is my favourite bedtime place.' },
    { author: 'Sleepy Cloud', message: 'Delivered sweet dreams to all the little foxes!' }
  ];

  function loadWishes() {
    if (!wishesWall) return;
    wishesWall.innerHTML = '';
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem('pip-guestbook-wishes') || '[]');
    } catch (e) {
      saved = [];
    }
    const allWishes = [...saved, ...initialWishes];
    allWishes.slice(0, 6).forEach(item => {
      const card = document.createElement('div');
      card.className = 'wish-item';
      card.innerHTML = `<div class="wish-author">${escapeHTML(item.author)}</div><div class="wish-message">“${escapeHTML(item.message)}”</div>`;
      wishesWall.appendChild(card);
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
  }

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = document.getElementById('wish-author');
      const messageInput = document.getElementById('wish-message');
      const author = authorInput ? authorInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (author && message) {
        try {
          const saved = JSON.parse(localStorage.getItem('pip-guestbook-wishes') || '[]');
          saved.unshift({ author, message });
          localStorage.setItem('pip-guestbook-wishes', JSON.stringify(saved));
        } catch (e) {}

        if (authorInput) authorInput.value = '';
        if (messageInput) messageInput.value = '';
        loadWishes();
        playTone(880, 0.3, 'sine', 0.15);
        showToast('Wish Pinned!', 'Your sweet dream wish is now on Pip\'s nursery wall ✦');
      }
    });
  }
  loadWishes();


  /* ==========================================================================
     11. DELIGHTFUL EASTER EGG (CONFETTI BURST & GIGGLES)
     ========================================================================== */
  const secretToast = document.getElementById('secret-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');

  function showToast(title, desc) {
    if (!secretToast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;
    secretToast.classList.add('visible');
    setTimeout(() => {
      secretToast.classList.remove('visible');
    }, 4500);
  }

  function triggerEasterEgg() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#a34063', '#f5c842', '#fff8f1', '#f4d2d7', '#5c4033']
      });
    }
    playTone(1046.5, 0.4, 'sine', 0.18);
    showToast('Secret Dream Unlocked! ✦', 'Pip giggles and tucks you into a warm cloud of stars.');
  }

  const easterBtn = document.getElementById('btn-easter-egg');
  if (easterBtn) {
    easterBtn.addEventListener('click', triggerEasterEgg);
  }

  // Mobile/Desktop Avatar Poke
  let pokeCount = 0;
  const pokeBtn = document.getElementById('btn-poke-pip');
  const pipHeroImg = document.getElementById('pip-hero-img');

  function handlePoke() {
    pokeCount++;
    playTone(720 + Math.random() * 200, 0.15, 'triangle', 0.12);
    if (pipHeroImg) {
      pipHeroImg.style.transform = 'scale(1.15) rotate(6deg)';
      setTimeout(() => {
        pipHeroImg.style.transform = '';
      }, 300);
    }
    if (pokeCount >= 4) {
      pokeCount = 0;
      triggerEasterEgg();
    }
  }

  if (pokeBtn) pokeBtn.addEventListener('click', handlePoke);
  if (pipHeroImg) pipHeroImg.addEventListener('click', handlePoke);

  // Keyboard shortcut "dream"
  let keySequence = '';
  window.addEventListener('keydown', (e) => {
    keySequence += e.key.toLowerCase();
    if (keySequence.length > 8) keySequence = keySequence.slice(-8);
    if (keySequence.includes('dream')) {
      keySequence = '';
      triggerEasterEgg();
    }
  });


  /* ==========================================================================
     12. WINDOW CONTROL ACTIONS
     ========================================================================== */
  const btnClose = document.getElementById('btn-win-close');
  const btnMin = document.getElementById('btn-win-min');
  const mainWindow = document.getElementById('main-window');

  if (btnClose && mainWindow) {
    btnClose.addEventListener('click', () => {
      mainWindow.style.opacity = '0.3';
      mainWindow.style.transform = 'scale(0.96)';
      showToast('Pip OS Sleeping...', 'Click any taskbar tab below to wake the nursery window!');
      setTimeout(() => {
        mainWindow.style.opacity = '1';
        mainWindow.style.transform = '';
      }, 2000);
    });
  }

  if (btnMin && mainWindow) {
    btnMin.addEventListener('click', () => {
      mainWindow.style.transform = 'translateY(15px) scale(0.98)';
      setTimeout(() => { mainWindow.style.transform = ''; }, 350);
    });
  }

});
