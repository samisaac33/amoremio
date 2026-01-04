/**
 * CHECKOUT - AMORE MÍO
 * Lógica para el proceso de checkout y envío a Google Sheets
 */

// URL de Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7QhrNe97Dbf28spQ5945Iw7oYcf-CImn7gZvO1XvgLg9ZTzAcqtKniVjqjjzOhRM/exec';

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
 * Ocultar/mostrar campos de facturación según el tipo
 */
function actualizarCamposFacturacion() {
  const tipoFactura = document.getElementById('tipo-factura').value;
  const facturaIdGroup = document.getElementById('factura-id-group');
  const facturaNombreGroup = document.getElementById('factura-nombre-group');
  const facturaCiudadGroup = document.getElementById('factura-ciudad-group');
  const facturaId = document.getElementById('factura-id');
  const facturaNombre = document.getElementById('factura-nombre');
  const facturaCiudad = document.getElementById('factura-ciudad');
  
  if (tipoFactura === 'Consumidor Final') {
    // Ocultar campos
    facturaIdGroup.classList.add('hidden');
    facturaNombreGroup.classList.add('hidden');
    facturaCiudadGroup.classList.add('hidden');
    
    // Remover required
    facturaId.removeAttribute('required');
    facturaNombre.removeAttribute('required');
    facturaCiudad.removeAttribute('required');
    
    // Limpiar valores
    facturaId.value = '';
    facturaNombre.value = '';
    facturaCiudad.value = '';
  } else {
    // Mostrar campos
    facturaIdGroup.classList.remove('hidden');
    facturaNombreGroup.classList.remove('hidden');
    facturaCiudadGroup.classList.remove('hidden');
    
    // Agregar required
    facturaId.setAttribute('required', 'required');
    facturaNombre.setAttribute('required', 'required');
    facturaCiudad.setAttribute('required', 'required');
  }
}

/**
 * Aplicar regla de los $50
 */
function aplicarRegla50() {
  const carrito = cargarCarrito();
  const total = calcularTotal(carrito);
  const tipoFacturaSelect = document.getElementById('tipo-factura');
  const optionConsumidor = document.getElementById('option-consumidor');
  
  if (total > 50.00) {
    // Deshabilitar opción "Consumidor Final"
    if (optionConsumidor) {
      optionConsumidor.disabled = true;
    }
    
    // Si está seleccionado "Consumidor Final", cambiarlo a "Cédula"
    if (tipoFacturaSelect.value === 'Consumidor Final') {
      tipoFacturaSelect.value = 'Cédula';
      actualizarCamposFacturacion();
    }
  } else {
    // Habilitar opción "Consumidor Final"
    if (optionConsumidor) {
      optionConsumidor.disabled = false;
    }
  }
}

/**
 * Cargar total en la página y verificar carrito
 */
function inicializarCheckout() {
  const carrito = cargarCarrito();
  const total = calcularTotal(carrito);
  const totalElement = document.getElementById('checkout-total');
  
  if (totalElement) {
    totalElement.textContent = formatearPrecio(total);
  }
  
  // Si no hay productos, redirigir al inicio
  if (carrito.length === 0) {
    alert('Tu carrito está vacío. Serás redirigido al inicio.');
    window.location.href = 'index.html';
    return;
  }
  
  // Aplicar regla de los $50
  aplicarRegla50();
  
  // Actualizar campos de facturación según el tipo seleccionado
  actualizarCamposFacturacion();
  
  // Event listener para cambios en tipo de factura
  const tipoFacturaSelect = document.getElementById('tipo-factura');
  if (tipoFacturaSelect) {
    tipoFacturaSelect.addEventListener('change', actualizarCamposFacturacion);
  }
  
  // Event listener para el formulario
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', manejarEnvio);
  }
}

/**
 * Manejar el envío del formulario
 */
async function manejarEnvio(e) {
  e.preventDefault();
  
  // Validar que los campos obligatorios no estén vacíos
  const form = document.getElementById('checkout-form');
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Cambiar estado del botón
  const boton = document.getElementById('confirm-order-btn');
  boton.textContent = 'Procesando...';
  boton.disabled = true;
  
  try {
    // Recopilar datos del formulario
    const tipoFactura = document.getElementById('tipo-factura').value;
    const destinatario = document.getElementById('destinatario').value;
    const celular = document.getElementById('celular').value;
    const fechaEntrega = document.getElementById('fecha-entrega').value;
    const ciudadEntrega = document.getElementById('ciudad-entrega').value;
    const direccion = document.getElementById('direccion').value;
    const mensaje = document.getElementById('mensaje').value || '';
    const facturaEmail = document.getElementById('factura-email').value;
    
    // Datos de facturación
    let facturaId, facturaNombre;
    if (tipoFactura === 'Consumidor Final') {
      facturaId = 'N/A';
      facturaNombre = 'N/A';
    } else {
      facturaId = document.getElementById('factura-id').value;
      facturaNombre = document.getElementById('factura-nombre').value;
    }
    
    // Obtener carrito y total
    const carrito = cargarCarrito();
    const total = calcularTotal(carrito);
    
    // Preparar datos para enviar con las claves exactas requeridas
    const datosEnvio = {
      destinatario: destinatario,
      celular: celular,
      fecha_entrega: fechaEntrega,
      ciudad_entrega: ciudadEntrega,
      direccion: direccion,
      mensaje: mensaje,
      total: total,
      items: carrito,
      factura_tipo: tipoFactura,
      factura_id: facturaId,
      factura_nombre: facturaNombre
    };
    
    // Enviar a Google Sheets usando fetch
    const formData = new FormData();
    formData.append('data', JSON.stringify(datosEnvio));
    
    // Enviar con no-cors mode para evitar errores CORS
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    
    // Redirigir a PayPal después del envío
    const totalNumero = total.toFixed(2);
    const urlPayPal = `https://www.paypal.me/amoremioflorist/${totalNumero}`;
    window.location.href = urlPayPal;
    
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    // Aún así redirigir a PayPal
    const carrito = cargarCarrito();
    const total = calcularTotal(carrito);
    const totalNumero = total.toFixed(2);
    const urlPayPal = `https://www.paypal.me/amoremioflorist/${totalNumero}`;
    window.location.href = urlPayPal;
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
