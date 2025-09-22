document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const mainContainer = document.getElementById('mainContainer');
  const music = document.getElementById('backgroundMusic');
  const musicButton = document.getElementById('musicButton');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');

  // Slideshow (img/foto1.png ... img/foto5.png)
  const slideshow = document.getElementById('slideshow');
  const totalFotos = 5;
  const rutaBase = 'img/foto';
  let indice = 1;
  const intervaloSegs = 5;

  // Pre-cargar imágenes
  const preload = [];
  for (let i = 1; i <= totalFotos; i++) {
    preload[i] = new Image();
    preload[i].src = `${rutaBase}${i}.png`;
  }

  function cambiarFoto() {
    indice = (indice % totalFotos) + 1;
    slideshow.style.opacity = '0';
    setTimeout(() => {
      slideshow.src = `${rutaBase}${indice}.png`;
      slideshow.style.opacity = '1';
    }, 350);
  }

  let slideshowTimer = null;
  function iniciarSlideshow() {
    if (slideshowTimer) clearInterval(slideshowTimer);
    slideshowTimer = setInterval(cambiarFoto, intervaloSegs * 1000);
  }

  // Inicio
  startBtn.addEventListener('click', () => {
    document.getElementById('startScreen').classList.add('hidden');
    mainContainer.classList.remove('animation-paused');
    document.body.style.overflowY = 'auto';
    toggleMusic(true);
    iniciarPetalos();
    iniciarSlideshow();
  });

  // Música
  musicButton.addEventListener('click', () => toggleMusic());
  function toggleMusic(forcePlay = false) {
    if (forcePlay || music.paused) {
      music.play().catch(e => console.log("Error al reproducir audio:", e));
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
    } else {
      music.pause();
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  // Pétalos
  function crearPetalo() {
    const contenedor = document.getElementById('flotantesContainer');
    const petalo = document.createElement('div');
    petalo.classList.add('petalo');
    petalo.innerHTML = '❁';
    petalo.style.left = `${Math.random() * 100}vw`;
    petalo.style.fontSize = `${Math.random() * 1.2 + 1}rem`;
    petalo.style.animationDuration = `${Math.random() * 5 + 8}s`;
    petalo.style.animationDelay = `${Math.random() * 5}s`;
    contenedor.appendChild(petalo);
  }
  function iniciarPetalos() {
    for (let i = 0; i < 28; i++) crearPetalo();
  }
});
