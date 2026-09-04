/* ============================================================
   CUSTOMIZE EVERYTHING HERE — no other file needs to change.
   ============================================================ */
const CONFIG = {
  // 4-digit passkey required to unlock the site
  passkey: "2026",

  // Text shown on the "forgot passkey" hint modal (defaults to the passkey itself)
  passkeyHint: "PASSKEY = 2026",

  // Her name / title used on the cut-the-cake screen
  personTitle: "Happy Birthday<br> Billu &#127872;",

  // Captions cycled on the loading screen's speech bubble
  loadingQuotes: [
    "Hmm…",
    "Almost there…",
    "Just a moment…",
    "Thinking of you…",
    "So worth the wait…"
  ],

  // Optional voice note played on the letter screen (the video now lives on
  // its own "watch a video" screen instead — see videoMessage below).
  // type: "video" or "audio", src: path to the file. Leave src "" to hide it.
  letterMedia: {
    type: "video",
    src: ""
  },

  // Video shown on its own dedicated screen, between the memories carousel
  // and the letter. Tap the play button to watch it; when it ends, a
  // heartfelt message pops up before continuing to the letter.
  videoMessage: {
    src: "assets/video-message.mp4",
    message: "That's a little piece of my heart, just for you ❤️\n\nNow... get ready for something even more special."
  },

  // Circular profile photo shown on the locked + keypad screens.
  // Drop a file at assets/profile.jpg (any image works, it's just referenced by this path).
  profilePhoto: "assets/profile.jpeg",

  // Memory carousel photos — add as many as you like.
  // Drop files into assets/photos/ and list their paths here.
  photos: [
    "assets/photos/1.jpeg",
    "assets/photos/2.jpeg",
    "assets/photos/3.jpeg",
    "assets/photos/4.jpeg",
    "assets/photos/5.jpeg",
    "assets/photos/6.jpeg",
    "assets/photos/7.jpeg",
    "assets/photos/8.jpeg",
    "assets/photos/9.jpeg",
    "assets/photos/11.jpeg",
    "assets/photos/13.jpeg",
    "assets/photos/14.jpeg",
    "assets/photos/15.jpeg",
    "assets/photos/16.jpeg"
  ],

  // Background music. Drop an mp3 at assets/music.mp3 (or point this at any file).
  // Browsers block audio with sound until the visitor interacts with the page,
  // so it starts on the visitor's very first tap/click (feels automatic) and
  // can also be toggled manually from the button in the top-left corner. It
  // ducks quietly while the video message plays, then fades back in after.
  music: {
    src: "assets/music.mp3",
    volume: 0.30
  },

  // The letter — typed out on screen with a typewriter effect
  letterBody:
`Happy Birthday, Love ❤️

You are the most beautiful part of my life, and I'm so lucky to have you. Your smile makes my days better, and your presence makes everything feel special. I hope your birthday is filled with happiness, love, and endless smiles.

Always stay happy — because your happiness means a lot to me. ❤️`,

  // Small watermark bottom-right of the locked screen. Leave empty to hide.
  footerCredit: ""
};
/* ============================================================ */


