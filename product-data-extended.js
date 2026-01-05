/**
 * PRODUCT DATA EXTENDED - AMORE MÍO
 * Datos enriquecidos para productos (fullDescription, includes, idealFor, symbolism)
 * Este archivo extiende los datos base de productos con información adicional
 */

/**
 * Obtener ID normalizado del producto
 */
function obtenerIdProducto(producto) {
  return String(producto.id || producto.ID || producto.Id || producto.codigo || producto.Codigo || producto.CODIGO || producto['Código'] || '').trim().toUpperCase();
}

/**
 * Obtener nombre del producto
 */
function obtenerNombreProducto(producto) {
  return producto.Nombre || producto.nombre || producto.NOMBRE || 'Producto';
}

/**
 * Obtener descripción corta del producto
 */
function obtenerDescripcionCorta(producto) {
  return producto.Descripcion || producto.descripcion || producto.DESCRIPCION || producto['Descripción'] || '';
}

/**
 * Generar descripción completa basada en categoría y datos del producto
 */
function generarFullDescription(producto, descripcionCorta) {
  const nombre = obtenerNombreProducto(producto);
  const categoria = producto.categoria || '';
  
  if (descripcionCorta) {
    // Expandir la descripción corta proporcionada
    return `${descripcionCorta} Cada detalle ha sido cuidadosamente seleccionado para crear una obra maestra floral que transmita tus emociones más profundas. Este ${nombre.toLowerCase()} representa la perfección en cada pétalo, diseñado para convertir momentos especiales en recuerdos inolvidables. Ideal para expresar sentimientos genuinos y crear conexiones emocionales duraderas.`;
  }
  
  // Si no hay descripción corta, generar una basada en la categoría
  if (categoria === 'Ramos') {
    return `${nombre} es un ramo elegante y sofisticado, creado con las flores más frescas y hermosas. Cada flor ha sido seleccionada por nuestros expertos floristas para garantizar máxima calidad y belleza. Perfecto para expresar tus sentimientos más profundos en cualquier ocasión especial.`;
  } else if (categoria === 'Arreglos Especiales') {
    return `${nombre} es un arreglo floral único y excepcional, diseñado con creatividad y pasión. Combina diferentes tipos de flores y elementos decorativos para crear una composición memorable que dejará una impresión duradera. Ideal para ocasiones que requieren algo verdaderamente especial.`;
  } else if (categoria === 'Arreglos en Floreros') {
    return `${nombre} es un elegante arreglo floral presentado en un hermoso florero. La combinación de flores frescas y el diseño del contenedor crean una pieza decorativa perfecta para el hogar u oficina. Un regalo ideal que perdura y embellece cualquier espacio.`;
  } else if (categoria === 'Arreglos Fúnebres') {
    return `${nombre} es un arreglo floral respetuoso y elegante, diseñado para honrar la memoria de un ser querido. Cada flor ha sido seleccionada con sensibilidad y cuidado, creando una ofrenda floral que expresa respeto, cariño y consuelo en momentos difíciles.`;
  }
  
  return `${nombre} es un producto floral único, creado con dedicación y amor. Cada elemento ha sido cuidadosamente seleccionado para ofrecerte la mejor calidad y belleza en cada detalle.`;
}

/**
 * Generar lista de componentes (includes) basada en categoría
 */
function generarIncludes(producto) {
  const categoria = producto.categoria || '';
  const nombre = obtenerNombreProducto(producto);
  
  // Componentes base comunes
  const includes = [];
  
  if (categoria === 'Ramos') {
    // Para ramos, variar el número de rosas/flores según el nombre
    if (nombre.toLowerCase().includes('12') || nombre.toLowerCase().includes('doce')) {
      includes.push('12 Rosas Premium');
    } else if (nombre.toLowerCase().includes('24') || nombre.toLowerCase().includes('veinticuatro')) {
      includes.push('24 Rosas Premium');
    } else if (nombre.toLowerCase().includes('6') || nombre.toLowerCase().includes('seis')) {
      includes.push('6 Rosas Premium');
    } else {
      includes.push('Rosas Premium Seleccionadas');
    }
    includes.push('Follaje Natural de Complemento');
    includes.push('Envoltura Elegante');
    includes.push('Tarjeta de Mensaje Personalizada');
  } else if (categoria === 'Arreglos Especiales') {
    includes.push('Flores Frescas Seleccionadas');
    includes.push('Diseño Artístico Único');
    includes.push('Base Decorativa');
    includes.push('Tarjeta de Mensaje');
    if (nombre.toLowerCase().includes('grande') || nombre.toLowerCase().includes('xl')) {
      includes.push('Elementos Decorativos Adicionales');
    }
  } else if (categoria === 'Arreglos en Floreros') {
    includes.push('Flores Frescas en Florero');
    includes.push('Florero de Alta Calidad');
    includes.push('Diseño Profesional');
    includes.push('Tarjeta de Mensaje');
  } else if (categoria === 'Arreglos Fúnebres') {
    includes.push('Corona Floral Respetuosa');
    includes.push('Flores Seleccionadas con Cuidado');
    includes.push('Base Sólida y Elegante');
    includes.push('Cinta de Condolencias');
  } else {
    includes.push('Flores Frescas');
    includes.push('Diseño Profesional');
    includes.push('Tarjeta de Mensaje');
  }
  
  return includes;
}

