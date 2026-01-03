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
