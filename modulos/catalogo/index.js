(function () {
  async function iniciarCatalogo() {
    var estado = document.getElementById("catalogo-estado");
    if (!estado) {
      return;
    }
    try {
      await window.catalogoServicio.listarTodos();
      estado.textContent = "Estructura base del módulo catálogo cargada.";
    } catch (error) {
      estado.setAttribute("role", "alert");
      estado.textContent = "No fue posible cargar la base del catálogo.";
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", iniciarCatalogo);
})();

// ===== G1-MAR · Marca · inicio =====
(function () {
  const TODAS = 'todas';
  const contenedor = document.getElementById('catalogo-marcas');
  const estado = document.getElementById('catalogo-estado');
  const mensajeError = document.getElementById('catalogo-error');
  let marcaActiva = TODAS;

  function crearItem(texto, valor) {
    const item = document.createElement('li');
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'catalogo-marca-btn';
    boton.dataset.marca = valor;
    boton.textContent = texto.normalize('NFC');
    boton.setAttribute('aria-pressed', valor === marcaActiva ? 'true' : 'false');
    if (valor === marcaActiva) {
      boton.classList.add('catalogo-marca-btn--activa');
    }
    item.appendChild(boton);
    return item;
  }

  function renderizarMarcas(marcas) {
    const lista = document.createElement('ul');
    lista.className = 'catalogo-marcas-lista';
    lista.appendChild(crearItem('Todas las marcas', TODAS));
    marcas.forEach(function (marca) {
      lista.appendChild(crearItem(marca.nombre, String(marca.id)));
    });
    contenedor.replaceChildren(lista);
  }

  function seleccionarMarca(boton) {
    marcaActiva = boton.dataset.marca;
    contenedor.querySelectorAll('.catalogo-marca-btn').forEach(function (b) {
      const activo = b === boton;
      b.classList.toggle('catalogo-marca-btn--activa', activo);
      b.setAttribute('aria-pressed', activo ? 'true' : 'false');
    });
    estado.textContent = 'Mostrando: ' + boton.textContent;

    // Para que otras historias (tarjetas de productos) puedan filtrar
    document.dispatchEvent(new CustomEvent('catalogo:marca-seleccionada', {
      detail: { idMarca: marcaActiva === TODAS ? null : Number(marcaActiva) },
    }));
  }

  contenedor.addEventListener('click', function (evento) {
    const boton = evento.target.closest('.catalogo-marca-btn');
    if (boton) {
      seleccionarMarca(boton);
    }
  });

  async function iniciarMarcas() {
    try {
      const marcas = await productoServicio.listarMarcas();
      renderizarMarcas(marcas);
    } catch (error) {
      console.error(error);
      mensajeError.textContent = 'No pudimos cargar las marcas. Intenta de nuevo más tarde.';
      mensajeError.hidden = false;
    }
  }

  iniciarMarcas();
})();
// ===== G1-MAR · Marca · fin =====

// ===== G1-CAT · Categorías · inicio =====
// Autor: Daniel Acevedo Yepes
// Historia de Usuario 2.1 y 2.2: Listado y Registro de categorías
(function () {
  async function renderizarCategorias() {
    const contenedor = document.getElementById('catalogo-categorias-contenedor');
    
    if (!contenedor) return;
    
    try {
        const categorias = await productoServicio.listarCategorias();
        contenedor.innerHTML = '';

        if (!categorias || categorias.length === 0) {
            contenedor.innerHTML = '<p role="alert">No hay categorías disponibles.</p>';
            return;
        }

        categorias.forEach(function(categoria) {
            const article = document.createElement('article');
            article.className = 'catalogo-categoria-card';
            
            // Soporte estricto para caracteres especiales (tildes, eñes)
            const nombreSeguro = categoria.nombre.normalize('NFC');
            
            article.innerHTML = `<h3>${nombreSeguro}</h3>`;
            
            contenedor.appendChild(article);
        });

    } catch (error) {
        console.error('Error al cargar categorías:', error);
        contenedor.innerHTML = '<p role="alert">Ocurrió un error al cargar las categorías.</p>';
    }
  }

  function inicializarFormulario() {
      const formCategoria = document.getElementById('catalogo-form-categoria');
      const alertaCategoria = document.getElementById('catalogo-categoria-alerta');

      if (formCategoria) {
          formCategoria.addEventListener('submit', async function (evento) {
              evento.preventDefault();
              alertaCategoria.hidden = true;

              const formData = new FormData(formCategoria);
              const nuevaCategoria = {
                  idCategoria: Number(formData.get('idCategoria')),
                  nombreCategoria: formData.get('nombreCategoria')
              };

              try {
                  await productoServicio.crearCategoria(nuevaCategoria);
                  
                  alertaCategoria.textContent = 'Categoría registrada exitosamente.';
                  alertaCategoria.className = 'catalogo-alerta-exito';
                  alertaCategoria.hidden = false;
                  
                  formCategoria.reset();
                  renderizarCategorias(); // Refresca el listado inmediatamente
              } catch (error) {
                  console.error(error);
                  alertaCategoria.textContent = 'Fallo al registrar. Verifica los datos ingresados.';
                  alertaCategoria.className = 'catalogo-alerta-error';
                  alertaCategoria.hidden = false;
              }
          });
      }
  }

  document.addEventListener('DOMContentLoaded', () => {
      renderizarCategorias();
      inicializarFormulario();
  });
})();
// ===== G1-CAT · Categorías · fin =====


// ===== G1-BUS · HU 5.1: Motor de Búsqueda (Katherin Ortega) · inicio =====
(function () {
  "use strict";

  
  function normalizarTexto(cadena) {
    if (!cadena) return "";
    return cadena
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function filtrarProductos(productos, termino) {
    if (!termino) return productos;

    return productos.filter((producto) => {
      const nombre = normalizarTexto(producto.nombreProducto || producto.nombre);
      const descripcion = normalizarTexto(producto.descripcion || "");
      return nombre.includes(termino) || descripcion.includes(termino);
    });
  }

  
  function renderizarProductos(productos) {
    const contenedor = document.querySelector("#catalogo-productos-contenedor");
    if (!contenedor) return;

    
    contenedor.replaceChildren();

   
    if (!productos || productos.length === 0) {
      const mensajeVacio = document.createElement("p");
      mensajeVacio.className = "catalogo-sin-resultados";
      mensajeVacio.setAttribute("role", "status");
      mensajeVacio.textContent = "No se encontraron productos que coincidan con tu búsqueda.";
      contenedor.appendChild(mensajeVacio);
      return;
    }

    
    const fragmento = document.createDocumentFragment();

    productos.forEach((producto) => {
      const tarjeta = document.createElement("article");
      tarjeta.className = "catalogo-producto-tarjeta";

      const titulo = document.createElement("h3");
      titulo.className = "catalogo-producto-titulo";
      titulo.textContent = producto.nombreProducto || producto.nombre || "Producto sin nombre";

      const descripcion = document.createElement("p");
      descripcion.className = "catalogo-producto-descripcion";
      descripcion.textContent = producto.descripcion || "Sin descripción disponible.";

      tarjeta.appendChild(titulo);
      tarjeta.appendChild(descripcion);

      if (producto.precio) {
        const precio = document.createElement("span");
        precio.className = "catalogo-producto-precio";
        precio.textContent = `$${Number(producto.precio).toLocaleString("es-CO")}`;
        tarjeta.appendChild(precio);
      }

      fragmento.appendChild(tarjeta);
    });

    contenedor.appendChild(fragmento);
  }

 
  function inicializarBuscador(productos) {
    const formularioBusqueda = document.querySelector("#catalogo-form-busqueda");
    const inputBusqueda = document.querySelector("#catalogo-input-busqueda");

    
    renderizarProductos(productos);

    if (!formularioBusqueda || !inputBusqueda) return;

    formularioBusqueda.addEventListener("submit", (evento) => {
      evento.preventDefault();
    });

    
    inputBusqueda.addEventListener("input", (evento) => {
      const terminoBusqueda = normalizarTexto(evento.target.value);
      const resultados = filtrarProductos(productos, terminoBusqueda);

      
      renderizarProductos(resultados);

      
      document.dispatchEvent(
        new CustomEvent("catalogo:busqueda-realizada", {
          detail: { productosFiltrados: resultados, termino: terminoBusqueda },
        })
      );
    });
  }

  
  async function iniciarBuscador() {
    try {
      const productos = await productoServicio.listarProductos();
      inicializarBuscador(productos);
    } catch (error) {
      console.error("Error al cargar productos en el buscador:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarBuscador);
  } else {
    iniciarBuscador();
  }
})();
// ===== G1-BUS · HU 5.1: Motor de Búsqueda (Katherin Ortega) · fin =====

// ===== G1-BUS · HU 5.2: Filtros Combinados (Katherin Ortega) · inicio =====
(function () {
  "use strict";

  
  const filtrosActivos = {
    texto: "",
    idMarca: "",
    idCategoria: "",
    idPresentacion: ""
  };

  let productosGlobales = [];
  let presentacionesGlobales = [];
  let imagenesGlobales = [];

  
  function normalizarTexto(cadena) {
    if (!cadena) return "";
    return String(cadena)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  
  function aplicarFiltrosCombinados(productos) {
    return productos.filter((producto) => {
      const idProd = producto.id !== undefined ? producto.id : producto.idProducto;

      
      const termino = normalizarTexto(filtrosActivos.texto);
      const nombre = normalizarTexto(producto.nombre || producto.nombreProducto);
      const descripcion = normalizarTexto(producto.descripcion || "");
      const cumpleTexto = !termino || nombre.includes(termino) || descripcion.includes(termino);

      
      const cumpleMarca =
        !filtrosActivos.idMarca || String(producto.idMarca) === String(filtrosActivos.idMarca);

      
      const cumpleCategoria =
        !filtrosActivos.idCategoria || String(producto.idCategoria) === String(filtrosActivos.idCategoria);

      
      let cumplePresentacion = true;
      if (filtrosActivos.idPresentacion) {
        const presEncontrada = presentacionesGlobales.find(
          (p) => String(p.id) === String(filtrosActivos.idPresentacion)
        );
        cumplePresentacion = presEncontrada ? String(presEncontrada.idProducto) === String(idProd) : false;
      }

      return cumpleTexto && cumpleMarca && cumpleCategoria && cumplePresentacion;
    });
  }

  
  function renderizarProductos(productos) {
    const contenedor = document.querySelector("#catalogo-productos-contenedor");
    if (!contenedor) return;

    contenedor.replaceChildren(); 

    
    if (!productos || productos.length === 0) {
      const mensajeVacio = document.createElement("p");
      mensajeVacio.className = "catalogo-sin-resultados";
      mensajeVacio.setAttribute("role", "alert");
      mensajeVacio.textContent = "No se encontraron productos que cumplan con los filtros seleccionados.";
      contenedor.appendChild(mensajeVacio);
      return;
    }

    const fragmento = document.createDocumentFragment();

    productos.forEach((producto) => {
      const idProd = producto.id !== undefined ? producto.id : producto.idProducto;

      const tarjeta = document.createElement("article");
      tarjeta.className = "catalogo-producto-tarjeta";

      
      const imagenData = imagenesGlobales.find((img) => img.idProducto === idProd && img.esPrincipal) ||
                         imagenesGlobales.find((img) => img.idProducto === idProd);

      if (imagenData) {
        const figura = document.createElement("figure");
        figura.className = "catalogo-producto-figura";

        const img = document.createElement("img");
        img.src = imagenData.url;
        img.alt = imagenData.textoAlternativo || producto.nombre || "Imagen del producto";
        img.className = "catalogo-producto-img";
        img.loading = "lazy";

        figura.appendChild(img);
        tarjeta.appendChild(figura);
      }

      
      const titulo = document.createElement("h3");
      titulo.className = "catalogo-producto-titulo";
      titulo.textContent = String(producto.nombre || producto.nombreProducto || "Producto").normalize("NFC");

      
      const descripcion = document.createElement("p");
      descripcion.className = "catalogo-producto-descripcion";
      descripcion.textContent = String(producto.descripcion || "Sin descripción disponible.").normalize("NFC");

      tarjeta.appendChild(titulo);
      tarjeta.appendChild(descripcion);

     
      const presData = presentacionesGlobales.find((p) => p.idProducto === idProd);
      if (presData) {
        const presentacionTag = document.createElement("span");
        presentacionTag.className = "catalogo-producto-presentacion-tag";
        presentacionTag.textContent = presData.descripcion;
        tarjeta.appendChild(presentacionTag);
      }

      
      const precioValor = producto.precioReferencia !== undefined ? producto.precioReferencia : producto.precioRef;
      if (precioValor !== undefined && precioValor !== null) {
        const precio = document.createElement("span");
        precio.className = "catalogo-producto-precio";
        precio.textContent = `$${Number(precioValor).toLocaleString("es-CO")}`;
        tarjeta.appendChild(precio);
      }

      fragmento.appendChild(tarjeta);
    });

    contenedor.appendChild(fragmento);
  }

  
  function cargarOpcionesSelect(selectorId, lista, propiedadTexto, propiedadValor) {
    const select = document.querySelector(selectorId);
    if (!select || !Array.isArray(lista) || lista.length === 0) return;

    lista.forEach((item) => {
      const opcion = document.createElement("option");

      let texto = item;
      let valor = item;

      if (item && typeof item === "object") {
        valor = item[propiedadValor] !== undefined ? item[propiedadValor] : (item.id !== undefined ? item.id : item);
        texto = item[propiedadTexto] || item.descripcion || item.nombre || item.id || "";
      }

      opcion.value = String(valor !== undefined ? valor : "");
      opcion.textContent = String(texto).normalize("NFC");
      select.appendChild(opcion);
    });
  }

  
  function inicializarModuloFiltros(datosCatalogo) {
    const selectMarca = document.querySelector("#catalogo-select-marca");
    const selectCategoria = document.querySelector("#catalogo-select-categoria");
    const selectPresentacion = document.querySelector("#catalogo-select-presentacion");
    const btnLimpiar = document.querySelector("#catalogo-btn-limpiar-filtros");
    const inputBusqueda = document.querySelector("#catalogo-input-busqueda");

    if (datosCatalogo.marcas) cargarOpcionesSelect("#catalogo-select-marca", datosCatalogo.marcas, "nombre", "id");
    if (datosCatalogo.categorias) cargarOpcionesSelect("#catalogo-select-categoria", datosCatalogo.categorias, "nombre", "id");
    if (datosCatalogo.presentaciones) cargarOpcionesSelect("#catalogo-select-presentacion", datosCatalogo.presentaciones, "descripcion", "id");

    function actualizarInterfaz() {
      const resultados = aplicarFiltrosCombinados(productosGlobales);
      renderizarProductos(resultados);
    }

    
    if (inputBusqueda) {
      inputBusqueda.addEventListener("input", (e) => {
        filtrosActivos.texto = e.target.value;
        actualizarInterfaz();
      });
    }

    
    if (selectMarca) {
      selectMarca.addEventListener("change", (e) => {
        filtrosActivos.idMarca = e.target.value;
        actualizarInterfaz();
      });
    }

    if (selectCategoria) {
      selectCategoria.addEventListener("change", (e) => {
        filtrosActivos.idCategoria = e.target.value;
        actualizarInterfaz();
      });
    }

    if (selectPresentacion) {
      selectPresentacion.addEventListener("change", (e) => {
        filtrosActivos.idPresentacion = e.target.value;
        actualizarInterfaz();
      });
    }

    // Restablecer filtros
    if (btnLimpiar) {
      btnLimpiar.addEventListener("click", () => {
        filtrosActivos.texto = "";
        filtrosActivos.idMarca = "";
        filtrosActivos.idCategoria = "";
        filtrosActivos.idPresentacion = "";

        if (inputBusqueda) inputBusqueda.value = "";
        if (selectMarca) selectMarca.value = "";
        if (selectCategoria) selectCategoria.value = "";
        if (selectPresentacion) selectPresentacion.value = "";

        actualizarInterfaz();
      });
    }
  }

  
  async function iniciarFiltrosCombinados() {
    try {
      const datos = await catalogoServicio.listarTodos();
      productosGlobales = datos.productos || [];
      presentacionesGlobales = datos.presentaciones || [];
      imagenesGlobales = datos.imagenesProducto || [];

      renderizarProductos(productosGlobales);
      inicializarModuloFiltros(datos);
    } catch (error) {
      console.error("Error al cargar los datos en el módulo de filtros:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarFiltrosCombinados);
  } else {
    iniciarFiltrosCombinados();
  }
})();
// ===== G1-BUS · HU 5.2: Filtros Combinados (Katherin Ortega) · fin =====