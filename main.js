/**
 * AMORE MÍO - Sistema de Inyección de Componentes Globales
 * Este archivo inyecta automáticamente el Navbar y Footer en todas las páginas
 */

/**
 * Obtiene el número de items en el carrito
 * @returns {number} Cantidad de items
 */
function getCarritoCount() {
  try {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    return carrito.length;
  } catch {
    return 0;
  }
}

/**
 * Genera el HTML del Navbar
 * @returns {string} HTML del Navbar
 */
function generateNavbar() {
  const carritoCount = getCarritoCount();
  
  const menuItems = [
    { text: 'Cumpleaños', categoria: 'Cumpleaños' },
    { text: 'Aniversario', categoria: 'Aniversario' },
    { text: 'Condolencias', categoria: 'Condolencias' }
  ];

  const menuLinks = menuItems.map(item => 
    `<li><a href="#" class="menu-link" data-categoria="${item.categoria}">${item.text}</a></li>`
  ).join('');

  return `
    <header class="navbar">
      <div class="navbar-container">
        <a href="index.html" class="navbar-logo">Amore Mío</a>
        <nav class="navbar-nav">
          <ul class="navbar-menu" id="navbarMenu">
            ${menuLinks}
          </ul>
          <div class="mega-menu-dropdown" id="megaMenu">
            <div class="mega-menu-content" id="megaMenuContent">
              <!-- Contenido se inyecta dinámicamente -->
            </div>
          </div>
        </nav>
        <a href="carrito.html" class="navbar-cart">
          <i class="fas fa-shopping-bag"></i>
          ${carritoCount > 0 ? `<span class="cart-count">${carritoCount}</span>` : ''}
        </a>
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

// Variable global para productos (compartida con catalogo.js si está disponible)
let productosGlobales = [];

/**
 * Cargar productos para el mega menu
 */
async function cargarProductosParaMegaMenu() {
  try {
    // Intentar obtener productos desde catalogo.js si está disponible
    if (typeof productos !== 'undefined' && productos.length > 0) {
      productosGlobales = productos;
      return productos;
    }
    
    // Si ya los cargamos antes, usar esos
    if (productosGlobales.length > 0) {
      return productosGlobales;
    }
    
    // Si no hay productos cargados, intentar cargar desde la API
    const URL_API = 'https://script.google.com/macros/s/AKfycbyfqYVWemnAfC2vbduT0x-VaIKh-D_hV7nOP9wCd1pouAvnepP05bhoj9GNBNMEs0sy/exec';
    const response = await fetch(URL_API);
    if (response.ok) {
      const data = await response.json();
      productosGlobales = Array.isArray(data) ? data : [];
      return productosGlobales;
    }
  } catch (error) {
    console.error('Error al cargar productos para mega menu:', error);
  }
  return [];
}

/**
 * Generar contenido del mega menu
 */
function generarMegaMenuContent(categoria, productos) {
  // Filtrar productos por categoría
  let productosFiltrados = productos.filter(p => 
    (p.Categoria || '').toLowerCase() === categoria.toLowerCase()
  );
  
  // Si no hay productos de esa categoría, usar los primeros 5 productos disponibles
  if (productosFiltrados.length === 0) {
    productosFiltrados = productos.slice(0, 5);
  } else {
    productosFiltrados = productosFiltrados.slice(0, 5);
  }
  
  if (productosFiltrados.length === 0) {
    return '<p>No hay productos disponibles</p>';
  }
  
  let html = '<div class="mega-menu-grid">';
  
  productosFiltrados.forEach(producto => {
    html += `
      <div class="mega-menu-item">
        <a href="catalogo.html?categoria=${encodeURIComponent(categoria)}">
          <img src="${producto.Imagen || 'https://via.placeholder.com/150x150'}" alt="${producto.Nombre}">
          <h4>${producto.Nombre || 'Producto'}</h4>
        </a>
      </div>
    `;
  });
  
  // Agregar enlace "VER MÁS"
  html += `
    <div class="mega-menu-item mega-menu-ver-mas">
      <a href="catalogo.html?categoria=${encodeURIComponent(categoria)}">
        <div class="ver-mas-content">
          <span>VER MÁS</span>
        </div>
      </a>
    </div>
  `;
  
  html += '</div>';
  return html;
}

/**
 * Inicializar mega menu
 */
function inicializarMegaMenu() {
  const menuLinks = document.querySelectorAll('.menu-link');
  const megaMenu = document.getElementById('megaMenu');
  const megaMenuContent = document.getElementById('megaMenuContent');
  
  if (!megaMenu || !megaMenuContent) return;
  
  let productosDisponibles = [];
  
  // Cargar productos cuando se necesiten
  menuLinks.forEach(link => {
    link.addEventListener('mouseenter', async function(e) {
      e.preventDefault();
      const categoria = this.dataset.categoria;
      
      // Cargar productos si no están disponibles
      if (productosDisponibles.length === 0) {
        productosDisponibles = await cargarProductosParaMegaMenu();
      }
      
      // Generar y mostrar contenido
      megaMenuContent.innerHTML = generarMegaMenuContent(categoria, productosDisponibles);
      megaMenu.style.opacity = '1';
      megaMenu.style.visibility = 'visible';
    });
  });
  
  // Ocultar al salir del menú
  const nav = document.querySelector('.navbar-nav');
  if (nav) {
    nav.addEventListener('mouseleave', function() {
      megaMenu.style.opacity = '0';
      megaMenu.style.visibility = 'hidden';
    });
  }
}

/**
 * Inicializa todo cuando el DOM esté listo
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    injectGlobalComponents();
    setTimeout(() => {
      inicializarMegaMenu();
    }, 100);
  });
} else {
  // Si el DOM ya está listo, ejecutar inmediatamente
  injectGlobalComponents();
  setTimeout(() => {
    inicializarMegaMenu();
  }, 100);
}

// Función para actualizar el contador del carrito (disponible globalmente)
window.updateCarritoCount = function() {
  const cartIcon = document.querySelector('.navbar-cart');
  if (cartIcon) {
    const count = getCarritoCount();
    const countElement = cartIcon.querySelector('.cart-count');
    if (count > 0) {
      if (!countElement) {
        cartIcon.innerHTML = `<i class="fas fa-shopping-bag"></i><span class="cart-count">${count}</span>`;
      } else {
        countElement.textContent = count;
      }
    } else if (countElement) {
      countElement.remove();
    }
  }
};
