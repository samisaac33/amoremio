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
 * Actualizar cantidad de un producto en el carrito
 */
function actualizarCantidad(index, nuevaCantidad) {
  let carrito = cargarCarrito();
  if (nuevaCantidad <= 0) {
    eliminarDelCarrito(index);
    return;
  }
  carrito[index].cantidad = nuevaCantidad;
  localStorage.setItem('carrito', JSON.stringify(carrito));
  renderizarCarrito();
  
  // Actualizar contador en header
  if (typeof updateCarritoCount === 'function') {
    updateCarritoCount();
  }
}

/**
 * Aumentar cantidad
 */
function aumentarCantidad(index) {
  let carrito = cargarCarrito();
  const cantidadActual = carrito[index].cantidad || 1;
  actualizarCantidad(index, cantidadActual + 1);
}

/**
 * Disminuir cantidad
 */
function disminuirCantidad(index) {
  let carrito = cargarCarrito();
  const cantidadActual = carrito[index].cantidad || 1;
  actualizarCantidad(index, cantidadActual - 1);
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
    const cantidad = producto.cantidad || 1;
    return total + (isNaN(precio) ? 0 : precio * cantidad);
  }, 0);
}

/**
 * Calcular subtotal de un producto
 */
function calcularSubtotal(producto) {
  const precio = typeof producto.Precio === 'string' ? parseFloat(producto.Precio) : producto.Precio;
  const cantidad = producto.cantidad || 1;
  return isNaN(precio) ? 0 : precio * cantidad;
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
  `;
  
  carrito.forEach((producto, index) => {
    const precioUnitario = formatearPrecio(producto.Precio);
    const cantidad = producto.cantidad || 1;
    const subtotal = calcularSubtotal(producto);
    const precioSubtotal = formatearPrecio(subtotal);
    
    html += `
      <div class="cart-item" data-index="${index}">
        <!-- Columna Izquierda: Imagen -->
        <div class="item-image">
          <img src="${producto.Imagen || 'https://via.placeholder.com/80x80'}" alt="${producto.Nombre || 'Producto'}" loading="lazy">
        </div>
        
        <!-- Columna Derecha: Información -->
        <div class="item-details">
          <!-- Fila Superior: Nombre -->
          <div class="item-name">${producto.Nombre || 'Sin nombre'}</div>
          
          <!-- Fila Inferior: Acciones -->
          <div class="item-actions">
            <span class="item-price-unit">${precioUnitario}</span>
            
            <div class="item-quantity">
              <button class="quantity-btn minus" onclick="disminuirCantidad(${index})" aria-label="Disminuir cantidad">−</button>
              <input type="number" 
                     class="quantity-input" 
                     value="${cantidad}" 
                     min="1" 
                     onchange="actualizarCantidad(${index}, parseInt(this.value))"
                     aria-label="Cantidad">
              <button class="quantity-btn plus" onclick="aumentarCantidad(${index})" aria-label="Aumentar cantidad">+</button>
            </div>
            
            <span class="item-price-total">${precioSubtotal}</span>
            
            <button class="item-delete" onclick="eliminarDelCarrito(${index})" aria-label="Eliminar producto">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
  
  html += `
      <div class="carrito-total">
        <div class="total-info">
          <h2>Total: <span>${formatearPrecio(total)}</span></h2>
        </div>
        
        <div id="payment-options" class="payment-options">
          <h3 class="payment-title">Selecciona tu método de pago</h3>
          <div class="payment-buttons">
            <button class="payment-btn payment-btn-whatsapp" onclick="finalizarCompraWhatsApp()">
              <i class="fab fa-whatsapp"></i>
              Ordenar por WhatsApp
            </button>
            <button class="payment-btn payment-btn-paypal" onclick="finalizarCompraPayPal()">
              <i class="fab fa-paypal"></i>
              Pagar con PayPal
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  contenido.innerHTML = html;
}

/**
 * Finalizar compra - Abrir WhatsApp
 */
function finalizarCompraWhatsApp() {
  const carrito = cargarCarrito();
  
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  let mensaje = 'Hola Amore Mío, deseo ordenar: ';
  
  const productosLista = carrito.map((producto, index) => {
    const precio = formatearPrecio(producto.Precio);
    const cantidad = producto.cantidad || 1;
    return `${cantidad}x ${producto.Nombre} (${precio} c/u)`;
  }).join(', ');
  
  const total = calcularTotal(carrito);
  mensaje += productosLista + `. Total a pagar: ${formatearPrecio(total)}`;
  
  const url = `https://wa.me/593986681447?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

/**
 * Finalizar compra - Redirigir a Checkout
 */
function finalizarCompraPayPal() {
  const carrito = cargarCarrito();
  
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  
  // Redirigir a checkout.html
  window.location.href = 'checkout.html';
}

/**
 * Inicializar cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    renderizarCarrito();
  }, 100);
});