/**
 * Generar ocasiones ideales (idealFor) basada en categoría y nombre
 */
function generarIdealFor(producto) {
  const categoria = producto.categoria || '';
  const nombre = obtenerNombreProducto(producto).toLowerCase();
  const idealFor = [];
  
  // Ocasiones basadas en palabras clave del nombre
  if (nombre.includes('cumpleaños') || nombre.includes('birthday') || nombre.includes('feliz')) {
    idealFor.push('Cumpleaños');
  }
  if (nombre.includes('aniversario') || nombre.includes('anniversary') || nombre.includes('amor')) {
    idealFor.push('Aniversario');
  }
  if (nombre.includes('fúnebre') || nombre.includes('funeral') || nombre.includes('condolencias')) {
    idealFor.push('Condolencias');
  }
  if (nombre.includes('san valentin') || nombre.includes('valentine') || nombre.includes('amor')) {
    idealFor.push('San Valentín');
  }
  if (nombre.includes('graduación') || nombre.includes('graduation')) {
    idealFor.push('Graduación');
  }
  
  // Ocasiones basadas en categoría si no se encontraron keywords
  if (idealFor.length === 0) {
    if (categoria === 'Arreglos Fúnebres') {
      idealFor.push('Condolencias');
      idealFor.push('Homenajes');
    } else {
      idealFor.push('Aniversario');
      idealFor.push('Cumpleaños');
      idealFor.push('Declaración de Amor');
      idealFor.push('Reconciliación');
      if (categoria === 'Arreglos Especiales') {
        idealFor.push('Ocasiones Especiales');
        idealFor.push('Celebraciones Únicas');
      }
    }
  }
  
  // Agregar ocasiones generales si hay espacio
  if (idealFor.length < 3 && categoria !== 'Arreglos Fúnebres') {
    idealFor.push('Expresar Cariño');
    idealFor.push('Sorprender');
  }
  
  return idealFor;
}

/**
 * Generar simbolismo basado en categoría y nombre
 */
function generarSymbolism(producto) {
  const categoria = producto.categoria || '';
  const nombre = obtenerNombreProducto(producto).toLowerCase();
  
  if (categoria === 'Arreglos Fúnebres') {
    return 'Un símbolo de respeto, cariño y consuelo que honra la memoria de quienes han partido, transmitiendo paz y amor eterno.';
  }
  
  if (nombre.includes('rojo') || nombre.includes('red')) {
    return 'Las rosas rojas simbolizan el amor apasionado y el deseo, expresando sentimientos profundos y compromiso emocional.';
  }
  if (nombre.includes('rosa') || nombre.includes('pink')) {
    return 'Las rosas rosadas representan la gratitud, la admiración y el cariño tierno, perfectas para expresar aprecio y afecto sincero.';
  }
  if (nombre.includes('blanco') || nombre.includes('white')) {
    return 'Las flores blancas simbolizan la pureza, la inocencia y nuevos comienzos, ideales para expresar respeto y nuevos capítulos en la vida.';
  }
  if (nombre.includes('amarillo') || nombre.includes('yellow')) {
    return 'Las flores amarillas transmiten alegría, amistad y felicidad, perfectas para celebrar momentos de júbilo y amistad verdadera.';
  }
  
  // Simbolismo por defecto según categoría
  if (categoria === 'Ramos') {
    return 'Un ramo de flores frescas simboliza amor, cariño y aprecio, transmitiendo emociones genuinas que las palabras a veces no pueden expresar.';
  } else if (categoria === 'Arreglos Especiales') {
    return 'Este arreglo especial representa dedicación y cuidado, simbolizando momentos únicos e irrepetibles que se convierten en tesoros del corazón.';
  } else if (categoria === 'Arreglos en Floreros') {
    return 'Las flores en florero simbolizan belleza duradera y elegancia, creando una conexión entre naturaleza y decoración que embellece cualquier espacio.';
  }
  
  return 'Las flores son el lenguaje universal del corazón, capaces de expresar sentimientos que trascienden las palabras y crean conexiones emocionales profundas.';
}

/**
 * Enriquecer un producto con datos extendidos
 * @param {Object} producto - Producto base desde la API
 * @returns {Object} Producto enriquecido con datos adicionales
 */
function enriquecerProducto(producto) {
  const id = obtenerIdProducto(producto);
  const descripcionCorta = obtenerDescripcionCorta(producto);
  
  // Si el producto ya tiene datos extendidos, mantenerlos
  if (producto.fullDescription && producto.includes && producto.idealFor && producto.symbolism) {
    return producto;
  }
  
  // Generar datos extendidos
  const productoEnriquecido = {
    ...producto,
    fullDescription: producto.fullDescription || generarFullDescription(producto, descripcionCorta),
    includes: producto.includes || generarIncludes(producto),
    idealFor: producto.idealFor || generarIdealFor(producto),
    symbolism: producto.symbolism || generarSymbolism(producto)
  };
  
  return productoEnriquecido;
}

/**
 * Enriquecer array de productos
 * @param {Array} productos - Array de productos base
 * @returns {Array} Array de productos enriquecidos
 */
function enriquecerProductos(productos) {
  if (!Array.isArray(productos)) return [];
  return productos.map(producto => enriquecerProducto(producto));
}

