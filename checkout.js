/**
 * CHECKOUT - AMORE MÍO
 * Lógica para el proceso de checkout y validación de formularios
 */

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
 * Calcular total del carrito
 */
function calcularTotal(carrito) {
  return carrito.reduce((total, producto) => {
    const precio = typeof producto.Precio === 'string' ? parseFloat(producto.Precio) : producto.Precio;
    return total + (isNaN(precio) ? 0 : precio);
  }, 0);
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
 * Cargar total en la página
 */
function cargarTotal() {
  const carrito = cargarCarrito();
  const total = calcularTotal(carrito);
  const totalElement = document.getElementById('checkout-total');
  
  if (totalElement) {
    totalElement.textContent = formatearPrecio(total);
  }
  
  // Si no hay productos, redirigir al catálogo
  if (carrito.length === 0) {
    alert('Tu carrito está vacío. Serás redirigido al catálogo.');
    window.location.href = 'catalogo.html';
  }
}

/**
 * Copiar datos de facturación a envío
 */
function copiarDatosFacturacion() {
  const checkbox = document.getElementById('same-as-billing');
  const billingNombre = document.getElementById('billing-nombre');
  const billingTelefono = document.getElementById('billing-telefono');
  const billingDireccion = document.getElementById('billing-direccion');
  
  const shippingNombre = document.getElementById('shipping-nombre');
  const shippingTelefono = document.getElementById('shipping-telefono');
  const shippingDireccion = document.getElementById('shipping-direccion');
  
  if (checkbox && checkbox.checked) {
    if (billingNombre) shippingNombre.value = billingNombre.value;
    if (billingTelefono) shippingTelefono.value = billingTelefono.value;
    if (billingDireccion) shippingDireccion.value = billingDireccion.value;
  } else {
    shippingNombre.value = '';
    shippingTelefono.value = '';
    shippingDireccion.value = '';
  }
}

/**
 * Validar formularios
 */
function validarFormularios() {
  const billingForm = document.getElementById('billing-form');
  const shippingForm = document.getElementById('shipping-form');
  
  // Validar formulario de facturación
  if (!billingForm.checkValidity()) {
    billingForm.reportValidity();
    return false;
  }
  
  // Validar formulario de envío
  if (!shippingForm.checkValidity()) {
    shippingForm.reportValidity();
    return false;
  }
  
  return true;
}

/**
 * Proceder al pago
 */
function procederAlPago() {
  // Validar formularios
  if (!validarFormularios()) {
    return;
  }
  
  // Verificar que haya productos en el carrito
  const carrito = cargarCarrito();
  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    window.location.href = 'catalogo.html';
    return;
  }
  
  // Calcular total
  const total = calcularTotal(carrito);
  const totalNumero = total.toFixed(2);
  
  // Redirigir a PayPal
  const url = `https://www.paypal.me/amoremioflorist/${totalNumero}`;
  window.open(url, '_blank');
}

/**
 * Inicializar checkout
 */
function inicializarCheckout() {
  // Cargar total
  cargarTotal();
  
  // Event listener para checkbox "mismos datos"
  const checkbox = document.getElementById('same-as-billing');
  if (checkbox) {
    checkbox.addEventListener('change', copiarDatosFacturacion);
    
    // También copiar cuando cambien los campos de facturación
    const billingNombre = document.getElementById('billing-nombre');
    const billingTelefono = document.getElementById('billing-telefono');
    const billingDireccion = document.getElementById('billing-direccion');
    
    if (billingNombre) {
      billingNombre.addEventListener('input', function() {
        if (checkbox.checked) copiarDatosFacturacion();
      });
    }
    
    if (billingTelefono) {
      billingTelefono.addEventListener('input', function() {
        if (checkbox.checked) copiarDatosFacturacion();
      });
    }
    
    if (billingDireccion) {
      billingDireccion.addEventListener('input', function() {
        if (checkbox.checked) copiarDatosFacturacion();
      });
    }
  }
  
  // Event listener para botón de pago
  const paymentButton = document.getElementById('proceed-payment');
  if (paymentButton) {
    paymentButton.addEventListener('click', procederAlPago);
  }
}

/**
 * Inicializar cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    inicializarCheckout();
  }, 100);
});

