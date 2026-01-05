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
    // Sumar todas las cantidades en lugar de solo contar items
    return carrito.reduce((total, producto) => total + (producto.cantidad || 1), 0);
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
    { text: 'Cumpleaños', categoria: 'Todos' },
    { text: 'Aniversario', categoria: 'Todos' },
    { text: 'Condolencias', categoria: 'Arreglos Fúnebres' }
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
 * Genera el HTML del botón flotante de WhatsApp
 * @returns {string} HTML del botón de WhatsApp
 */
function generateWhatsAppButton() {
  return `
    <a href="https://wa.me/593986681447?text=Hola%20Amore%20M%C3%ADo%2C%20me%20gustar%C3%ADa%20informaci%C3%B3n%20sobre%20sus%20productos" 
       class="whatsapp-float" 
       target="_blank" 
       rel="noopener noreferrer" 
       aria-label="Contáctanos por WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
    </a>
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

  // Inyectar botón flotante de WhatsApp justo antes del cierre del body
  body.insertAdjacentHTML('beforeend', generateWhatsAppButton());
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
      cargarProductosDestacados('Todos');
      inicializarFiltrosHome();
      inicializarMenuMovil();
    }, 100);
  });
} else {
  // Si el DOM ya está listo, ejecutar inmediatamente
  injectGlobalComponents();
  setTimeout(() => {
    inicializarMegaMenu();
    cargarProductosDestacados('Todos');
    inicializarFiltrosHome();
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
  
  // Obtener ID del producto para el enlace
  const idRaw = producto.id || producto.ID || producto.Id || producto.codigo || producto.Codigo || producto.CODIGO || producto['Código'] || '';
  const productoId = encodeURIComponent(String(idRaw).trim().toUpperCase());
  const productUrl = `product.html?id=${productoId}`;

  return `
    <div class="product-card ${claseAgotado}" data-producto-index="${index}">
      <a href="${productUrl}" class="product-card-link" aria-label="Ver detalles de ${producto.Nombre || 'producto'}">
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
              onclick="event.preventDefault(); ${disponible ? `agregarAlCarritoGlobal(productosDestacadosGlobal[${index}]);` : ''}"
            >
              ${disponible ? 'Comprar' : 'Agotado'}
            </button>
          </div>
        </div>
      </a>
    </div>
  `;
}

/**
 * Agregar producto al carrito (compartida)
 */
function agregarAlCarritoGlobal(producto) {
  try {
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    // Inicializar cantidad si no existe
    if (!producto.cantidad) {
      producto.cantidad = 1;
    }
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
let todosLosProductosGlobal = []; // Almacenar todos los productos para filtrado
let categoriaFiltroHome = 'Todos'; // Categoría actual en el home
let autoScrollInterval = null; // Intervalo para auto-scroll
let isCarouselPaused = false; // Estado de pausa del carrusel

/**
 * Cargar productos desde la API con categorización
 */
async function cargarProductosConCategorias() {
  const URL_API = 'https://script.google.com/macros/s/AKfycbyfqYVWemnAfC2vbduT0x-VaIKh-D_hV7nOP9wCd1pouAvnepP05bhoj9GNBNMEs0sy/exec';
  
  try {
    const response = await fetch(URL_API);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    const productos = Array.isArray(data) ? data : [];
    
    // Clasificación automática por prefijo
    productos.forEach((p) => {
      const idRaw = p.id || p.ID || p.Id || p.codigo || p.Codigo || p.CODIGO || p['Código'] || '';
      const id = String(idRaw).trim().toUpperCase();
      
      if (id && id.startsWith('AF')) {
        p.categoria = 'Arreglos Fúnebres';
      } else if (id && id.startsWith('B')) {
        p.categoria = 'Ramos';
      } else if (id && id.startsWith('S')) {
        p.categoria = 'Arreglos Especiales';
      } else if (id && id.startsWith('J')) {
        p.categoria = 'Arreglos en Floreros';
      } else {
        p.categoria = 'Sin categoría';
      }
    });
    
    // Guardar productos en localStorage para caché rápido
    try {
      localStorage.setItem('catalogo_productos', JSON.stringify(productos));
    } catch (error) {
      console.warn('No se pudo guardar productos en localStorage:', error);
    }
    
    return productos;
  } catch (error) {
    console.error('Error al cargar productos:', error);
    return [];
  }
}

/**
 * Cargar y renderizar productos destacados
 */
async function cargarProductosDestacados(categoria = 'Todos') {
  const featuredTrack = document.querySelector('.featured-carousel-track');
  if (!featuredTrack) return;

  try {
    // Si no tenemos productos cargados, cargarlos
    if (todosLosProductosGlobal.length === 0) {
      todosLosProductosGlobal = await cargarProductosConCategorias();
    }
    
    if (todosLosProductosGlobal.length === 0) {
      featuredTrack.innerHTML = '<p class="mensaje-vacio">No hay productos disponibles</p>';
      return;
    }

    // Filtrar productos por categoría
    let productosFiltrados = todosLosProductosGlobal;
    if (categoria !== 'Todos') {
      productosFiltrados = todosLosProductosGlobal.filter(producto => {
        const categoriaProducto = (producto.categoria || '').toLowerCase().trim();
        const categoriaFiltroLower = categoria.toLowerCase().trim();
        return categoriaProducto === categoriaFiltroLower;
      });
    }
    
    if (productosFiltrados.length === 0) {
      featuredTrack.innerHTML = '<p class="mensaje-vacio">No hay productos en esta categoría</p>';
      carruselIndex = 0;
      return;
    }

    // Actualizar productos globales para el carrusel
    productosDestacadosGlobal = productosFiltrados;
    categoriaFiltroHome = categoria;
    
    // Limpiar y renderizar productos
    featuredTrack.innerHTML = productosDestacadosGlobal.map((producto, index) => 
      crearTarjetaProductoHTML(producto, index)
    ).join('');

    // Los botones de compra tienen onclick inline para prevenir la navegación

    // Reinicializar carrusel
    carruselIndex = 0;
    featuredTrack.style.transform = 'translateX(0px)';
    inicializarCarruselDestacados();

  } catch (error) {
    console.error('Error al cargar productos destacados:', error);
    featuredTrack.innerHTML = '<p class="mensaje-vacio">Error al cargar productos</p>';
  }
}

/**
 * Filtrar productos destacados por categoría (Home)
 */
function filtrarProductosDestacados(categoria) {
  categoriaFiltroHome = categoria;
  
  // Actualizar botones activos
  document.querySelectorAll('.collection-filters .filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === categoria) {
      btn.classList.add('active');
    }
  });
  
  // Recargar productos con el filtro
  cargarProductosDestacados(categoria);
}

/**
 * Inicializar filtros del home
 */
function inicializarFiltrosHome() {
  const filterButtons = document.querySelectorAll('.collection-filters .filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const categoria = this.dataset.filter;
      filtrarProductosDestacados(categoria);
    });
  });
}

/**
 * Avanzar carrusel al siguiente
 */
function avanzarCarrusel() {
  const featuredTrack = document.querySelector('.featured-carousel-track');
  if (!featuredTrack || productosDestacadosGlobal.length === 0) return;

  const firstCard = featuredTrack.querySelector('.product-card');
  if (!firstCard) return;

  const rect = firstCard.getBoundingClientRect();
  const cardWidth = rect.width;
  const gap = 30;
  const scrollDistance = cardWidth + gap;

  carruselIndex++;
  
  // Si hay pocos productos, hacer scroll circular
  const maxIndex = Math.max(0, productosDestacadosGlobal.length - 3);
  if (carruselIndex > maxIndex) {
    carruselIndex = 0;
  }
  
  const translateX = -(carruselIndex * scrollDistance);
  featuredTrack.style.transform = `translateX(${translateX}px)`;
}

/**
 * Iniciar auto-scroll del carrusel
 */
function iniciarAutoScroll() {
  // Limpiar intervalo anterior si existe
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
  }
  
  // Solo iniciar si no está pausado
  if (!isCarouselPaused) {
    autoScrollInterval = setInterval(avanzarCarrusel, 3000);
  }
}

/**
 * Pausar auto-scroll del carrusel
 */
function pausarAutoScroll() {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
  isCarouselPaused = true;
}

/**
 * Reanudar auto-scroll del carrusel
 */
function reanudarAutoScroll() {
  isCarouselPaused = false;
  iniciarAutoScroll();
}

/**
 * Inicializar carrusel de productos destacados (infinito)
 */
function inicializarCarruselDestacados() {
  const featuredTrack = document.querySelector('.featured-carousel-track');
  const prevBtn = document.querySelector('.featured-carousel-wrapper .carousel-btn.prev-btn');
  const nextBtn = document.querySelector('.featured-carousel-wrapper .carousel-btn.next-btn');

  if (!featuredTrack || !prevBtn || !nextBtn) return;

  // Remover listeners anteriores si existen
  const newPrevBtn = prevBtn.cloneNode(true);
  const newNextBtn = nextBtn.cloneNode(true);
  prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
  nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

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

  function retrocederCarrusel() {
    if (productosDestacadosGlobal.length === 0) return;
    
    carruselIndex--;
    
    // Si estamos al inicio, ir al final (infinito)
    const maxIndex = Math.max(0, productosDestacadosGlobal.length - 3);
    if (carruselIndex < 0) {
      carruselIndex = maxIndex;
    }
    
    const scrollDistance = getScrollDistance();
    const translateX = -(carruselIndex * scrollDistance);
    featuredTrack.style.transform = `translateX(${translateX}px)`;
  }

  // Limpiar auto-scroll anterior
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }
  isCarouselPaused = false;

  newNextBtn.addEventListener('click', function() {
    pausarAutoScroll();
    avanzarCarrusel();
    setTimeout(function() {
      isCarouselPaused = false;
      iniciarAutoScroll();
    }, 5000);
  });

  newPrevBtn.addEventListener('click', function() {
    pausarAutoScroll();
    retrocederCarrusel();
    setTimeout(function() {
      isCarouselPaused = false;
      iniciarAutoScroll();
    }, 5000);
  });

  const featuredWrapper = document.querySelector('.featured-carousel-wrapper');
  
  // Pausar auto-scroll en hover (desktop)
  if (featuredWrapper) {
    featuredWrapper.addEventListener('mouseenter', function() {
      pausarAutoScroll();
    });
    featuredWrapper.addEventListener('mouseleave', function() {
      isCarouselPaused = false;
      iniciarAutoScroll();
    });
  }

  // Pausar auto-scroll en touch (móvil)
  if (featuredTrack) {
    featuredTrack.addEventListener('touchstart', function() {
      pausarAutoScroll();
    });
    featuredTrack.addEventListener('touchend', function() {
      setTimeout(function() {
        isCarouselPaused = false;
        iniciarAutoScroll();
      }, 5000);
    });
  }

  // Inicializar posición
  featuredTrack.style.transform = 'translateX(0px)';
  carruselIndex = 0;

  // Iniciar auto-scroll
  iniciarAutoScroll();
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

