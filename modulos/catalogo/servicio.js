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

  return await respuesta.json();
};
// ===== G7-CUP · Cupón · fin =====
