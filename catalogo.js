/**
 * CATÁLOGO - AMORE MÍO
 * Lógica para cargar y mostrar productos desde Google Apps Script
 */

// URL de la API de Google Apps Script
const URL_API = 'https://script.google.com/macros/s/AKfycbyfqYVWemnAfC2vbduT0x-VaIKh-D_hV7nOP9wCd1pouAvnepP05bhoj9GNBNMEs0sy/exec';

// Variables globales
let productos = [];
let categoriaFiltro = 'Todos';
let paginaActual = 1;
const PRODUCTOS_POR_PAGINA = 24; // 4 columnas × 6 filas

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

    // --- CLASIFICACIÓN AUTOMÁTICA POR PREFIJO ---
    productos.forEach((p) => {
        // Buscar el ID en diferentes posibles propiedades
        const idRaw = p.id || p.ID || p.Id || p.codigo || p.Codigo || p.CODIGO || p['Código'] || '';
        const id = String(idRaw).trim().toUpperCase();
        
        // Verificar 'AF' primero porque es prefijo de dos letras
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

    if (productos.length === 0) {
      galeria.innerHTML = '<p class="mensaje-vacio">No hay productos disponibles en este momento.</p>';
      loader.style.display = 'none';
      return;
    }

    // Inicializar filtro a "Todos" al cargar y asegurar que el botón esté activo
    categoriaFiltro = 'Todos';
    
    // Asegurar que el botón "Todos" esté activo
    document.querySelectorAll('.filtro-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.filter === 'Todos') {
        btn.classList.add('active');
      }
    });
    
    // Renderizar productos (todos inicialmente)
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

// Variable para guardar productos filtrados actuales
let productosFiltradosActuales = [];

/**
 * Renderizar productos en la galería
 * @param {Array} productosFiltrados - Array de productos a mostrar
 */
function renderizarProductos(productosFiltrados) {
  const galeria = document.getElementById('galeria-productos');
  productosFiltradosActuales = productosFiltrados; // Guardar referencia

  if (productosFiltrados.length === 0) {
    // Mensaje especial para la categoría "Complementos"
    if (categoriaFiltro === 'Complementos') {
      galeria.innerHTML = '<p class="mensaje-vacio">Próximamente agregaremos productos a esta categoría.</p>';
    } else {
      galeria.innerHTML = '<p class="mensaje-vacio">No hay productos en esta categoría.</p>';
    }
    // Limpiar paginación si no hay productos
    const contenedorPaginacion = document.getElementById('paginacion-container');
    if (contenedorPaginacion) {
      contenedorPaginacion.innerHTML = '';
    }
    return;
  }

  // Si el filtro es "Todos", aplicar paginación
  let productosParaMostrar = productosFiltrados;
  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
  
  if (categoriaFiltro === 'Todos') {
    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const fin = inicio + PRODUCTOS_POR_PAGINA;
    productosParaMostrar = productosFiltrados.slice(inicio, fin);
  } else {
    // Para otras categorías, mostrar todos los productos
    paginaActual = 1;
  }

  // Renderizar productos
  galeria.innerHTML = productosParaMostrar.map((producto, index) => {
    // Calcular el índice real en el array completo para mantener la referencia correcta
    const indiceReal = categoriaFiltro === 'Todos' 
      ? (paginaActual - 1) * PRODUCTOS_POR_PAGINA + index
      : index;
    return crearTarjetaProducto(producto, indiceReal);
  }).join('');
  
  // Agregar event listeners a los botones de compra
  document.querySelectorAll('.product-btn:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.product-card');
      const productoIndex = parseInt(card.dataset.productoIndex);
      const producto = productosFiltradosActuales[productoIndex];
      agregarAlCarrito(producto);
    });
  });

  // Renderizar controles de paginación solo para "Todos"
  if (categoriaFiltro === 'Todos' && productosFiltrados.length > PRODUCTOS_POR_PAGINA) {
    renderizarPaginacion(totalPaginas, productosFiltrados.length);
  } else {
    // Limpiar paginación si no es necesario
    const contenedorPaginacion = document.getElementById('paginacion-container');
    if (contenedorPaginacion) {
      contenedorPaginacion.innerHTML = '';
    }
  }
}

/**
 * Renderizar controles de paginación
 * @param {number} totalPaginas - Total de páginas
 * @param {number} totalProductos - Total de productos
 */
function renderizarPaginacion(totalPaginas, totalProductos) {
  let contenedorPaginacion = document.getElementById('paginacion-container');
  
  // Crear contenedor si no existe
  if (!contenedorPaginacion) {
    contenedorPaginacion = document.createElement('div');
    contenedorPaginacion.id = 'paginacion-container';
    const galeria = document.getElementById('galeria-productos');
    galeria.parentNode.insertBefore(contenedorPaginacion, galeria.nextSibling);
  }

  const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA + 1;
  const fin = Math.min(paginaActual * PRODUCTOS_POR_PAGINA, totalProductos);

  contenedorPaginacion.innerHTML = `
    <div class="paginacion-info">
      Mostrando ${inicio}-${fin} de ${totalProductos} productos
    </div>
    <div class="paginacion-controls">
      <button class="paginacion-btn ${paginaActual === 1 ? 'disabled' : ''}" 
              ${paginaActual === 1 ? 'disabled' : ''} 
              data-pagina="${paginaActual - 1}">
        <i class="fas fa-chevron-left"></i> Anterior
      </button>
      <div class="paginacion-numeros">
        ${generarNumerosPagina(totalPaginas)}
      </div>
      <button class="paginacion-btn ${paginaActual === totalPaginas ? 'disabled' : ''}" 
              ${paginaActual === totalPaginas ? 'disabled' : ''} 
              data-pagina="${paginaActual + 1}">
        Siguiente <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  `;

  // Agregar event listeners a los botones de paginación
  contenedorPaginacion.querySelectorAll('.paginacion-btn:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', function() {
      const nuevaPagina = parseInt(this.dataset.pagina);
      if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        cambiarPagina(nuevaPagina);
      }
    });
  });

  contenedorPaginacion.querySelectorAll('.paginacion-numero').forEach(btn => {
    btn.addEventListener('click', function() {
      const nuevaPagina = parseInt(this.dataset.pagina);
      cambiarPagina(nuevaPagina);
    });
  });
}

