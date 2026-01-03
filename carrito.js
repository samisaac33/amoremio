/**
 * CARRITO - AMORE MÍO
 * Lógica para mostrar y gestionar el carrito de compras
 */

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
 * Cargar carrito desde localStorage
 */
function cargarCarrito() {
  try {
    return JSON.parse(localStorage.getItem('carrito') || '[]');
  } catch {
    return [];
  }
}

/**
 * Eliminar producto del carrito
 */
function eliminarDelCarrito(index) {
  let carrito = cargarCarrito();
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderizarCarrito();
  
  // Actualizar contador en header
  if (typeof updateCarritoCount === 'function') {
    updateCarritoCount();
  }
}

/**
 * Calcular total
 */
function calcularTotal(carrito) {
  return carrito.reduce((total, producto) => {
    const precio = typeof producto.Precio === 'string' ? parseFloat(producto.Precio) : producto.Precio;
    return total + (isNaN(precio) ? 0 : precio);
  }, 0);
}

/**
 * Renderizar carrito
 */
function renderizarCarrito() {
  const carrito = cargarCarrito();
  const contenido = document.getElementById('carrito-contenido');
  
  if (carrito.length === 0) {
    contenido.innerHTML = `
      <div class="carrito-vacio">
        <p>Tu carrito está vacío</p>
        <a href="catalogo.html" class="btn btn-primary">Ver Catálogo</a>
      </div>
    `;
    return;
  }
  
  const total = calcularTotal(carrito);
  
  let html = `
    <div class="carrito-items">
      <table class="carrito-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Producto</th>
            <th>Precio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  carrito.forEach((producto, index) => {
    const precio = formatearPrecio(producto.Precio);
    html += `
      <tr>
        <td class="carrito-imagen">
          <img src="${producto.Imagen || 'https://via.placeholder.com/100x100'}" alt="${producto.Nombre}">
        </td>
        <td class="carrito-nombre">
          <h3>${producto.Nombre || 'Sin nombre'}</h3>
        </td>
        <td class="carrito-precio">${precio}</td>
        <td class="carrito-accion">
          <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
      
      <div class="carrito-total">
        <div class="total-info">
          <h2>Total: <span>${formatearPrecio(total)}</span></h2>
        </div>
        <button class="btn btn-primary btn-whatsapp" onclick="finalizarCompra()">
          <i class="fab fa-whatsapp"></i> Finalizar Compra por WhatsApp
        </button>
      </div>
    </div>
  `;
  
  contenido.innerHTML = html;
}

/**
 * Finalizar compra - Abrir WhatsApp
 */
function finalizarCompra() {
  const carrito = cargarCarrito();
  
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  let mensaje = 'Hola Amore Mío, quiero:\n\n';
  
  carrito.forEach((producto, index) => {
    const precio = formatearPrecio(producto.Precio);
    mensaje += `${index + 1}x ${producto.Nombre} (${precio})\n`;
  });
  
  const total = calcularTotal(carrito);
  mensaje += `\nTotal: ${formatearPrecio(total)}`;
  
  const url = `https://wa.me/593986681447?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

/**
 * Inicializar cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    renderizarCarrito();
  }, 100);
});

