// ===== Módulo Catálogo Sazón - Controlador Principal =====

// 1. Carga inicial de la estructura base
(function () {
  "use strict";
  async function iniciarCatalogo() {
    const estado = document.getElementById("catalogo-estado");
    if (!estado) return;
    try {
      if (window.catalogoServicio && typeof window.catalogoServicio.listarTodos === "function") {
        await window.catalogoServicio.listarTodos();
      }
      estado.textContent = "Estructura base del módulo catálogo cargada correctamente.";
    } catch (error) {
      estado.setAttribute("role", "alert");
      estado.textContent = "No fue posible cargar la base del catálogo.";
      console.error(error);
    }
  }
  document.addEventListener("DOMContentLoaded", iniciarCatalogo);
})();

// ===== G1-MAR · Gestión de Marcas =====
(function () {
  "use strict";
  const TODAS = "todas";
  const contenedor = document.getElementById("catalogo-marcas");
  const estado = document.getElementById("catalogo-estado");
  const mensajeError = document.getElementById("catalogo-error");
  let marcaActiva = TODAS;

  if (!contenedor) return;

  function crearItem(texto, valor) {
    const item = document.createElement("li");
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "catalogo-marca-btn";
    boton.dataset.marca = valor;
    boton.textContent = String(texto).normalize("NFC");
    boton.setAttribute("aria-pressed", valor === marcaActiva ? "true" : "false");
    if (valor === marcaActiva) boton.classList.add("catalogo-marca-btn--activa");
    item.appendChild(boton);
    return item;
  }

  function renderizarMarcas(marcas) {
    const lista = document.createElement("ul");
    lista.className = "catalogo-marcas-lista";
    lista.appendChild(crearItem("Todas las marcas", TODAS));
    marcas.forEach((m) => lista.appendChild(crearItem(m.nombre, String(m.id))));
    contenedor.replaceChildren(lista);
  }

  function seleccionarMarca(boton) {
    marcaActiva = boton.dataset.marca;
    contenedor.querySelectorAll(".catalogo-marca-btn").forEach((b) => {
      const activo = b === boton;
      b.classList.toggle("catalogo-marca-btn--activa", activo);
      b.setAttribute("aria-pressed", activo ? "true" : "false");
    });
    if (estado) estado.textContent = "Mostrando: " + boton.textContent;

    // Evento personalizado para comunicar el filtro a HU 5.2
    document.dispatchEvent(
      new CustomEvent("catalogo:marca-seleccionada", {
        detail: { idMarca: marcaActiva === TODAS ? null : Number(marcaActiva) }
      })
    );
  }

  contenedor.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".catalogo-marca-btn");
    if (boton) seleccionarMarca(boton);
  });

  async function iniciarMarcas() {
    try {
      if (window.productoServicio && typeof window.productoServicio.listarMarcas === "function") {
        const marcas = await window.productoServicio.listarMarcas();
        renderizarMarcas(marcas);
      }
    } catch (error) {
      console.error("Error en marcas:", error);
      if (mensajeError) {
        mensajeError.textContent = "No pudimos cargar las marcas.";
        mensajeError.hidden = false;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarMarcas);
})();