/**
 * Generar números de página para la paginación
 * @param {number} totalPaginas - Total de páginas
 * @returns {string} HTML con los números de página
 */
function generarNumerosPagina(totalPaginas) {
  let html = '';
  const maxPaginasVisibles = 7;
  
  if (totalPaginas <= maxPaginasVisibles) {
    // Mostrar todas las páginas
    for (let i = 1; i <= totalPaginas; i++) {
      html += `<button class="paginacion-numero ${i === paginaActual ? 'active' : ''}" data-pagina="${i}">${i}</button>`;
    }
  } else {
    // Mostrar páginas con elipsis
    if (paginaActual <= 4) {
      // Mostrar primeras páginas
      for (let i = 1; i <= 5; i++) {
        html += `<button class="paginacion-numero ${i === paginaActual ? 'active' : ''}" data-pagina="${i}">${i}</button>`;
      }
      html += `<span class="paginacion-ellipsis">...</span>`;
      html += `<button class="paginacion-numero" data-pagina="${totalPaginas}">${totalPaginas}</button>`;
    } else if (paginaActual >= totalPaginas - 3) {
      // Mostrar últimas páginas
      html += `<button class="paginacion-numero" data-pagina="1">1</button>`;
      html += `<span class="paginacion-ellipsis">...</span>`;
      for (let i = totalPaginas - 4; i <= totalPaginas; i++) {
        html += `<button class="paginacion-numero ${i === paginaActual ? 'active' : ''}" data-pagina="${i}">${i}</button>`;
      }
    } else {
      // Mostrar páginas del medio
      html += `<button class="paginacion-numero" data-pagina="1">1</button>`;
      html += `<span class="paginacion-ellipsis">...</span>`;
      for (let i = paginaActual - 1; i <= paginaActual + 1; i++) {
        html += `<button class="paginacion-numero ${i === paginaActual ? 'active' : ''}" data-pagina="${i}">${i}</button>`;
      }
      html += `<span class="paginacion-ellipsis">...</span>`;
      html += `<button class="paginacion-numero" data-pagina="${totalPaginas}">${totalPaginas}</button>`;
    }
  }
  
  return html;
}

/**
 * Cambiar de página
 * @param {number} nuevaPagina - Número de página a mostrar
 */
function cambiarPagina(nuevaPagina) {
  paginaActual = nuevaPagina;
  
  // Volver a renderizar los productos con la nueva página
  let productosFiltrados = productos;
  if (categoriaFiltro !== 'Todos') {
    productosFiltrados = productos.filter(producto => {
      const categoriaProducto = (producto.categoria || '').toLowerCase().trim();
      const categoriaFiltroLower = categoriaFiltro.toLowerCase().trim();
      return categoriaProducto === categoriaFiltroLower;
    });
  }
  
  renderizarProductos(productosFiltrados);
  
  // Scroll suave a la galería
  const galeria = document.getElementById('galeria-productos');
  galeria.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Agregar producto al carrito
 * @param {Object} producto - Producto a agregar
 */
function agregarAlCarrito(producto) {
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

/**
 * Crear el HTML de una tarjeta de producto
 * @param {Object} producto - Objeto producto con sus propiedades
 * @returns {string} HTML de la tarjeta
 */
function crearTarjetaProducto(producto, index) {
  const disponible = producto.Disponible !== false; // Asumimos disponible si no se especifica
  const tieneEtiqueta = producto.Etiqueta && producto.Etiqueta.trim() !== '';
  const claseAgotado = !disponible ? 'agotado' : '';
  const precio = formatearPrecio(producto.Precio);

  return `
    <div class="product-card ${claseAgotado}" data-categoria="${producto.categoria || ''}" data-producto-index="${index}">
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
            aria-label="${disponible ? `Comprar ${producto.Nombre || 'producto'}` : 'Producto agotado'}"
          >
            ${disponible ? 'Comprar' : 'Agotado'}
          </button>
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
  paginaActual = 1; // Resetear a la primera página al cambiar de categoría

  // Actualizar botones activos
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === categoria) {
      btn.classList.add('active');
    }
  });

  // Filtrar productos
  let productosFiltrados = productos;
  if (categoria !== 'Todos') {
    productosFiltrados = productos.filter(producto => {
      const categoriaProducto = (producto.categoria || '').toLowerCase().trim();
      const categoriaFiltroLower = categoria.toLowerCase().trim();
      return categoriaProducto === categoriaFiltroLower;
    });
  }

  // Renderizar productos filtrados (pasar array completo para mantener índices)
  renderizarProductos(productosFiltrados);

  // Scroll suave a la galería
  const galeria = document.getElementById('galeria-productos');
  galeria.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Inicializar eventos de filtros
 */
function inicializarFiltros() {
  // Asegurar que "Todos" esté activo inicialmente
  document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.filter === 'Todos') {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', function() {
      const categoria = this.dataset.filter;
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