document.addEventListener("DOMContentLoaded", () => {

  /* ---------------- starfield ---------------- */
  const starsEl = document.getElementById("stars");
  const STAR_COUNT = 26;
  for (let i = 0; i < STAR_COUNT; i++) {
    const s = document.createElement("div");
    s.className = "star";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDelay = (Math.random() * 3).toFixed(2) + "s";
    s.style.animationDuration = (2 + Math.random() * 2.5).toFixed(2) + "s";
    starsEl.appendChild(s);
  }

  /* ---------------- static content from CONFIG ---------------- */
  document.getElementById("modal-hint-text").textContent = CONFIG.passkeyHint;
  document.getElementById("age-title").innerHTML = CONFIG.personTitle;
  document.getElementById("brand-credit").textContent = CONFIG.footerCredit || "";
  [...document.querySelectorAll(".avatar-img")].forEach(img => img.src = CONFIG.profilePhoto);
  document.getElementById("modal-photo-img").src = CONFIG.profilePhoto;

  /* ---------------- optional letter media (voice note / video) ---------------- */
  const letterMediaEl = document.getElementById("letter-media");
  const media = CONFIG.letterMedia;
  if (media && media.src) {
    const tag = media.type === "audio" ? "audio" : "video";
    const el = document.createElement(tag);
    el.controls = true;
    el.playsInline = true;
    el.src = media.src;
    el.onerror = () => { letterMediaEl.style.display = "none"; };
    letterMediaEl.appendChild(el);
  } else {
    letterMediaEl.style.display = "none";
  }

  /* ---------------- click sound (synthesized, no audio file needed) ---------------- */
  let clickAudioCtx = null;
  function getClickAudioCtx() {
    if (!clickAudioCtx) clickAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (clickAudioCtx.state === "suspended") clickAudioCtx.resume();
    return clickAudioCtx;
  }
  function playClickSound() {
    const ctx = getClickAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(720, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.13);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  }
  document.addEventListener("click", e => {
    if (e.target.closest("button")) playClickSound();
  });

  /* ---------------- background music toggle ---------------- */
  const musicToggle = document.getElementById("music-toggle");
  const musicIcon = document.getElementById("music-icon");
  const bgMusic = new Audio(CONFIG.music.src);
  bgMusic.loop = true;
  bgMusic.volume = CONFIG.music.volume;
  let musicPlaying = false;
  let musicUserPaused = false; // user explicitly hit the mute/pause toggle

  function fadeAudioVolume(audioEl, toVolume, duration = 500) {
    const fromVolume = audioEl.volume;
    const startTime = performance.now();
    function step(now) {
      const t = Math.min(1, (now - startTime) / duration);
      audioEl.volume = fromVolume + (toVolume - fromVolume) * t;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function startMusic() {
    if (musicPlaying) return;
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicIcon.textContent = "\u{1F50A}";
      musicToggle.classList.add("playing");
    }).catch(() => {
      musicIcon.textContent = "\u{1F507}";
      musicToggle.classList.add("unavailable");
      musicToggle.title = "Add a music file at assets/music.mp3 to enable background music";
    });
  }

  function stopMusic() {
    bgMusic.pause();
    musicPlaying = false;
    musicIcon.textContent = "\u{1F507}";
    musicToggle.classList.remove("playing");
  }

  musicToggle.addEventListener("click", () => {
    if (musicPlaying) {
      musicUserPaused = true;
      stopMusic();
    } else {
      musicUserPaused = false;
      startMusic();
    }
  });

  // Browsers block audio-with-sound until the visitor interacts with the
  // page at all, so true page-load autoplay isn't possible — instead, start
  // the music on the very first tap/click anywhere, so it feels automatic.
  document.addEventListener("click", () => {
    if (!musicPlaying && !musicUserPaused) startMusic();
  }, { once: true });

  /* ---------------- screen manager ---------------- */
  const ORDER = [
    "screen-locked", "screen-keypad", "screen-loading",
    "screen-day", "screen-age", "screen-memories",
    "screen-video", "screen-envelope", "screen-letter"
  ];
  const screens = {};
  ORDER.forEach(id => screens[id] = document.getElementById(id));

  function show(id) {
    ORDER.forEach(k => {
      const isActive = k === id;
      screens[k].classList.toggle("hidden", !isActive);
      screens[k].toggleAttribute("inert", !isActive);
    });
  }

  /* ================= SCREEN 1 → 2 : unlock ================= */
  const avatarLocked = document.getElementById("avatar-locked");
  const avatarKeypad = document.getElementById("avatar-keypad");
  const hintModal = document.getElementById("hint-modal");
  const hintClose = document.getElementById("hint-close");

  avatarLocked.addEventListener("click", () => show("screen-keypad"));
  avatarKeypad.addEventListener("click", () => hintModal.classList.remove("hidden"));
  hintClose.addEventListener("click", () => hintModal.classList.add("hidden"));
  hintModal.addEventListener("click", e => { if (e.target === hintModal) hintModal.classList.add("hidden"); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !hintModal.classList.contains("hidden")) hintModal.classList.add("hidden");
  });

  /* ================= SCREEN 2 : keypad ================= */
  const pinDisplay = document.getElementById("pin-display");
  const pinDots = [...document.querySelectorAll(".pin-dot")];
  const keypad = document.getElementById("keypad");
  const keypadError = document.getElementById("keypad-error");
  let entered = "";
  let keypadLocked = false;

  function refreshDots() {
    pinDots.forEach((d, i) => d.classList.toggle("filled", i < entered.length));
  }

  function wrongPasskey() {
    keypadLocked = true;
    keypadError.textContent = "Incorrect passkey — try again";
    keypadError.classList.add("err");
    pinDisplay.classList.add("shake");
    setTimeout(() => {
      pinDisplay.classList.remove("shake");
      entered = "";
      refreshDots();
      keypadLocked = false;
    }, 400);
    setTimeout(() => {
      keypadError.classList.remove("err");
      keypadError.textContent = "Hint: click on image again if you forget passkey";
    }, 1600);
  }

  function submitIfComplete() {
    if (entered.length < CONFIG.passkey.length) return;
    if (entered === CONFIG.passkey) {
      keypadLocked = true;
      burstHearts();
      setTimeout(() => { show("screen-loading"); runLoading(); }, 250);
    } else {
      wrongPasskey();
    }
  }

  function pressKey(key) {
    if (keypadLocked) return;
    if (key === "back") {
      entered = entered.slice(0, -1);
    } else if (entered.length < CONFIG.passkey.length) {
      entered += key;
    }
    refreshDots();
    submitIfComplete();
  }

  keypad.addEventListener("click", e => {
    const btn = e.target.closest(".key");
    if (!btn) return;
    pressKey(btn.dataset.key);
  });

  // optional physical keyboard support (desktop testing)
  document.addEventListener("keydown", e => {
    if (screens["screen-keypad"].classList.contains("hidden")) return;
    if (/^[0-9]$/.test(e.key)) pressKey(e.key);
    else if (e.key === "Backspace") pressKey("back");
  });

  /* ================= SCREEN 3 : loading ================= */
  const progressFill = document.getElementById("progress-fill");
  const loadingBubble = document.getElementById("loading-bubble");
  function runLoading() {
    progressFill.style.width = "0%";
    let pct = 0;

    const quotes = (CONFIG.loadingQuotes && CONFIG.loadingQuotes.length) ? CONFIG.loadingQuotes : ["Hmm…"];
    let qi = 0;
    loadingBubble.textContent = quotes[0];
    const quoteTimer = setInterval(() => {
      qi = (qi + 1) % quotes.length;
      loadingBubble.textContent = quotes[qi];
    }, 850);

    const timer = setInterval(() => {
      pct += 4 + Math.random() * 6;
      if (pct >= 100) {
        pct = 100;
        clearInterval(timer);
        clearInterval(quoteTimer);
        setTimeout(enterDayScreen, 350);
      }
      progressFill.style.width = pct + "%";
    }, 90);
  }

  /* ================= SCREEN 4 : special day (auto-advance) ================= */
  const dayScreen = document.getElementById("screen-day");
  let dayTimer = null;

  function enterDayScreen() {
    show("screen-day");
    dayScreen.addEventListener("click", goToAge, { once: true });
    dayTimer = setTimeout(goToAge, 2600);
  }

  function goToAge() {
    clearTimeout(dayTimer);
    dayScreen.removeEventListener("click", goToAge);
    show("screen-age");
  }

  /* ================= SCREEN 5 : cut-the-cake (swipe gesture) ================= */
  const cakeScene = document.getElementById("cake-scene");
  const cakeHit = document.getElementById("cake-hit");
  const candles = document.getElementById("candles");
  const sliceTrail = document.getElementById("slice-trail");
  const crumbBurst = document.getElementById("crumb-burst");
  const cakeHint = document.getElementById("cake-hint");
  const SWIPE_THRESHOLD = 14; // px of drag movement required to count as a cut — small on purpose, so any real swipe registers

  let cakeCut = false;
  let dragStart = null;
  let pointerInteracted = false;

  function spawnCrumbs() {
    for (let i = 0; i < 10; i++) {
      const crumb = document.createElement("span");
      crumb.className = "crumb";
      crumb.style.setProperty("--dx", ((Math.random() - 0.5) * 70) + "px");
      crumb.style.setProperty("--dy", (-(20 + Math.random() * 30)) + "px");
      crumb.style.left = (85 + (Math.random() - 0.5) * 30) + "px";
      crumb.style.top = (44 + (Math.random() - 0.5) * 20) + "px";
      crumb.style.background = Math.random() < 0.5 ? "var(--pink-soft)" : "#e8c39e";
      crumbBurst.appendChild(crumb);
      setTimeout(() => crumb.remove(), 900);
    }
  }

  function cutCake(angleDeg) {
    if (cakeCut) return;
    cakeCut = true;
    cakeHit.disabled = true;

    if (typeof angleDeg === "number") {
      sliceTrail.classList.add("flash");
      spawnCrumbs();
    }

    setTimeout(() => { candles.classList.add("blown"); }, 120);

    setTimeout(() => {
      cakeScene.classList.add("cut");
      sliceTrail.classList.remove("active", "flash");
    }, 260);

    setTimeout(() => {
      burstConfetti();
      burstHearts();
      cakeHint.textContent = "Happy Birthday! \u{1F389}";
      cakeHint.classList.add("celebrate");
    }, 620);
  }

  cakeHit.addEventListener("pointerdown", e => {
    if (cakeCut) return;
    pointerInteracted = true;
    dragStart = { x: e.clientX, y: e.clientY };
    cakeHit.setPointerCapture(e.pointerId);
    const rect = cakeScene.getBoundingClientRect();
    sliceTrail.style.left = (e.clientX - rect.left) + "px";
    sliceTrail.style.top = (e.clientY - rect.top) + "px";
    sliceTrail.style.width = "0px";
    sliceTrail.classList.add("active");
  });

  cakeHit.addEventListener("pointermove", e => {
    if (cakeCut || !dragStart) return;
    const rect = cakeScene.getBoundingClientRect();
    const startX = dragStart.x - rect.left;
    const startY = dragStart.y - rect.top;
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    const dx = curX - startX;
    const dy = curY - startY;
    sliceTrail.style.left = startX + "px";
    sliceTrail.style.top = startY + "px";
    sliceTrail.style.width = Math.hypot(dx, dy) + "px";
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    sliceTrail.style.transform = `rotate(${angle}deg)`;

    // cut the moment the swipe crosses the threshold — no need to lift the finger first
    if (Math.hypot(dx, dy) >= SWIPE_THRESHOLD) {
      dragStart = null;
      cutCake(angle);
    }
  });

  cakeHit.addEventListener("pointerup", () => {
    if (cakeCut || !dragStart) { sliceTrail.classList.remove("active"); return; }
    dragStart = null;
    sliceTrail.classList.remove("active");
    cakeScene.classList.add("shake");
    setTimeout(() => cakeScene.classList.remove("shake"), 400);
  });

  cakeHit.addEventListener("pointercancel", () => {
    dragStart = null;
    sliceTrail.classList.remove("active");
  });

  // keyboard accessibility: Enter/Space activates the button's click event
  // with no preceding pointerdown, so this is how keyboard users cut the cake
  cakeHit.addEventListener("click", () => {
    if (pointerInteracted) { pointerInteracted = false; return; }
    cutCake();
  });

  function resetCake() {
    cakeCut = false;
    dragStart = null;
    pointerInteracted = false;
    cakeHit.disabled = false;
    sliceTrail.classList.remove("active", "flash");
    crumbBurst.innerHTML = "";
    candles.classList.remove("blown");
    cakeScene.classList.remove("cut", "shake");
    cakeHint.classList.remove("celebrate");
    cakeHint.textContent = "swipe across the cake to cut it \u{2728}";
  }

  document.getElementById("btn-age-next").addEventListener("click", () => {
    renderCarousel();
    show("screen-memories");
  });

  /* ================= SCREEN 6 : memories carousel ================= */
  const carouselEl = document.getElementById("carousel");
  const carouselDotsEl = document.getElementById("carousel-dots");
  let carouselBuilt = false;
  function renderCarousel() {
    if (carouselBuilt) return;
    carouselBuilt = true;
    CONFIG.photos.forEach((src, i) => {
      const card = document.createElement("div");
      card.className = "carousel-card";

      const bg = document.createElement("div");
      bg.className = "carousel-bg";
      bg.style.backgroundImage = `url("${src}")`;
      card.appendChild(bg);

      const img = document.createElement("img");
      img.src = src;
      img.alt = "memory " + (i + 1);
      img.loading = "lazy";
      let photoLoaded = true;
      img.onerror = () => {
        photoLoaded = false;
        card.classList.add("fallback");
        card.textContent = "add photo " + (i + 1);
        bg.remove();
        img.remove();
      };
      card.appendChild(img);

      const zoomHint = document.createElement("span");
      zoomHint.className = "carousel-zoom-hint";
      zoomHint.textContent = "⤢";
      card.appendChild(zoomHint);

      card.addEventListener("click", () => { if (photoLoaded) openLightbox(src); });

      carouselEl.appendChild(card);

      const dot = document.createElement("span");
      dot.className = "dot" + (i === 0 ? " active" : "");
      carouselDotsEl.appendChild(dot);
    });

    const dots = [...carouselDotsEl.children];
    carouselEl.addEventListener("scroll", () => {
      const active = Math.round(carouselEl.scrollLeft / carouselEl.clientWidth);
      dots.forEach((d, i) => d.classList.toggle("active", i === active));
    });
  }

  document.getElementById("btn-memories-next").addEventListener("click", () => {
    show("screen-video");
  });

  /* ---------------- photo lightbox ---------------- */
  const photoLightbox = document.getElementById("photo-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  function openLightbox(src) {
    lightboxImg.src = src;
    photoLightbox.classList.remove("hidden");
  }
  function closeLightbox() {
    photoLightbox.classList.add("hidden");
    lightboxImg.src = "";
  }
  lightboxClose.addEventListener("click", closeLightbox);
  photoLightbox.addEventListener("click", e => {
    if (e.target === photoLightbox) closeLightbox();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !photoLightbox.classList.contains("hidden")) closeLightbox();
  });

  /* ================= SCREEN 6.5 : video message ================= */
  const videoWrap = document.getElementById("video-wrap");
  const surpriseVideo = document.getElementById("surprise-video");
  const videoPlayBtn = document.getElementById("video-play-btn");
  const videoHint = document.getElementById("video-hint");
  const videoMessageModal = document.getElementById("video-message-modal");
  const videoMessageText = document.getElementById("video-message-text");
  const videoMessageContinue = document.getElementById("video-message-continue");

  if (CONFIG.videoMessage && CONFIG.videoMessage.src) {
    surpriseVideo.src = CONFIG.videoMessage.src;
  } else {
    videoWrap.style.display = "none";
    videoHint.style.display = "none";
  }
  videoMessageText.textContent = (CONFIG.videoMessage && CONFIG.videoMessage.message) || "";

  let musicResumeTimer = null;

  videoPlayBtn.addEventListener("click", () => {
    videoWrap.classList.add("playing");
    surpriseVideo.controls = true;
    videoHint.textContent = "";
    clearTimeout(musicResumeTimer);
    if (musicPlaying) fadeAudioVolume(bgMusic, CONFIG.music.volume * 0.12, 400);
    surpriseVideo.play().catch(() => {
      videoWrap.classList.remove("playing");
      videoHint.textContent = "couldn't play the video — check assets/video-message.mp4";
    });
  });

  surpriseVideo.addEventListener("ended", () => {
    videoMessageModal.classList.remove("hidden");
    clearTimeout(musicResumeTimer);
    musicResumeTimer = setTimeout(() => {
      if (musicPlaying) fadeAudioVolume(bgMusic, CONFIG.music.volume, 900);
    }, 1500);
  });

  function closeVideoMessage() {
    videoMessageModal.classList.add("hidden");
    show("screen-envelope");
  }
  videoMessageContinue.addEventListener("click", closeVideoMessage);
  videoMessageModal.addEventListener("click", e => {
    if (e.target === videoMessageModal) closeVideoMessage();
  });

  /* ================= SCREEN 7 : envelope ================= */
  const envelopeBtn = document.getElementById("envelope-btn");
  const envelopeCaption = document.getElementById("envelope-caption");
  envelopeBtn.addEventListener("click", () => {
    if (envelopeBtn.classList.contains("opening")) return;
    envelopeBtn.classList.add("opening");
    envelopeCaption.textContent = "opening letter...";
    setTimeout(() => {
      startLetter();
      show("screen-letter");
    }, 900);
  });

  /* ================= SCREEN 8 : letter (typewriter) ================= */
  const letterBodyEl = document.getElementById("letter-body");
  let typewriterTimer = null;

  function startLetter() {
    clearInterval(typewriterTimer);
    letterBodyEl.textContent = "";
    const text = CONFIG.letterBody;
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    let i = 0;
    typewriterTimer = setInterval(() => {
      i++;
      letterBodyEl.textContent = text.slice(0, i);
      letterBodyEl.appendChild(cursor);
      letterBodyEl.scrollTop = letterBodyEl.scrollHeight;
      if (i >= text.length) clearInterval(typewriterTimer);
    }, 22);
  }

  document.getElementById("letter-close").addEventListener("click", resetApp);
  document.getElementById("btn-restart").addEventListener("click", resetApp);
  document.getElementById("btn-celebrate").addEventListener("click", burstConfetti);

  function resetApp() {
    clearInterval(typewriterTimer);
    const mediaTag = letterMediaEl.querySelector("video, audio");
    if (mediaTag) mediaTag.pause();
    surpriseVideo.pause();
    surpriseVideo.currentTime = 0;
    surpriseVideo.controls = false;
    videoWrap.classList.remove("playing");
    videoMessageModal.classList.add("hidden");
    clearTimeout(musicResumeTimer);
    bgMusic.volume = CONFIG.music.volume;
    if (CONFIG.videoMessage && CONFIG.videoMessage.src) videoHint.textContent = "tap the button to play";
    entered = "";
    keypadLocked = false;
    refreshDots();
    envelopeBtn.classList.remove("opening");
    envelopeCaption.textContent = "tap to open";
    resetCake();
    show("screen-locked");
  }

  /* ================= floating hearts (unlock burst) ================= */
  function burstHearts(count = 16) {
    const frame = document.getElementById("phone-frame");
    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.className = "floating-heart";
      span.textContent = Math.random() < 0.5 ? "❤️" : "\u{1F496}";
      span.style.left = (20 + Math.random() * 60) + "%";
      span.style.setProperty("--fs", (1 + Math.random() * 1.2) + "rem");
      span.style.setProperty("--rot", ((Math.random() - 0.5) * 40) + "deg");
      span.style.animationDelay = (Math.random() * 0.3) + "s";
      frame.appendChild(span);
      setTimeout(() => span.remove(), 2200);
    }
  }

  /* ================= confetti ================= */
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  let confettiParticles = [];
  let confettiRAF = null;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const CONFETTI_COLORS = ["#e0202b", "#f2a5a0", "#ffffff", "#9c0d13", "#ffd1cb"];

  function burstConfetti() {
    resizeCanvas();
    const count = 140;
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 40,
        y: canvas.height * 0.15,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 9 - 4,
        size: 4 + Math.random() * 5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rot: Math.random() * Math.PI,
        vrot: (Math.random() - 0.5) * 0.3,
        life: 0,
        maxLife: 140 + Math.random() * 60
      });
    }
    if (!confettiRAF) animateConfetti();
  }

  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach(p => {
      p.vy += 0.16; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.life++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    confettiParticles = confettiParticles.filter(p => p.life < p.maxLife && p.y < canvas.height + 40);
    if (confettiParticles.length > 0) {
      confettiRAF = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiRAF = null;
    }
  }

});
