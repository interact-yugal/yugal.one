// Setup Lenis for Smooth Scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  lerp: 0.1
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Smooth scrolling for anchor links utilizing Lenis with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = this.getAttribute('href');
    if (target && target !== '#') {
      e.preventDefault();
      lenis.scrollTo(target, {
        offset: -100 // Adds a buffer so the heading clears the fixed navbar
      });
    }
  });
});

// Lenis Scroll Controls
const scrollUpBtn = document.getElementById('scroll-up');
const scrollDownBtn = document.getElementById('scroll-down');

if (scrollUpBtn && scrollDownBtn) {
  scrollUpBtn.addEventListener('click', () => {
    lenis.scrollTo(0);
  });
  scrollDownBtn.addEventListener('click', () => {
    lenis.scrollTo('bottom');
  });
}

// Audio Player Functionality (Safe Check for Pages Without Audio)
const audio = document.getElementById('podcast-audio');
if (audio) {
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const sliderFilled = document.getElementById('slider-filled');
  const progressInput = document.getElementById('audio-progress');
  const currentTimeDisp = document.getElementById('current-time');
  const totalTimeDisp = document.getElementById('total-time');

  function formatTime(secs) {
    if (isNaN(secs)) return "00:00"; 
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function updateDuration() {
    const formattedTotal = formatTime(audio.duration);
    totalTimeDisp.textContent = formattedTotal;
  }

  audio.addEventListener('loadedmetadata', updateDuration);
  if (audio.readyState >= 1) { 
    updateDuration();
  }

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      audio.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  });

  audio.addEventListener('timeupdate', () => {
    const percentage = (audio.currentTime / audio.duration) * 100;
    progressInput.value = percentage || 0;
    sliderFilled.style.width = `${percentage}%`;
    currentTimeDisp.textContent = formatTime(audio.currentTime);
  });

  progressInput.addEventListener('input', (e) => {
    const seekTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = seekTime;
    sliderFilled.style.width = `${e.target.value}%`;
  });

  audio.addEventListener('ended', () => {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    progressInput.value = 0;
    sliderFilled.style.width = '0%';
    currentTimeDisp.textContent = '00:00';
  });
       
  // Logic for Language Switcher via Data Attributes
  const languageRadios = document.querySelectorAll('input[name="podcast-lang"]');
       
  languageRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const wasPlaying = !audio.paused;
      
      audio.src = e.target.dataset.src;
      audio.load();
                   
      progressInput.value = 0;
      sliderFilled.style.width = '0%';
      currentTimeDisp.textContent = '00:00';
                   
      if (wasPlaying) {
        audio.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    });
  });
}