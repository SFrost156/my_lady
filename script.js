document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const mainContainer = document.getElementById('mainContainer');
  const music = document.getElementById('backgroundMusic');
  const musicButton = document.getElementById('musicButton');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const slideshow = document.getElementById('slideshow');

  // Detección simple de móvil por ancho
  const isMobile = window.matchMedia('(max-width: 640px)').matches;

  // Slideshow (img/foto1.png ... img/foto5.png)
  const totalFotos = 5;
  const rutaBase = 'img/foto';
  let indice = 1;
  const intervaloSegs = 5;
  let slideshowTimer = null;

  // Pre-carga: móvil solo 2 al inicio; desktop las 5
  const preloadInicial = isMobile ? 2 : totalFotos;
  const preload = [];
  for (let i = 1; i <= preloadInicial; i++) {
    preload[i] = new Image();
    preload[i].src = `${rutaBase}${i}.png`;
  }
  // El resto se precarga cuando el hilo esté libre (menor impacto)
  const precargarRestantes = () => {
    for (let i = preloadInicial + 1; i <= totalFotos; i++) {
      preload[i] = new Image();
      preload[i].src = `${rutaBase}${i}.png`;
    }
  };
  (window.requestIdleCallback || function (cb){ setTimeout(cb, 800); })(precargarRestantes);

  function cambiarFoto() {
    indice = (indice % totalFotos) + 1;
    slideshow.style.opacity = '0';
    setTimeout(() => {
      slideshow.src = `${rutaBase}${indice}.png`;
      slideshow.style.opacity = '1';
    }, 260);
  }

  function iniciarSlideshow() {
    if (slideshowTimer) clearInterval(slideshowTimer);
    slideshowTimer = setInterval(cambiarFoto, intervaloSegs * 1000);
  }
  function pausarSlideshow() {
    if (slideshowTimer) {
      clearInterval(slideshowTimer);
      slideshowTimer = null;
    }
  }

  // Inicio app
  startBtn.addEventListener('click', () => {
    document.getElementById('startScreen').classList.add('hidden');
    mainContainer.classList.remove('animation-paused');
    document.body.style.overflowY = 'auto';

    // Partículas: menos cantidad en móvil
    iniciarPetalos(isMobile ? 10 : 22);

    iniciarSlideshow();
    toggleMusic(true);
  });

  // Pausar animaciones y slideshow cuando la pestaña no esté visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      mainContainer.classList.add('animation-paused');
      pausarSlideshow();
      if (!music.paused) music.pause();
    } else {
      mainContainer.classList.remove('animation-paused');
      if (!slideshowTimer) iniciarSlideshow();
    }
  });

  // Control música
  musicButton.addEventListener('click', () => toggleMusic());
  function toggleMusic(forcePlay = false) {
    if (forcePlay || music.paused) {
      music.play().catch(() => {});
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      music.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  // Pétalos flotantes (DOM barato)
  function crearPetalo() {
    const contenedor = document.getElementById('flotantesContainer');
    const petalo = document.createElement('div');
    petalo.classList.add('petalo');
    petalo.textContent = '❁';
    petalo.style.left = `${Math.random() * 100}vw`;
    petalo.style.fontSize = `${(Math.random() * 0.8 + 0.9).toFixed(2)}rem`;
    petalo.style.animationDuration = `${(Math.random() * 4 + 7).toFixed(2)}s`;
    petalo.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
    contenedor.appendChild(petalo);
  }
  function iniciarPetalos(cuantos = 18) {
    // Crear de a tandas para no bloquear el hilo
    let creados = 0;
    function lote() {
      const n = Math.min(6, cuantos - creados);
      for (let i = 0; i < n; i++) crearPetalo();
      creados += n;
      if (creados < cuantos) {
        requestAnimationFrame(lote);
      }
    }
    requestAnimationFrame(lote);
  }
});
