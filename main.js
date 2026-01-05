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

  const navLinksHTML = menuItems.map(item => 
    `<a href="catalogo.html?categoria=${encodeURIComponent(item.categoria)}" class="nav-link">${item.text}</a>`
  ).join('');

  return `
    <header class="header">
      <!-- Logo - Izquierda -->
      <a href="index.html" class="logo">
        <img src="https://drive.google.com/thumbnail?id=1f1YnSIYlzITxxiATHoquNkm9O0dCFzKL&sz=w2000" alt="Amore Mío" class="logo-img">
        <span class="logo-text">Amore Mío</span>
      </a>

      <!-- Navegación - Centro (Solo Desktop) -->
      <nav class="nav-links" id="navLinks">
        ${navLinksHTML}
      </nav>

      <!-- Carrito y Hamburguesa - Derecha -->
      <div class="header-right">
        <a href="carrito.html" class="cart-icon">
          <i class="fas fa-shopping-bag"></i>
          ${carritoCount > 0 ? `<span class="cart-count">${carritoCount}</span>` : ''}
        </a>
        <button class="hamburger" id="hamburger" aria-label="Abrir menú" aria-expanded="false">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

      <!-- Menú móvil (oculto por defecto) -->
      <nav class="mobile-nav" id="mobileNav">
        <div class="mobile-nav-header">
          <button class="mobile-nav-close" id="mobileNavClose" aria-label="Cerrar menú">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="mobile-nav-links">
          ${navLinksHTML}
        </div>
      </nav>
      <div class="mobile-nav-overlay" id="mobileNavOverlay"></div>
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
          <div class="footer-section footer-brand">
            <div class="footer-brand-block">
              <img src="https://drive.google.com/thumbnail?id=17dNi3fIpOWX1bc4kjPTcSWySO2PPVtLS&sz=w2000" alt="Amore Mío" class="footer-logo-img">
              <h2 class="footer-logo">Amore Mío</h2>
            </div>
            <p class="footer-tagline">Pasión en cada detalle</p>
          </div>
          
          <div class="footer-section footer-social">
            <h3 class="footer-title">Síguenos</h3>
            <div class="footer-social-links">
              <a href="https://www.instagram.com/amoremio_portoviejo/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 aria-label="Instagram de Amore Mío"
                 class="footer-social-link">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="https://www.facebook.com/profile.php?id=100032133146340" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 aria-label="Facebook de Amore Mío"
                 class="footer-social-link">
                <i class="fab fa-facebook"></i>
              </a>
            </div>
          </div>
          
          <div class="footer-section footer-payment">
            <h3 class="footer-title">Pagos Seguros</h3>
            <div class="footer-payment-methods">
              <a href="https://www.paypal.me/amoremioflorist" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 aria-label="PayPal de Amore Mío"
                 class="footer-payment-link">
                <i class="fab fa-paypal"></i>
              </a>
              <span class="footer-payment-icon" aria-label="Visa">
                <i class="fab fa-cc-visa"></i>
              </span>
              <span class="footer-payment-icon" aria-label="Mastercard">
                <i class="fab fa-cc-mastercard"></i>
              </span>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2026 Amore Mío. Todos los derechos reservados.</p>
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
  
  html += '</div>';
  
  // Agregar enlace "VER MÁS" fuera del grid
  html += `
    <div class="mega-menu-ver-mas">
      <a href="catalogo.html?categoria=${encodeURIComponent(categoria)}" class="ver-mas-content">
        VER MÁS
      </a>
    </div>
  `;
  
  return html;
}

/**
 * Inicializar mega menu (deshabilitado - usando navegación simple)
 */
function inicializarMegaMenu() {
  // Mega menu deshabilitado - usando navegación directa
  // Esta función se mantiene por compatibilidad pero no hace nada
  return;
}

/**
 * Inicializa todo cuando el DOM esté listo
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    injectGlobalComponents();
    setTimeout(() => {
      inicializarMegaMenu();
      cargarProductosDestacados();
    }, 100);
  });
} else {
  // Si el DOM ya está listo, ejecutar inmediatamente
  injectGlobalComponents();
  setTimeout(() => {
    inicializarMegaMenu();
    cargarProductosDestacados();
  }, 100);
}

/**
 * Formatear precio
 */
function formatearPrecio(precio) {
  if (!precio) return '$0.00';
  const numPrecio = typeof precio === 'string' ? parseFloat(precio) : precio;
  if (isNaN(numPrecio)) return '$0.00';
  return `$${numPrecio.toFixed(2)}`;
}

/**
 * Crear tarjeta de producto (compartida con catalogo.js)
 */
function crearTarjetaProductoHTML(producto, index) {
  const disponible = producto.Disponible !== false;
  const tieneEtiqueta = producto.Etiqueta && producto.Etiqueta.trim() !== '';
  const claseAgotado = !disponible ? 'agotado' : '';
  const precio = formatearPrecio(producto.Precio);

  return `
    <div class="product-card ${claseAgotado}" data-producto-index="${index}">
      <div class="product-image-container">
          <img 
            src="${producto.Imagen || 'https://via.placeholder.com/400x400?text=Imagen+No+Disponible'}" 
            alt="${producto.Nombre || 'Producto'}"
            class="product-image"
            loading="lazy"
            decoding="async"
          >
        ${tieneEtiqueta ? `<span class="product-badge">${producto.Etiqueta}</span>` : ''}
      </div>
      <div class="product-info">
        <h3 class="product-name">${producto.Nombre || 'Sin nombre'}</h3>
        <div class="product-footer">
          <span class="product-price">${precio}</span>
          <button 
            class="product-btn ${!disponible ? 'disabled' : ''}"
            ${!disponible ? 'disabled' : ''}
            ${!disponible ? 'aria-disabled="true"' : ''}
          >
            ${disponible ? 'Comprar' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Agregar producto al carrito (compartida)
 */
function agregarAlCarritoGlobal(producto) {
  try {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar contador si existe la función
    if (typeof updateCarritoCount === 'function') {
      updateCarritoCount();
    }
    
    // Redirigir a carrito
    window.location.href = 'carrito.html';
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('Error al agregar el producto al carrito');
  }
}

// Variable global para el índice del carrusel
let carruselIndex = 0;
let productosDestacadosGlobal = [];

/**
 * Cargar y renderizar productos destacados
 */
async function cargarProductosDestacados() {
  const featuredTrack = document.querySelector('.featured-carousel-track');
  if (!featuredTrack) return;

  try {
    // Cargar productos
    const productos = await cargarProductosParaMegaMenu();
    
    if (productos.length === 0) {
      featuredTrack.innerHTML = '<p class="mensaje-vacio">No hay productos disponibles</p>';
      return;
    }

    // Obtener 10 productos para el carrusel
    productosDestacadosGlobal = productos.slice(0, 10);
    
    // Renderizar productos
    featuredTrack.innerHTML = productosDestacadosGlobal.map((producto, index) => 
      crearTarjetaProductoHTML(producto, index)
    ).join('');

    // Agregar event listeners a los botones de compra
    featuredTrack.querySelectorAll('.product-btn:not(.disabled)').forEach(btn => {
      btn.addEventListener('click', function() {
        const card = this.closest('.product-card');
        const productoIndex = parseInt(card.dataset.productoIndex);
        const producto = productosDestacadosGlobal[productoIndex];
        agregarAlCarritoGlobal(producto);
      });
    });

    // Inicializar carrusel
    inicializarCarruselDestacados();

  } catch (error) {
    console.error('Error al cargar productos destacados:', error);
    featuredTrack.innerHTML = '<p class="mensaje-vacio">Error al cargar productos</p>';
  }
}

/**
 * Inicializar carrusel de productos destacados (infinito)
 */
function inicializarCarruselDestacados() {
  const featuredTrack = document.querySelector('.featured-carousel-track');
  const prevBtn = document.querySelector('.featured-carousel-wrapper .carousel-btn.prev-btn');
  const nextBtn = document.querySelector('.featured-carousel-wrapper .carousel-btn.next-btn');

  if (!featuredTrack || !prevBtn || !nextBtn) return;

  // Obtener la primera tarjeta para calcular su ancho real
  const firstCard = featuredTrack.querySelector('.product-card');
  if (!firstCard) return;

  function getCardWidth() {
    const rect = firstCard.getBoundingClientRect();
    return rect.width;
  }

  function getScrollDistance() {
    const cardWidth = getCardWidth();
    const gap = 30;
    return cardWidth + gap;
  }

  nextBtn.addEventListener('click', function() {
    carruselIndex++;
    
    // Si llegamos al final, volver al inicio (infinito)
    if (carruselIndex >= productosDestacadosGlobal.length - 3) {
      carruselIndex = 0;
    }
    
    const scrollDistance = getScrollDistance();
    const translateX = -(carruselIndex * scrollDistance);
    featuredTrack.style.transform = `translateX(${translateX}px)`;
  });

  prevBtn.addEventListener('click', function() {
    carruselIndex--;
    
    // Si estamos al inicio, ir al final (infinito)
    if (carruselIndex < 0) {
      carruselIndex = productosDestacadosGlobal.length - 4;
    }
    
    const scrollDistance = getScrollDistance();
    const translateX = -(carruselIndex * scrollDistance);
    featuredTrack.style.transform = `translateX(${translateX}px)`;
  });

  // Inicializar posición
  featuredTrack.style.transform = 'translateX(0px)';
  carruselIndex = 0;
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

/**
 * Inicializar menú móvil hamburguesa
 */
function inicializarMenuMovil() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const body = document.body;
  
  if (!hamburger || !mobileNav || !mobileNavOverlay) return;
  
  let isMenuOpen = false;
  
  function abrirMenu() {
    isMenuOpen = true;
    mobileNav.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileNavOverlay.classList.add('active');
    body.style.overflow = 'hidden';
  }
  
  function cerrarMenu() {
    isMenuOpen = false;
    mobileNav.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNavOverlay.classList.remove('active');
    body.style.overflow = '';
  }
  
  // Toggle del menú
  hamburger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isMenuOpen) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  });
  
  // Cerrar al hacer clic en el overlay
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', function(e) {
      const menuWidth = window.innerWidth * 0.75;
      const maxMenuWidth = 300;
      const actualMenuWidth = Math.min(menuWidth, maxMenuWidth);
      
      if (e.clientX > actualMenuWidth && isMenuOpen) {
        cerrarMenu();
      }
    });
    
    mobileNavOverlay.addEventListener('touchstart', function(e) {
      const menuWidth = window.innerWidth * 0.75;
      const maxMenuWidth = 300;
      const actualMenuWidth = Math.min(menuWidth, maxMenuWidth);
      
      if (e.touches[0] && e.touches[0].clientX > actualMenuWidth && isMenuOpen) {
        cerrarMenu();
      }
    });
  }
  
  // Cerrar al hacer clic en el botón X
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      cerrarMenu();
    });
  }
  
  // Manejar clicks en los enlaces del menú móvil
  const mobileNavLinks = mobileNav.querySelectorAll('.mobile-nav-links .nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      cerrarMenu();
    });
  });
  
  // Prevenir propagación de clicks dentro del menú
  if (mobileNav) {
    mobileNav.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }
}

// Inicializar menú móvil después de inyectar componentes
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
      inicializarMenuMovil();
    }, 150);
  });
} else {
  setTimeout(() => {
    inicializarMenuMovil();
  }, 150);
}

