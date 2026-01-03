/**
 * Hero Slider - Carrusel de imágenes automático
 */
document.addEventListener('DOMContentLoaded', function() {
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  if (slides.length === 0) return;

  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  // Cambiar slide cada 3 segundos
  setInterval(nextSlide, 3000);
});

