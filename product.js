/**
 * PRODUCT DETAIL PAGE - AMORE MÍO
 * Lógica para cargar y mostrar detalles de un producto individual
 */

// URL de la API de Google Apps Script
const URL_API = 'https://script.google.com/macros/s/AKfycbyfqYVWemnAfC2vbduT0x-VaIKh-D_hV7nOP9wCd1pouAvnepP05bhoj9GNBNMEs0sy/exec';

// Variables globales
let productoActual = null;

/**
 * Obtener ID del producto desde la URL
 */
function obtenerIdProductoDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return null;
  // Decodificar el ID (por si viene codificado)
  const idDecodificado = decodeURIComponent(id);
  // Normalización extrema: String, trim, pero mantener el formato original aquí
  // La normalización completa (toLowerCase) se hace en la comparación
  return String(idDecodificado).trim();
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
 * Obtener ID normalizado del producto (búsqueda robusta)
 */
function obtenerIdProducto(producto) {
  // Intentar múltiples propiedades posibles
  const idRaw = producto.id || 
                producto.ID || 
                producto.Id || 
                producto.idProducto ||
                producto.IDProducto ||
                producto.IdProducto ||
                producto.codigo || 
                producto.Codigo || 
                producto.CODIGO || 
                producto['Código'] ||
                producto.code ||
                producto.Code ||
                producto.CODE ||
                producto['Código Producto'] ||
                producto['CódigoProducto'] ||
                '';
  
  // Normalización extrema: String, trim, toLowerCase
  return String(idRaw).trim().toLowerCase();
}

/**
 * Obtener productos desde localStorage (caché) o desde la API
 * @returns {Promise<Array>} Array de productos
 */
async function fetchProductsFromSheet() {
  // PRIORIDAD 1: Intentar leer desde localStorage (caché instantáneo)
  try {
    const cachedData = localStorage.getItem('catalogo_productos');
    if (cachedData) {
      const productos = JSON.parse(cachedData);
      if (Array.isArray(productos) && productos.length > 0) {
        console.log('Productos cargados desde caché (localStorage):', productos.length);
        return productos;
      }
    }
  } catch (error) {
    console.warn('Error al leer caché de localStorage:', error);
  }

  // PRIORIDAD 2: Si no hay caché, hacer fetch a la API
  console.log('Cargando productos desde la API...');
  const response = await fetch(URL_API);
  
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const data = await response.json();
  const productos = Array.isArray(data) ? data : [];
  
  // Guardar en localStorage para próximas cargas
  try {
    localStorage.setItem('catalogo_productos', JSON.stringify(productos));
  } catch (error) {
    console.warn('No se pudo guardar productos en localStorage:', error);
  }
  
  return productos;
}

/**
 * Cargar producto (priorizando caché local)
 */
