/**
 * AMORE MÍO - Sistema de Inyección de Componentes Globales
 * Este archivo inyecta automáticamente el Navbar y Footer en todas las páginas
 */

/**
 * Genera el HTML del Navbar
 * @returns {string} HTML del Navbar
 */
function generateNavbar() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  const navItems = [
    { href: 'index.html', text: 'Inicio' },
    { href: 'catalogo.html', text: 'Catálogo' },
    { href: 'nosotros.html', text: 'Nosotros' },
    { href: 'contacto.html', text: 'Contacto' }
  ];

  // Generar los items del menú
  const menuItems = navItems.map(item => {
    const isActive = item.href === currentPage ? 'class="active"' : '';
    return `<li><a href="${item.href}" ${isActive}>${item.text}</a></li>`;
  }).join('');

  return `
    <header class="navbar">
      <div class="navbar-container">
        <a href="index.html" class="navbar-logo">Amore Mío</a>
        <nav>
          <ul class="navbar-menu" id="navbarMenu">
            ${menuItems}
          </ul>
        </nav>
      </div>
    </header>
  `;
}

/**
 * Genera el HTML del Footer
 * @returns {string} HTML del Footer
 */
function generateFooter() {
  return `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Amore Mío</h3>
            <p>Floristería especializada en crear momentos inolvidables a través de arreglos florales únicos y personalizados.</p>
          </div>
          
          <div class="footer-section">
            <h3>Contacto</h3>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">📍</span>
              <span>Av. Reales Tamarindos y Paulo Emilio Macías</span>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">📞</span>
              <a href="tel:0986681447">0986681447</a>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">✉️</span>
              <a href="mailto:contacto@amoremio.com">contacto@amoremio.com</a>
            </div>
          </div>
          
          <div class="footer-section">
            <h3>Síguenos</h3>
            <p>Mantente al día con nuestras novedades y ofertas especiales</p>
            <div class="footer-social">
              <a href="https://www.instagram.com/floristeriaamoremio" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 aria-label="Instagram de Amore Mío">
                📷
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 Amore Mío. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `;
}

/**
 * Inyecta el Navbar y Footer en la página
 */
function injectGlobalComponents() {
  // Inyectar Navbar al inicio del body
  const body = document.body;
  body.insertAdjacentHTML('afterbegin', generateNavbar());

  // Inyectar Footer al final del body
  body.insertAdjacentHTML('beforeend', generateFooter());
}

/**
 * Agrega estilos para el item activo del menú
 */
function highlightActiveMenuItem() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const menuLinks = document.querySelectorAll('.navbar-menu a');
  
  menuLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.style.color = 'var(--color-primary)';
      link.style.fontWeight = '600';
    }
  });
}

/**
 * Inicializa todo cuando el DOM esté listo
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    injectGlobalComponents();
    highlightActiveMenuItem();
  });
} else {
  // Si el DOM ya está listo, ejecutar inmediatamente
  injectGlobalComponents();
  highlightActiveMenuItem();
}
