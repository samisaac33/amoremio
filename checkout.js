/**
 * CHECKOUT - AMORE MÍO
 * Lógica para el proceso de checkout y envío a Google Sheets
 */

// URL de Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbpfvzFT4L86ww1dWbovO33cZFVDGk479aPnEQ7tCubo9lANBePKjWslBeVpfVkD71xg/exec';

// Variables globales para el mapa
let map;
let marker;

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
 * Inicializar mapa Leaflet
 */
function inicializarMapa() {
  // Crear mapa centrado en Portoviejo, Ecuador
  map = L.map('map').setView([-1.054, -80.454], 13);
  
  // Agregar capa de tiles (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // Agregar marcador draggable
  marker = L.marker([-1.054, -80.454], {
    draggable: true
  }).addTo(map);
  
  // Event listener para cuando se mueve el marcador
  marker.on('dragend', function(e) {
    const latlng = marker.getLatLng();
    document.getElementById('gps-coords').value = `${latlng.lat}, ${latlng.lng}`;
  });
  
  // Inicializar input oculto con coordenadas iniciales
  const latlng = marker.getLatLng();
  document.getElementById('gps-coords').value = `${latlng.lat}, ${latlng.lng}`;
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
  
  // Inicializar mapa
  inicializarMapa();
  
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
    const nombre = document.getElementById('nombre').value;
    const celular = document.getElementById('celular').value;
    const entrega = document.getElementById('entrega').value;
    const ciudad = document.getElementById('ciudad').value;
    const direccion = document.getElementById('direccion').value;
    const gps = document.getElementById('gps-coords').value || '';
    const mensaje = document.getElementById('mensaje').value || '';
    
    // Obtener carrito y total
    const carrito = cargarCarrito();
    const total = calcularTotal(carrito);
    
    // Preparar datos para enviar con las claves exactas requeridas
    const datosEnvio = {
      nombre: nombre,
      celular: celular,
      entrega: entrega,
      ciudad: ciudad,
      direccion: direccion,
      gps: gps,
      mensaje: mensaje,
      total: total,
      items: carrito
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
