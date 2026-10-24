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