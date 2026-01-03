/**
 * CATÁLOGO - AMORE MÍO
 * Lógica para cargar y mostrar productos desde Google Apps Script
 */

// URL de la API de Google Apps Script
const URL_API = 'https://script.google.com/macros/s/AKfycbyfqYVWemnAfC2vbduT0x-VaIKh-D_hV7nOP9wCd1pouAvnepP05bhoj9GNBNMEs0sy/exec';

// Variables globales
let productos = [];
let categoriaFiltro = 'Todos';

/**
 * Cargar productos desde la API
 */
async function cargarProductos() {
  const loader = document.getElementById('loader');
  const galeria = document.getElementById('galeria-productos');

  try {
    loader.style.display = 'flex';
    galeria.innerHTML = '';

    const response = await fetch(URL_API);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    productos = Array.isArray(data) ? data : [];

    if (productos.length === 0) {
      galeria.innerHTML = '<p class="mensaje-vacio">No hay productos disponibles en este momento.</p>';
      loader.style.display = 'none';
      return;
    }

    // Renderizar productos
    renderizarProductos(productos);
    loader.style.display = 'none';

  } catch (error) {
    console.error('Error al cargar productos:', error);
    loader.style.display = 'none';
    galeria.innerHTML = `
      <p class="mensaje-error">
        No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.
      </p>
    `;
  }
}

/**
 * Renderizar productos en la galería
 * @param {Array} productosFiltrados - Array de productos a mostrar
 */
function renderizarProductos(productosFiltrados) {
  const galeria = document.getElementById('galeria-productos');

  if (productosFiltrados.length === 0) {
    galeria.innerHTML = '<p class="mensaje-vacio">No hay productos en esta categoría.</p>';
    return;
  }

  galeria.innerHTML = productosFiltrados.map(producto => crearTarjetaProducto(producto)).join('');
}

/**
 * Crear el HTML de una tarjeta de producto
 * @param {Object} producto - Objeto producto con sus propiedades
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaProducto(producto) {
  const disponible = producto.Disponible !== false; // Asumimos disponible si no se especifica
  const tieneEtiqueta = producto.Etiqueta && producto.Etiqueta.trim() !== '';
  const claseAgotado = !disponible ? 'agotado' : '';
  const precio = formatearPrecio(producto.Precio);
  
  // Mensaje para WhatsApp
  const mensajeWhatsApp = encodeURIComponent(
    `Hola Amore Mío, me interesa el arreglo: ${producto.Nombre}`
  );
  const urlWhatsApp = `https://wa.me/593986681447?text=${mensajeWhatsApp}`;

  return `
    <div class="product-card ${claseAgotado}" data-categoria="${producto.Categoria || ''}">
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
        ${producto.Descripcion ? `<p class="product-description">${producto.Descripcion}</p>` : ''}
        <div class="product-footer">
          <span class="product-price">${precio}</span>
          <a 
            href="${urlWhatsApp}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="product-btn ${!disponible ? 'disabled' : ''}"
            ${!disponible ? 'aria-disabled="true"' : ''}
          >
            ${disponible ? '💬 Consultar' : 'Agotado'}
          </a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Formatear precio a formato monetario
 * @param {string|number} precio - Precio a formatear
 * @returns {string} Precio formateado ($XX.00)
 */
function formatearPrecio(precio) {
  if (!precio) return '$0.00';
  
  const numPrecio = typeof precio === 'string' ? parseFloat(precio) : precio;
  
  if (isNaN(numPrecio)) return '$0.00';
  
  return `$${numPrecio.toFixed(2)}`;
}

/**
 * Filtrar productos por categoría
 * @param {string} categoria - Categoría a filtrar
 */
function filtrarPorCategoria(categoria) {
  categoriaFiltro = categoria;

  // Actualizar botones activos
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.categoria === categoria) {
      btn.classList.add('active');
    }
  });

  // Filtrar productos
  let productosFiltrados = productos;
  if (categoria !== 'Todos') {
    productosFiltrados = productos.filter(producto => 
      (producto.Categoria || '').toLowerCase() === categoria.toLowerCase()
    );
  }

  // Renderizar productos filtrados
  renderizarProductos(productosFiltrados);

  // Scroll suave a la galería
  const galeria = document.getElementById('galeria-productos');
  galeria.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Inicializar eventos de filtros
 */
function inicializarFiltros() {
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const categoria = this.dataset.categoria;
      filtrarPorCategoria(categoria);
    });
  });
}

/**
 * Inicializar cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
  // Esperar un momento para asegurar que main.js haya inyectado los componentes
  setTimeout(() => {
    inicializarFiltros();
    // Solo cargar productos si la URL_API no es el placeholder
    if (URL_API && URL_API !== 'TU_URL_DEL_SCRIPT_AQUI') {
      cargarProductos();
    } else {
      document.getElementById('loader').style.display = 'none';
      document.getElementById('galeria-productos').innerHTML = `
        <p class="mensaje-error">
          Por favor, configura la URL_API en el archivo catalogo.js
        </p>
      `;
    }
  }, 100);
});