async function cargarProducto() {
  const loader = document.getElementById('loader');
  const productSection = document.getElementById('productDetailSection');
  const errorSection = document.getElementById('productErrorSection');
  
  // Paso 1: Obtener ID de la URL
  const productId = obtenerIdProductoDesdeURL();

  if (!productId) {
    console.log('No se encontró ID en la URL');
    mostrarError();
    return;
  }

  console.log('ID buscado:', productId);

  // PRIORIDAD 1: Intentar cargar desde localStorage (instantáneo, sin loader)
  try {
    const cachedData = localStorage.getItem('catalogo_productos');
    if (cachedData) {
      const productos = JSON.parse(cachedData);
      if (Array.isArray(productos) && productos.length > 0) {
        // Ocultar loader inmediatamente si existe
        if (loader) loader.style.display = 'none';
        if (errorSection) errorSection.style.display = 'none';
        
        // Buscar producto en caché
        const idBuscado = String(productId).trim().toLowerCase();
        const producto = productos.find(p => {
          const idProducto = obtenerIdProducto(p);
          return idProducto === idBuscado;
        });
        
        if (producto) {
          console.log('✅ Producto encontrado en caché (carga instantánea)');
          
          // Enriquecer producto con datos extendidos
          productoActual = enriquecerProducto(producto);
          
          // Mostrar producto inmediatamente
          mostrarProducto(productoActual);
          
          // Mostrar sección del producto
          if (productSection) productSection.style.display = 'block';
          
          // Inicializar eventos
          if (!eventosInicializados) {
            inicializarEventos();
            eventosInicializados = true;
          }
          
          return; // Salir aquí, no hacer fetch
        }
      }
    }
  } catch (error) {
    console.warn('Error al leer caché:', error);
  }

  // PRIORIDAD 2: Si no hay caché o no se encontró el producto, mostrar loader y hacer fetch
  try {
    // Mostrar loader solo si no encontramos en caché
    if (loader) loader.style.display = 'flex';
    if (productSection) productSection.style.display = 'none';
    if (errorSection) errorSection.style.display = 'none';

    // Cargar productos desde la API (o caché si fetchProductsFromSheet lo maneja)
    const productos = await fetchProductsFromSheet();
    
    console.log('Productos disponibles:', productos.length);
    
    if (productos.length === 0) {
      console.log('No se encontraron productos');
      mostrarError();
      return;
    }

    // Paso 3: Buscar el producto después de que los datos estén disponibles
    // Normalización extrema del ID de búsqueda: String, trim, toLowerCase
    const idBuscado = String(productId).trim().toLowerCase();
    
    console.log('ID buscado (URL):', idBuscado);
    console.log('Primeros 3 productos en memoria:', productos.slice(0, 3).map(p => ({
      nombre: p.Nombre || p.nombre || 'Sin nombre',
      idPropiedades: {
        id: p.id,
        ID: p.ID,
        Id: p.Id,
        codigo: p.codigo,
        Codigo: p.Codigo,
        CODIGO: p.CODIGO
      },
      idNormalizado: obtenerIdProducto(p)
    })));
    
    // Búsqueda 'a prueba de balas': comparar IDs normalizados (String, trim, toLowerCase)
    const producto = productos.find(p => {
      const idProducto = obtenerIdProducto(p);
      const coincide = idProducto === idBuscado;
      
      // Log detallado para los primeros 3 productos
      if (productos.indexOf(p) < 3) {
        console.log(`Comparando: "${idProducto}" === "${idBuscado}" ? ${coincide}`);
      }
      
      return coincide;
    });

    if (!producto) {
      console.error('❌ Producto NO encontrado');
      console.log('ID buscado (normalizado):', idBuscado);
      console.log('Todos los IDs disponibles (normalizados):', productos.map(p => obtenerIdProducto(p)));
      console.log('Muestra de productos con sus propiedades:', productos.slice(0, 5).map(p => ({
        nombre: p.Nombre || p.nombre || 'Sin nombre',
        propiedadesId: Object.keys(p).filter(k => 
          k.toLowerCase().includes('id') || 
          k.toLowerCase().includes('codigo') || 
          k.toLowerCase().includes('code')
        ).reduce((acc, k) => {
          acc[k] = p[k];
          return acc;
        }, {}),
        idNormalizado: obtenerIdProducto(p)
      })));
      mostrarError();
      return;
    }

    console.log('Producto encontrado:', producto.Nombre || 'Sin nombre');

    // Enriquecer producto con datos extendidos
    productoActual = enriquecerProducto(producto);
    
    // Mostrar producto
    mostrarProducto(productoActual);
    
    // Ocultar loader y mostrar sección
    if (loader) loader.style.display = 'none';
    if (productSection) productSection.style.display = 'block';
    
    // Inicializar eventos después de cargar el producto
    inicializarEventos();

  } catch (error) {
    console.error('Error al cargar producto:', error);
    console.error('Stack trace:', error.stack);
    mostrarError();
  }
}

/**
 * Mostrar producto en la página
 */
