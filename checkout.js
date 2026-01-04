/**
 * CHECKOUT - AMORE MÍO
 * Lógica para el proceso de checkout y envío a Google Sheets
 */

// URL de Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwFe4eBWz0TVTb0bT4be2IReWs1_KtdPUkpDYycUL2E_Amj0i803jF1ViaT2yea7KBoTw/exec';

// Variables globales para el mapa
let map;
let marker;
let locationConfirmed = false;

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
    locationConfirmed = false;
    actualizarBotonUbicacion();
  });
  
  // Agregar control de búsqueda (Geocoder)
  const geocoder = L.Control.Geocoder.nominatim();
  L.Control.geocoder({
    geocoder: geocoder,
    defaultMarkGeocode: false
  }).on('markgeocode', function(e) {
    const latlng = e.geocode.center;
    map.setView(latlng, 16);
    marker.setLatLng(latlng);
    document.getElementById('gps-coords').value = `${latlng.lat}, ${latlng.lng}`;
    locationConfirmed = false;
    actualizarBotonUbicacion();
  }).addTo(map);
  
  // Inicializar input oculto
  const latlng = marker.getLatLng();
  document.getElementById('gps-coords').value = `${latlng.lat}, ${latlng.lng}`;
}

/**
 * Actualizar estado del botón de ubicación
 */
function actualizarBotonUbicacion() {
  const btn = document.getElementById('confirm-location-btn');
  if (locationConfirmed) {
    btn.textContent = 'Ubicación Confirmada ✓';
    btn.classList.add('confirmed');
  } else {
    btn.textContent = 'Confirmar Ubicación Marcada';
    btn.classList.remove('confirmed');
  }
}

/**
 * Confirmar ubicación
 */
function confirmarUbicacion() {
  locationConfirmed = true;
  actualizarBotonUbicacion();
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
  
  // Event listener para botón de confirmar ubicación
  const confirmLocationBtn = document.getElementById('confirm-location-btn');
  if (confirmLocationBtn) {
    confirmLocationBtn.addEventListener('click', confirmarUbicacion);
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
  const textoOriginal = boton.textContent;
  boton.textContent = 'Procesando...';
  boton.disabled = true;
  
  try {
    // Recopilar datos del formulario
    const datosFormulario = {
      nombre: document.getElementById('nombre-apellido').value,
      celular: document.getElementById('celular').value,
      entrega: document.getElementById('fecha-hora-entrega').value,
      ciudad: document.getElementById('ciudad').value,
      direccion: document.getElementById('direccion-referencia').value,
      gps: document.getElementById('gps-coords').value || '',
      mensaje: document.getElementById('mensaje-tarjeta').value || ''
    };
    
    // Obtener carrito y total
    const carrito = cargarCarrito();
    const total = calcularTotal(carrito);
    
    // Preparar datos para enviar con las claves exactas requeridas
    const datosEnvio = {
      nombre: datosFormulario.nombre,
      celular: datosFormulario.celular,
      entrega: datosFormulario.entrega,
      ciudad: datosFormulario.ciudad,
      direccion: datosFormulario.direccion,
      gps: datosFormulario.gps,
      mensaje: datosFormulario.mensaje,
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
    
    // Esperar 2 segundos antes de redirigir
    setTimeout(() => {
      const totalNumero = total.toFixed(2);
      const urlPayPal = `https://www.paypal.me/amoremioflorist/${totalNumero}`;
      window.location.href = urlPayPal;
    }, 2000);
    
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    // Aún así redirigir a PayPal después de 2 segundos
    const carrito = cargarCarrito();
    const total = calcularTotal(carrito);
    const totalNumero = total.toFixed(2);
    
    setTimeout(() => {
      const urlPayPal = `https://www.paypal.me/amoremioflorist/${totalNumero}`;
      window.location.href = urlPayPal;
    }, 2000);
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
