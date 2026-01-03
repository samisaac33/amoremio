/**
 * Hero Slider - Carrusel de imágenes automático con navegación manual
 */
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;
  let autoSlideInterval = null;

  if (slides.length === 0) return;

  function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = index;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;
    slides[currentSlide].classList.add('active');
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

