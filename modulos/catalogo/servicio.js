(function () {
  window.catalogoServicio = {
    async listarTodos() {
      return Promise.resolve(
        window.catalogoMockData || {
          categorias: [],
          marcas: [],
          productos: [],
          presentaciones: [],
          imagenesProducto: []
        }
      );
    }
  };
})();

// ===== G1-MAR · Marca · inicio =====
window.productoServicio = window.productoServicio || {};

productoServicio.listarMarcas = async function () {
  if (API_CONFIG.modo === 'local') {
    const datos = await catalogoServicio.listarTodos();
    return datos.marcas.map(function (marca) {
      return { id: marca.id, nombre: marca.nombre.normalize('NFC') };
    });
  }

  const respuesta = await fetch(API_CONFIG.baseUrl + '/marcas');
  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las marcas');
  }
  return await respuesta.json();
};
// ===== G1-MAR · Marca · fin =====

// ===== G7-CUP · Cupón · inicio - Duvan Tique =====
window.catalogoServicio = window.catalogoServicio || {};

window.catalogoServicio.crearPresentacion = async function (nuevaPresentacion) {
  if (API_CONFIG.modo === 'local') {
    const datos = await window.catalogoServicio.listarTodos();
    datos.presentaciones = datos.presentaciones || [];
    datos.presentaciones.push(nuevaPresentacion);
    return Promise.resolve(nuevaPresentacion);
  }

  const respuesta = await fetch(API_CONFIG.baseUrl + '/presentaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(nuevaPresentacion)
  });

  if (!respuesta.ok) {
    throw new Error('No se pudo crear la presentación comercial');
  }

// ===== G7-CUP · Cupón · inicio =====
window.presentacionServicio = window.presentacionServicio || {};

presentacionServicio.listarPresentaciones = async function () {
  if (API_CONFIG.modo === 'local') {
    const datos = await catalogoServicio.listarTodos();
    return datos.presentaciones;
  }

  const respuesta = await fetch(API_CONFIG.baseUrl + '/presentaciones');
  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las presentaciones comerciales');
  }
  return await respuesta.json();
};
// ===== G7-CUP · Cupón · fin =====
// ===== G1-CAT · Categorías · inicio =====
// Autor: Daniel Acevedo Yepes
// Historia de Usuario 2.1 y 2.2: Listado y Registro de categorías

window.productoServicio = window.productoServicio || {};

productoServicio.listarCategorias = async function () {
  if (API_CONFIG.modo === 'local') {
    const datos = await catalogoServicio.listarTodos();
    return datos.categorias;
  }

  const respuesta = await fetch(API_CONFIG.baseUrl + '/categorias');
  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las categorías');
  }
  return await respuesta.json();
};

productoServicio.crearCategoria = async function (categoria) {
  if (API_CONFIG.modo === 'local') {
    const datos = await catalogoServicio.listarTodos();
    
    // Validación estricta simulada (evitar IDs duplicados en el mock)
    const existe = datos.categorias.some(c => c.id === categoria.idCategoria || c.idCategoria === categoria.idCategoria);
    if (existe) throw new Error('El ID de la categoría ya existe.');
    
    // Formateamos el objeto para que coincida con lo que espera el listado (id y nombre)
    const nuevaCategoriaMock = {
        id: categoria.idCategoria,
        nombre: categoria.nombreCategoria
    };
    
    datos.categorias.push(nuevaCategoriaMock);
    return nuevaCategoriaMock;
  }

  const respuesta = await fetch(API_CONFIG.baseUrl + '/categorias', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(categoria)
  });
  
  if (!respuesta.ok) {
    throw new Error('No se pudo registrar la categoría en el servidor.');
  }
  
  return await respuesta.json();
};
// ===== G1-CAT · Categorías · fin =====



// ===== G1-BUS · HU 5.1: Motor de Búsqueda (Katherin Ortega) · inicio =====
window.productoServicio = window.productoServicio || {};

/**
 * Obtiene el listado completo de productos desde el mock local o la API REST
 * @returns {Promise<Array>} Promesa que resuelve al arreglo de productos
 */
productoServicio.listarProductos = async function () {
  if (typeof API_CONFIG !== 'undefined' && API_CONFIG.modo === 'local') {
    const datos = await catalogoServicio.listarTodos();
    return datos.productos || [];
  }

  const respuesta = await fetch(API_CONFIG.baseUrl + '/productos');
  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar los productos');
  }
  return await respuesta.json();
};
// ===== G1-BUS · HU 5.1: Motor de Búsqueda (Katherin Ortega) · fin =====