function mostrarProducto(producto) {
  if (!producto) {
    console.error('mostrarProducto: producto es null o undefined');
    return;
  }

  // Imagen
  const productImage = document.getElementById('productDetailImage');
  if (productImage) {
    productImage.src = producto.Imagen || 'https://via.placeholder.com/600x600?text=Imagen+No+Disponible';
    productImage.alt = producto.Nombre ? `Arreglo floral ${producto.Nombre} - Amore Mío` : 'Arreglo floral de Amore Mío';
  } else {
    console.error('No se encontró el elemento productDetailImage');
  }

  // Nombre
  const productName = document.getElementById('productDetailName');
  if (productName) {
    productName.textContent = producto.Nombre || 'Sin nombre';
  } else {
    console.error('No se encontró el elemento productDetailName');
  }

  // Precio
  const precio = formatearPrecio(producto.Precio);
  const productPrice = document.getElementById('productDetailPrice');
  if (productPrice) {
    productPrice.textContent = precio;
  } else {
    console.error('No se encontró el elemento productDetailPrice');
  }

  // Descripción completa
  const productDescription = document.getElementById('productFullDescription');
  if (productDescription) {
    productDescription.textContent = producto.fullDescription || 'Descripción no disponible.';
  } else {
    console.error('No se encontró el elemento productFullDescription');
  }

  // Includes (lista de componentes)
  const includesList = document.getElementById('productIncludes');
  if (includesList) {
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
  } else {
    console.error('No se encontró el elemento productIncludes');
  }

  // Ideal For (ocasiones)
  const idealForList = document.getElementById('productIdealFor');
  if (idealForList) {
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
  } else {
    console.error('No se encontró el elemento productIdealFor');
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
  } else {
    console.error('No se encontró el elemento productWhyChoose');
  }

  // Simbolismo
  const productSymbolism = document.getElementById('productSymbolism');
  if (productSymbolism) {
    productSymbolism.textContent = producto.symbolism || 'Las flores son un lenguaje universal del corazón.';
  } else {
    console.error('No se encontró el elemento productSymbolism');
  }

  // Disponibilidad
  const disponible = producto.Disponible !== false;
  const availabilityMessage = document.getElementById('productAvailability');
  const buyButton = document.getElementById('buyNowButton');
  
  if (availabilityMessage) {
    if (!disponible) {
      availabilityMessage.textContent = 'Este producto no está disponible en este momento.';
      availabilityMessage.style.display = 'block';
      availabilityMessage.className = 'product-availability-message unavailable';
    } else {
      availabilityMessage.style.display = 'none';
    }
  } else {
    console.error('No se encontró el elemento productAvailability');
  }
  
  if (buyButton) {
    if (!disponible) {
      buyButton.disabled = true;
      buyButton.classList.add('disabled');
    } else {
      buyButton.disabled = false;
      buyButton.classList.remove('disabled');
    }
  } else {
    console.error('No se encontró el elemento buyNowButton');
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
  
  if (loader) loader.style.display = 'none';
  if (productSection) productSection.style.display = 'none';
  if (errorSection) errorSection.style.display = 'block';
}

/**
 * Comprar producto (Agregar al carrito y redirigir)
 */
function comprarProducto() {
  if (!productoActual) return;

  try {
    // Obtener carrito actual de localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    
    // Inicializar cantidad si no existe
    if (!productoActual.cantidad) {
      productoActual.cantidad = 1;
    }
    
    // Agregar producto al carrito
    carrito.push(productoActual);
    
    // Guardar carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Redirigir a la página del carrito
    window.location.href = 'carrito.html';
    
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('Error al agregar el producto al carrito. Por favor, intenta de nuevo.');
  }
}

/**
 * Inicializar eventos (solo una vez)
 */
let eventosInicializados = false;

function inicializarEventos() {
  // Evitar inicializar eventos múltiples veces
  if (eventosInicializados) return;
  
  const buyButton = document.getElementById('buyNowButton');
  
  if (buyButton) {
    buyButton.addEventListener('click', comprarProducto);
  }
  
  // Inicializar posición del botón fijo en móvil
  inicializarBotonFijoMovil();
  
  eventosInicializados = true;
}

/**
 * Inicializar comportamiento del botón fijo en móvil
 * El botón se mantiene fijo en bottom: 0, pero cuando el footer aparece,
 * se ajusta para posicionarse justo encima del footer
 */
function inicializarBotonFijoMovil() {
  // Solo aplicar en móvil
  if (window.innerWidth > 768) return;
  
  const actionsWrapper = document.querySelector('.product-actions-wrapper');
  if (!actionsWrapper) return;
  
  const footer = document.querySelector('.footer');
  if (!footer) return;
  
  function ajustarPosicionBoton() {
    // Solo aplicar en móvil
    if (window.innerWidth > 768) {
      actionsWrapper.style.bottom = '';
      return;
    }
    
    const windowHeight = window.innerHeight;
    
    // Obtener posición del footer relativa al viewport
    const footerRect = footer.getBoundingClientRect();
    const footerTop = footerRect.top; // Distancia desde el top del viewport
    
    // Altura del botón
    const buttonHeight = actionsWrapper.offsetHeight || 80;
    
    // Si el footer está visible en la ventana (su parte superior está dentro del viewport)
    // y está cerca del bottom (menos de la altura del botón + un margen)
    if (footerTop < windowHeight && footerTop > 0) {
      // Calcular la distancia desde el bottom de la ventana hasta la parte superior del footer
      const distanciaDesdeBottom = windowHeight - footerTop;
      
      // Si hay espacio suficiente para el botón, posicionarlo justo encima del footer
      if (distanciaDesdeBottom >= buttonHeight) {
        actionsWrapper.style.bottom = `${distanciaDesdeBottom}px`;
      } else {
        // Si no hay espacio suficiente, mantener el botón en bottom: 0
        actionsWrapper.style.bottom = '0';
      }
    } else {
      // El footer no está visible o está más arriba, el botón se mantiene en bottom: 0
      actionsWrapper.style.bottom = '0';
    }
  }
  
  // Ajustar posición al cargar
  setTimeout(ajustarPosicionBoton, 100);
  
  // Ajustar posición al hacer scroll
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        ajustarPosicionBoton();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Ajustar posición al redimensionar la ventana
  window.addEventListener('resize', function() {
    ajustarPosicionBoton();
  });
}

/**
 * Inicializar cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
  // Esperar a que main.js inyecte los componentes
  setTimeout(function() {
    cargarProducto();
  }, 100);
});

