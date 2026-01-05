/**
 * PRODUCT DETAIL PAGE - AMORE MÍO
 * Lógica para cargar y mostrar detalles de un producto individual
 */

// URL de la API de Google Apps Script
const URL_API = 'https://script.google.com/macros/s/AKfycbyfqYVWemnAfC2vbduT0x-VaIKh-D_hV7nOP9wCd1pouAvnepP05bhoj9GNBNMEs0sy/exec';

// Variables globales
let productoActual = null;
let cantidadActual = 1;

/**
 * Obtener ID del producto desde la URL
 */
function obtenerIdProductoDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/**
 * Formatear precio a formato monetario
 */
function formatearPrecio(precio) {
  if (!precio) return '$0.00';
  
  const numPrecio = typeof precio === 'string' ? parseFloat(precio) : precio;
  
  if (isNaN(numPrecio)) return '$0.00';
  
  return `$${numPrecio.toFixed(2)}`;
}

/**
 * Obtener ID normalizado del producto
 */
function obtenerIdProducto(producto) {
  return String(producto.id || producto.ID || producto.Id || producto.codigo || producto.Codigo || producto.CODIGO || producto['Código'] || '').trim().toUpperCase();
}

/**
 * Cargar producto desde la API
 */
async function cargarProducto() {
  const loader = document.getElementById('loader');
  const productSection = document.getElementById('productDetailSection');
  const errorSection = document.getElementById('productErrorSection');
  const productId = obtenerIdProductoDesdeURL();

  if (!productId) {
    mostrarError();
    return;
  }

  try {
    loader.style.display = 'flex';
    productSection.style.display = 'none';
    errorSection.style.display = 'none';

    const response = await fetch(URL_API);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    const productos = Array.isArray(data) ? data : [];
    
    // Buscar el producto por ID
    const producto = productos.find(p => {
      const id = obtenerIdProducto(p);
      return id === productId.toUpperCase();
    });

    if (!producto) {
      mostrarError();
      return;
    }

    // Enriquecer producto con datos extendidos
    productoActual = enriquecerProducto(producto);
    
    // Mostrar producto
    mostrarProducto(productoActual);
    loader.style.display = 'none';
    productSection.style.display = 'block';

  } catch (error) {
    console.error('Error al cargar producto:', error);
    mostrarError();
  }
}

/**
 * Mostrar producto en la página
 */
function mostrarProducto(producto) {
  // Imagen
  const productImage = document.getElementById('productDetailImage');
  const productBadge = document.getElementById('productBadge');
  productImage.src = producto.Imagen || 'https://via.placeholder.com/600x600?text=Imagen+No+Disponible';
  productImage.alt = producto.Nombre || 'Producto';
  
  // Badge
  if (producto.Etiqueta && producto.Etiqueta.trim() !== '') {
    productBadge.textContent = producto.Etiqueta;
    productBadge.style.display = 'block';
  } else {
    productBadge.style.display = 'none';
  }

  // Nombre
  document.getElementById('productDetailName').textContent = producto.Nombre || 'Sin nombre';

  // Precio
  const precio = formatearPrecio(producto.Precio);
  document.getElementById('productDetailPrice').textContent = precio;

  // Descripción completa
  document.getElementById('productFullDescription').textContent = producto.fullDescription || 'Descripción no disponible.';

  // Includes (lista de componentes)
  const includesList = document.getElementById('productIncludes');
  includesList.innerHTML = '';
  if (producto.includes && Array.isArray(producto.includes) && producto.includes.length > 0) {
    producto.includes.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      includesList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'Información no disponible';
    includesList.appendChild(li);
  }

  // Ideal For (ocasiones)
  const idealForList = document.getElementById('productIdealFor');
  idealForList.innerHTML = '';
  if (producto.idealFor && Array.isArray(producto.idealFor) && producto.idealFor.length > 0) {
    producto.idealFor.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      idealForList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'Ocasiones especiales';
    idealForList.appendChild(li);
  }

  // Por qué elegir
  const whyChooseList = document.getElementById('productWhyChoose');
  if (whyChooseList) {
    whyChooseList.innerHTML = '';
    if (producto.whyChoose && Array.isArray(producto.whyChoose) && producto.whyChoose.length > 0) {
      producto.whyChoose.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        whyChooseList.appendChild(li);
      });
    } else {
      const defaultWhyChoose = generarWhyChoose ? generarWhyChoose(producto) : [
        'Diseño exclusivo y elegante.',
        'Flores frescas y de alta calidad.',
        'Entrega a domicilio inmediata y confiable.',
        'Opción para personalizar con mensaje.'
      ];
      defaultWhyChoose.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        whyChooseList.appendChild(li);
      });
    }
  }

  // Simbolismo
  document.getElementById('productSymbolism').textContent = producto.symbolism || 'Las flores son un lenguaje universal del corazón.';

  // Disponibilidad
  const disponible = producto.Disponible !== false;
  const availabilityMessage = document.getElementById('productAvailability');
  const buyButton = document.getElementById('buyNowButton');
  
  if (!disponible) {
    availabilityMessage.textContent = 'Este producto no está disponible en este momento.';
    availabilityMessage.style.display = 'block';
    availabilityMessage.className = 'product-availability-message unavailable';
    buyButton.disabled = true;
    buyButton.classList.add('disabled');
  } else {
    availabilityMessage.style.display = 'none';
    buyButton.disabled = false;
    buyButton.classList.remove('disabled');
  }

  // Actualizar título de la página
  document.title = `${producto.Nombre || 'Producto'} - Amore Mío`;
}