// ===== G7-CUP / G1-PRE · Presentaciones Comerciales =====
(function () {
  "use strict";
  const tbody = document.getElementById("tabla-presentaciones-body");

  async function iniciarPresentaciones() {
    if (!tbody) return;
    try {
      if (window.presentacionServicio && typeof window.presentacionServicio.listarPresentaciones === "function") {
        const presentaciones = await window.presentacionServicio.listarPresentaciones();
        tbody.innerHTML = "";
        presentaciones.forEach((item) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>G1-PRE-${String(item.id || 1).padStart(3, "0")}</td>
            <td>${item.nombre || "Presentación Nutresa"}</td>
            <td>${item.contenidoNeto || item.pesoNeto || "N/A"}</td>
            <td>${item.unidadMedida || "g"}</td>
            <td>Empaque Estándar</td>
            <td>${item.descripcion || "Sin descripción"}</td>
            <td>$${Number(item.precio || 0).toLocaleString("es-CO")}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    } catch (error) {
      console.error("Error al cargar las presentaciones:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarPresentaciones);
})();

// ===== G1-CAT · Maestro de Categorías =====
(function () {
  "use strict";
  async function renderizarCategorias() {
    const contenedor = document.getElementById("catalogo-categorias-contenedor");
    if (!contenedor) return;

    try {
      if (window.productoServicio && typeof window.productoServicio.listarCategorias === "function") {
        const categorias = await window.productoServicio.listarCategorias();
        contenedor.innerHTML = "";

        if (!categorias || categorias.length === 0) {
          contenedor.innerHTML = '<p role="alert">No hay categorías disponibles.</p>';
          return;
        }

        categorias.forEach((cat) => {
          const article = document.createElement("article");
          article.className = "catalogo-categoria-card";
          article.innerHTML = `<h3>${String(cat.nombre || cat.nombreCategoria).normalize("NFC")}</h3>`;
          contenedor.appendChild(article);
        });
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error);
      contenedor.innerHTML = '<p role="alert">Error al cargar las categorías.</p>';
    }
  }

  document.addEventListener("DOMContentLoaded", renderizarCategorias);
})();

// ===== G1-BUS · Katherin Ortega (HU 5.1: Buscador & HU 5.2: Filtros Combinados y Vitrina) · inicio =====
(function () {
  "use strict";

  let productosGlobales = [];
  let filtroMarcaActivo = null;
  let terminoBusquedaActivo = "";

  // 1. Normalización de cadenas de texto (HU 5.1)
  function normalizarTexto(cadena) {
    if (!cadena) return "";
    return cadena
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  // 2. Algoritmo de Filtrado Combinado (HU 5.1 + HU 5.2)
  function aplicarFiltrosCombinados() {
    return productosGlobales.filter((prod) => {
      // Coincidencia por texto libre (HU 5.1)
      const nombre = normalizarTexto(prod.nombreProducto || prod.nombre);
      const descripcion = normalizarTexto(prod.descripcion || "");
      const coincideTexto =
        !terminoBusquedaActivo ||
        nombre.includes(terminoBusquedaActivo) ||
        descripcion.includes(terminoBusquedaActivo);

      // Coincidencia por filtro de Marca (HU 5.2)
      const coincideMarca =
        !filtroMarcaActivo || Number(prod.idMarca) === Number(filtroMarcaActivo);

      return coincideTexto && coincideMarca;
    });
  }

  // 3. Renderizado Semántico de la Vitrina de Productos
  function renderizarVitrina(productos) {
    const contenedor =
      document.querySelector("#catalogo-productos-contenedor") ||
      document.querySelector("#catalogo-vitrina-contenedor");

    if (!contenedor) return;
    contenedor.replaceChildren();

    if (!productos || productos.length === 0) {
      const mensajeVacio = document.createElement("div");
      mensajeVacio.className = "catalogo-sin-resultados";
      mensajeVacio.setAttribute("role", "alert");
      mensajeVacio.textContent = "No se encontraron productos que coincidan con los criterios seleccionados.";
      contenedor.appendChild(mensajeVacio);
      return;
    }

    const fragmento = document.createDocumentFragment();

    productos.forEach((prod) => {
      const tarjeta = document.createElement("article");
      tarjeta.className = "catalogo-producto-tarjeta";

      const nombre = prod.nombreProducto || prod.nombre || "Producto Nutresa";
      const desc = prod.descripcion || "Descripción no disponible.";
      const imagen = prod.urlImagen || prod.imagen || "https://picsum.photos/200";
      const precio = prod.precio ? `$${Number(prod.precio).toLocaleString("es-CO")}` : "";

      tarjeta.innerHTML = `
        <figure style="margin:0;">
          <img src="${imagen}" alt="${nombre}" style="width:100%; height:140px; object-fit:cover; border-radius:6px;" loading="lazy" />
        </figure>
        <div class="catalogo-producto-info" style="padding: 0.75rem 0 0 0;">
          <h3 class="catalogo-producto-titulo">${nombre}</h3>
          <p class="catalogo-producto-descripcion">${desc}</p>
          ${precio ? `<span class="catalogo-producto-precio">${precio}</span>` : ""}
        </div>
      `;

      fragmento.appendChild(tarjeta);
    });

    contenedor.appendChild(fragmento);
  }

  // 4. Escuchadores de Eventos (HU 5.1 Buscador & HU 5.2 Filtros de Marca)
  function inicializarModuloBuscadorYVitrina() {
    const formBusqueda = document.querySelector("#catalogo-form-busqueda");
    const inputBusqueda = document.querySelector("#catalogo-input-busqueda");

    if (formBusqueda) {
      formBusqueda.addEventListener("submit", (e) => e.preventDefault());
    }

    if (inputBusqueda) {
      inputBusqueda.addEventListener("input", (e) => {
        terminoBusquedaActivo = normalizarTexto(e.target.value);
        const filtrados = aplicarFiltrosCombinados();
        renderizarVitrina(filtrados);
      });
    }

    // Escuchar selección de Marca enviada desde HU 1.1 (G1-MAR)
    document.addEventListener("catalogo:marca-seleccionada", (e) => {
      filtroMarcaActivo = e.detail ? e.detail.idMarca : null;
      const filtrados = aplicarFiltrosCombinados();
      renderizarVitrina(filtrados);
    });
  }

  // 5. Carga Inicial de Datos desde el Servicio de Productos
  async function cargarModuloBusqueda() {
    try {
      if (window.productoServicio && typeof window.productoServicio.listarProductos === "function") {
        productosGlobales = await window.productoServicio.listarProductos();
        renderizarVitrina(productosGlobales);
        inicializarModuloBuscadorYVitrina();
      }
    } catch (error) {
      console.error("Error al cargar la vitrina/buscador:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", cargarModuloBusqueda);
})();
// ===== G1-BUS · Katherin Ortega (HU 5.1 & HU 5.2) · fin =====