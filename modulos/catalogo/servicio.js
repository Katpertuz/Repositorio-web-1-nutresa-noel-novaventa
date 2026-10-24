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
// Historia de Usuario 2.1: Visualización del listado de categorías

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
// ===== G1-CAT · Categorías · fin =====