/**
 * Hero Slider - Carrusel de imágenes automático con navegación manual
 * Simplificado: Solo títulos, sin descripciones
 */
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.hero-slide');
  const heroTitle = document.querySelector('.hero-title');
  let currentSlide = 0;
  let autoSlideInterval = null;

  if (slides.length === 0) return;

  // Títulos para las 6 diapositivas
  const titles = [
    'Dilo con Flores',
    'Momentos Inolvidables',
    'Amor en cada Detalle',
    'Sorprende Hoy',
    'Frescura Garantizada',
    'Amore Mío'
  ];

  function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = index;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;
    slides[currentSlide].classList.add('active');
    
    // Actualizar título
    if (heroTitle && titles[currentSlide]) {
      heroTitle.textContent = titles[currentSlide];
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    // Limpiar intervalo anterior si existe
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
    // Iniciar nuevo intervalo
    autoSlideInterval = setInterval(nextSlide, 3000);
  }

  // Inicializar con el primer título
  if (heroTitle && titles[0]) {
    heroTitle.textContent = titles[0];
  }

  // Iniciar auto slide
  startAutoSlide();

  // Event listeners para las flechas
  const prevButton = document.querySelector('.slider-arrow.prev');
  const nextButton = document.querySelector('.slider-arrow.next');

  if (prevButton) {
    prevButton.addEventListener('click', function() {
      prevSlide();
      startAutoSlide(); // Reiniciar temporizador
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', function() {
      nextSlide();
      startAutoSlide(); // Reiniciar temporizador
    });
  }
});