/**
 * Mostrar error
 */
function mostrarError() {
  const loader = document.getElementById('loader');
  const productSection = document.getElementById('productDetailSection');
  const errorSection = document.getElementById('productErrorSection');
  
  loader.style.display = 'none';
  productSection.style.display = 'none';
  errorSection.style.display = 'block';
}

/**
 * Aumentar cantidad
 */
function aumentarCantidad() {
  if (cantidadActual < 99) {
    cantidadActual++;
    document.getElementById('productQuantity').value = cantidadActual;
  }
}

/**
 * Disminuir cantidad
 */
function disminuirCantidad() {
  if (cantidadActual > 1) {
    cantidadActual--;
    document.getElementById('productQuantity').value = cantidadActual;
  }
}

/**
 * Actualizar cantidad desde input
 */
function actualizarCantidad() {
  const input = document.getElementById('productQuantity');
  let value = parseInt(input.value) || 1;
  
  if (value < 1) value = 1;
  if (value > 99) value = 99;
  
  cantidadActual = value;
  input.value = cantidadActual;
}

/**
 * Comprar producto (WhatsApp)
 */
function comprarProducto() {
  if (!productoActual) return;

  const productoId = obtenerIdProducto(productoActual);
  const nombre = productoActual.Nombre || 'Producto';
  const precio = formatearPrecio(productoActual.Precio);
  
  // Crear mensaje para WhatsApp
  const mensaje = `Hola, me interesa comprar:\n\n` +
    `*${nombre}*\n` +
    `Cantidad: ${cantidadActual}\n` +
    `Precio unitario: ${precio}\n` +
    `Total: ${formatearPrecio((parseFloat(productoActual.Precio) || 0) * cantidadActual)}\n\n` +
    `ID del producto: ${productoId}`;
  
  const whatsappURL = `https://wa.me/593986681447?text=${encodeURIComponent(mensaje)}`;
  
  window.open(whatsappURL, '_blank');
}

/**
 * Inicializar eventos
 */
function inicializarEventos() {
  // Botones de cantidad
  document.getElementById('increaseQuantity').addEventListener('click', aumentarCantidad);
  document.getElementById('decreaseQuantity').addEventListener('click', disminuirCantidad);
  
  // Input de cantidad
  const quantityInput = document.getElementById('productQuantity');
  quantityInput.addEventListener('change', actualizarCantidad);
  quantityInput.addEventListener('blur', actualizarCantidad);
  
  // Botón de compra
  document.getElementById('buyNowButton').addEventListener('click', comprarProducto);
}

/**
 * Inicializar cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
  // Esperar a que main.js inyecte los componentes
  setTimeout(function() {
    cargarProducto();
    inicializarEventos();
  }, 100);
});

