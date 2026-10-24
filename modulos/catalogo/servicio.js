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
