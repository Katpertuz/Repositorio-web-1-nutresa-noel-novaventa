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
  if (typeof API_CONFIG !== "undefined" && API_CONFIG.modo === "local") {
      const datos = await window.catalogoServicio.listarTodos();
      return (datos.marcas || []).map((m) => ({ id: m.id, nombre: String(m.nombre).normalize("NFC") }));
    }
    const respuesta = await fetch(API_CONFIG.baseUrl + "/marcas");
    if (!respuesta.ok) throw new Error("No se pudieron cargar las marcas");
    return await respuesta.json();
  };

// ===== G1-MAR · Marca · fin =====


// ===== G1-CAT · Categorías · inicio =====
// Autor: Daniel Acevedo Yepes
// Historia de Usuario 2.1 y 2.2: Listado y Registro de categorías

window.productoServicio = window.productoServicio || {};

productoServicio.listarCategorias = async function () {
  if (typeof API_CONFIG !== "undefined" && API_CONFIG.modo === "local") {
      const datos = await window.catalogoServicio.listarTodos();
      return datos.categorias || [];
    }
    const respuesta = await fetch(API_CONFIG.baseUrl + "/categorias");
    if (!respuesta.ok) throw new Error("No se pudieron cargar las categorías");
    return await respuesta.json();
  };

window.productoServicio.crearCategoria = async function (categoria) {
    if (typeof API_CONFIG !== "undefined" && API_CONFIG.modo === "local") {
      const datos = await window.catalogoServicio.listarTodos();
      const existe = (datos.categorias || []).some((c) => c.id === categoria.idCategoria || c.idCategoria === categoria.idCategoria);
      if (existe) throw new Error("El ID de la categoría ya existe.");
      const nueva = { id: categoria.idCategoria, nombre: categoria.nombreCategoria };
      datos.categorias.push(nueva);
      return nueva;
    }
    const respuesta = await fetch(API_CONFIG.baseUrl + "/categorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoria)
    });
    if (!respuesta.ok) throw new Error("No se pudo registrar la categoría.");
    return await respuesta.json();
  };
// ===== G1-CAT · Categorías · fin =====


// G1-BUS · HU 5.1 & HU 5.2 (Katherin Ortega) · Métodos de consulta de Productos
  window.productoServicio.listarProductos = async function () {
    if (typeof API_CONFIG !== "undefined" && API_CONFIG.modo === "local") {
      const datos = await window.catalogoServicio.listarTodos();
      return datos.productos || window.productosMockData || [];
    }
    const respuesta = await fetch(API_CONFIG.baseUrl + "/productos");
    if (!respuesta.ok) throw new Error("No se pudieron cargar los productos");
    return await respuesta.json();
  };

  // Alias de compatibilidad para evitar fallos si un compañero llama a listarTodos()
  window.productoServicio.listarTodos = window.productoServicio.listarProductos;

  // G7-CUP / G1-PRE · Servicio de Presentaciones Comerciales
  window.presentacionServicio = window.presentacionServicio || {};

  window.presentacionServicio.listarPresentaciones = async function () {
    if (typeof API_CONFIG !== "undefined" && API_CONFIG.modo === "local") {
      const datos = await window.catalogoServicio.listarTodos();
      return datos.presentaciones || [];
    }
    const respuesta = await fetch(API_CONFIG.baseUrl + "/presentaciones");
    if (!respuesta.ok) throw new Error("No se pudieron cargar las presentaciones.");
    return await respuesta.json();
  };

  window.catalogoServicio.crearPresentacion = async function (nuevaPresentacion) {
    if (typeof API_CONFIG !== "undefined" && API_CONFIG.modo === "local") {
      const datos = await window.catalogoServicio.listarTodos();
      datos.presentaciones = datos.presentaciones || [];
      datos.presentaciones.push(nuevaPresentacion);
      return Promise.resolve(nuevaPresentacion);
    }
    const respuesta = await fetch(API_CONFIG.baseUrl + "/presentaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaPresentacion)
    });
    if (!respuesta.ok) throw new Error("No se pudo crear la presentación.");
    return await respuesta.json();
  };