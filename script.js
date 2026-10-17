/* ==========================================================================
   LÓGICA LIGERA Y FLUIDA - FOQUITA PARA ARI (CERO LAG)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos
  const sealAssembly = document.getElementById('seal-assembly');
  const sealCharacter = document.getElementById('seal-character');
  const speechBubble = document.getElementById('speech-bubble');
  const fxLayer = document.getElementById('fx-layer');

  // Botones principales
  const btnFeed = document.getElementById('btn-feed');
  const btnHearts = document.getElementById('btn-hearts');
  const btnFlip = document.getElementById('btn-flip');
  const btnDance = document.getElementById('btn-dance');
  const btnLetter = document.getElementById('btn-letter');
  const btnPhoto = document.getElementById('btn-photo');

  // Controles superiores
  const btnTheme = document.getElementById('btn-theme');
  const btnMusic = document.getElementById('btn-music');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  // Modales
  const letterModal = document.getElementById('letter-modal');
  const btnCloseLetter = document.getElementById('btn-close-letter');
  const btnLetterLove = document.getElementById('btn-letter-love');

  const polaroidModal = document.getElementById('polaroid-modal');
  const btnClosePolaroid = document.getElementById('btn-close-polaroid');
  const btnDownloadPhoto = document.getElementById('btn-download-photo');

  // ==========================================================================
  // FEEDBACK HÁPTICO Y SONIDO LIGERO (SINTETIZADO, CERO ASSETS)
  // ==========================================================================
  function vibrate(ms = 15) {
    if (navigator.vibrate) {
      try { navigator.vibrate(ms); } catch (e) {}
    }
  }

  let audioCtx = null;
  let isPlayingMusic = false;
  let musicTimer = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 0.18, type = 'sine') {
    initAudio();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  // Melodía ligera tipo cajita musical para Ari
  const melody = [523, 587, 659, 784, 880, 784, 659, 523];
  let noteIdx = 0;

  function toggleMusic() {
    isPlayingMusic = !isPlayingMusic;
    vibrate(20);
    if (isPlayingMusic) {
      btnMusic.classList.add('active');
      btnMusic.innerHTML = '🎵';
      playMusicLoop();
      setBubble('¡Música para ti! 🎶');
    } else {
      btnMusic.classList.remove('active');
      btnMusic.innerHTML = '🔇';
      clearTimeout(musicTimer);
    }
  }

  function playMusicLoop() {
    if (!isPlayingMusic) return;
    playTone(melody[noteIdx % melody.length], 0.3);
    noteIdx++;
    musicTimer = setTimeout(playMusicLoop, 550);
  }

  btnMusic.addEventListener('click', toggleMusic);

  // Pantalla Completa
  btnFullscreen.addEventListener('click', () => {
    vibrate(20);
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      btnFullscreen.innerHTML = '🗗';
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      btnFullscreen.innerHTML = '📱';
    }
  });

  // Selector de Tema
  const themes = ['theme-sunset', 'theme-aurora', 'theme-polar'];
  let currentTheme = 0;
  btnTheme.addEventListener('click', () => {
    vibrate(15);
    playTone(600, 0.12);
    document.body.classList.remove(...themes);
    currentTheme = (currentTheme + 1) % themes.length;
    const next = themes[currentTheme];
    if (next !== 'theme-sunset') document.body.classList.add(next);

    const msgs = ['Atardecer Pastel 🌅', 'Noche Polar Mágica 🌌', 'Sueño Polar ❄️'];
    setBubble(msgs[currentTheme]);
  });

  // ==========================================================================
  // BURBUJA DE DIÁLOGO
  // ==========================================================================
  const quotes = [
    '¡Hola Ari! 💕',
    '¡Te quelo mucho!',
    '¡Eres súper especial! ✨',
    '¡Mira mi pancita! 🦭',
    '¡Más mimos porfa! 🥰',
    '¡Sonríe, Ari! Hoy es un gran día 💖'
  ];
  let quoteIdx = 0;

  function setBubble(text) {
    speechBubble.style.opacity = '0';
    speechBubble.style.transform = 'translateY(5px)';
    setTimeout(() => {
      speechBubble.innerText = text;
      speechBubble.style.opacity = '1';
      speechBubble.style.transform = 'translateY(0)';
    }, 120);
  }

  // ==========================================================================
  // EFECTOS FLOTANTES LIGEROS (DOM EN DEMANDA, SE AUTO-ELIMINAN)
  // ==========================================================================
  function spawnFloatingIcon(x, y, icon = '💖') {
    const el = document.createElement('div');
    el.className = 'fx-item';
    el.innerText = icon;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    fxLayer.appendChild(el);

    el.addEventListener('animationend', () => el.remove());
  }

  // ==========================================================================
  // INTERACCIÓN CON LA FOQUITA
  // ==========================================================================

  // Toque / Clic en la foquita: salto elástico
  sealAssembly.addEventListener('click', (e) => {
    vibrate(20);
    playTone(320, 0.15, 'triangle');
    quoteIdx = (quoteIdx + 1) % quotes.length;
    setBubble(quotes[quoteIdx]);

    const rect = sealAssembly.getBoundingClientRect();
    spawnFloatingIcon(rect.left + rect.width / 2 - 10, rect.top, '✨');

    sealCharacter.classList.remove('anim-boing', 'anim-flip', 'anim-dance', 'anim-eat');
    void sealCharacter.offsetWidth; // Reflow
    sealCharacter.classList.add('anim-boing');
    setTimeout(() => sealCharacter.classList.remove('anim-boing'), 650);
  });

  // Caricias: sonrojo
  sealAssembly.addEventListener('pointerenter', () => {
    sealAssembly.classList.add('is-happy');
  });

  sealAssembly.addEventListener('pointerleave', () => {
    sealAssembly.classList.remove('is-happy');
  });

  // ==========================================================================
  // BOTONES DE ACCIÓN
  // ==========================================================================

  // 1. Dar Pez 🐟
  btnFeed.addEventListener('click', () => {
    vibrate(20);
    playTone(660, 0.15);
    setBubble('¡Pescadito! ¡Ñam ñam! 🐟');

    const rect = sealAssembly.getBoundingClientRect();
    const fish = document.createElement('div');
    fish.className = 'floating-fish-drop';
    fish.innerText = '🐟';
    fish.style.left = `${rect.left + rect.width * 0.3}px`;
    fish.style.top = `${rect.top - 10}px`;
    document.body.appendChild(fish);

    setTimeout(() => {
      fish.remove();
      playTone(880, 0.15);
      sealCharacter.classList.remove('anim-boing', 'anim-flip', 'anim-dance', 'anim-eat');
      void sealCharacter.offsetWidth;
      sealCharacter.classList.add('anim-eat');
      spawnFloatingIcon(rect.left + rect.width * 0.5, rect.top + 20, '💖');

      setTimeout(() => {
        sealCharacter.classList.remove('anim-eat');
        setBubble('¡Delicioso, Ari! 💖');
      }, 700);
    }, 500);
  });

  // 2. Amor 💖
  btnHearts.addEventListener('click', () => {
    vibrate([20, 30]);
    playTone(523, 0.15);
    setTimeout(() => playTone(659, 0.15), 100);
    setTimeout(() => playTone(784, 0.2), 200);

    setBubble('¡Mucho amor para ti, Ari! 💖');

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const x = window.innerWidth * 0.2 + Math.random() * (window.innerWidth * 0.6);
        const y = window.innerHeight * 0.4 + Math.random() * (window.innerHeight * 0.3);
        spawnFloatingIcon(x, y, '💖');
      }, i * 70);
    }
  });

  // 3. Voltereta 🔄
  btnFlip.addEventListener('click', () => {
    vibrate(20);
    playTone(440, 0.12);
    setTimeout(() => playTone(880, 0.2), 150);

    setBubble('¡Yajuuu! ¡Mira mi maroma! ✨');

    const rect = sealAssembly.getBoundingClientRect();
    spawnFloatingIcon(rect.left + rect.width * 0.5, rect.top, '⭐');

    sealCharacter.classList.remove('anim-boing', 'anim-flip', 'anim-dance', 'anim-eat');
    void sealCharacter.offsetWidth;
    sealCharacter.classList.add('anim-flip');
    setTimeout(() => sealCharacter.classList.remove('anim-flip'), 800);
  });

  // 4. Bailar 💃
  let isDancing = false;
  btnDance.addEventListener('click', () => {
    vibrate(15);
    isDancing = !isDancing;
    if (isDancing) {
      btnDance.classList.add('highlight');
      sealCharacter.classList.add('anim-dance');
      setBubble('¡A bailar con Ari! 🎶');
    } else {
      btnDance.classList.remove('highlight');
      sealCharacter.classList.remove('anim-dance');
      setBubble('¡Qué divertido baile! 🥰');
    }
  });

  // 5. Modal Mensaje 💌
  btnLetter.addEventListener('click', () => {
    vibrate(20);
    playTone(523, 0.18);
    letterModal.classList.add('open');
  });

  btnCloseLetter.addEventListener('click', () => {
    vibrate(15);
    letterModal.classList.remove('open');
  });

  letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) letterModal.classList.remove('open');
  });

  btnLetterLove.addEventListener('click', () => {
    vibrate(25);
    playTone(784, 0.2);
    setBubble('¡Te quelo mucho, Ari! 💕');
    for (let i = 0; i < 4; i++) {
      spawnFloatingIcon(window.innerWidth * 0.5 + (Math.random() - 0.5) * 80, window.innerHeight * 0.5, '💖');
    }
  });

  // 6. Modal Polaroid (Botón "Guardar")
  btnPhoto.addEventListener('click', () => {
    vibrate(20);
    playTone(660, 0.15);
    polaroidModal.classList.add('open');
  });

  btnClosePolaroid.addEventListener('click', () => {
    vibrate(15);
    polaroidModal.classList.remove('open');
  });

  polaroidModal.addEventListener('click', (e) => {
    if (e.target === polaroidModal) polaroidModal.classList.remove('open');
  });

  // Botón que solo dice "Guardar"
  btnDownloadPhoto.addEventListener('click', () => {
    vibrate(25);
    playTone(880, 0.2);

    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 620;
    const ctx = canvas.getContext('2d');

    // Fondo blanco polaroid
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 500, 620);

    // Marco interior
    const grad = ctx.createLinearGradient(0, 30, 0, 440);
    grad.addColorStop(0, '#ffdde1');
    grad.addColorStop(1, '#ee9ca7');
    ctx.fillStyle = grad;
    ctx.fillRect(30, 30, 440, 410);

    // Dibujar foquita
    const sealImg = document.getElementById('seal-image');
    if (sealImg && sealImg.complete) {
      ctx.drawImage(sealImg, 50, 130, 400, 200);
    }

    // Texto polaroid
    ctx.fillStyle = '#ff4081';
    ctx.font = 'bold 36px cursive';
    ctx.textAlign = 'center';
    ctx.fillText('¡Hola Ari! 🦭✨', 250, 500);

    ctx.fillStyle = '#634b66';
    ctx.font = '20px sans-serif';
    ctx.fillText('Un lindo recuerdo para ti', 250, 540);

    const link = document.createElement('a');
    link.download = 'foquita-ari.png';
    link.href = canvas.toDataURL('image/png');
    link.click();

    setBubble('¡Guardado con éxito! 📸');
    polaroidModal.classList.remove('open');
  });
});
