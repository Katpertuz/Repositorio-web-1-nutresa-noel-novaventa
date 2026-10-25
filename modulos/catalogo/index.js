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

// ===== G7-CUP · Cupón · inicio =====
(function () {
  const tbody = document.getElementById('tabla-presentaciones-body');
  const estado = document.getElementById('catalogo-estado');

  const informacionProductos = {
    1: { nombre: 'Galletas Noel Tradicional (Gramos)', empaque: 'Paquete', descripcion: 'Galleta dulce tradicional para lonchera.' },
    2: { nombre: 'Pasta Doria Espagueti (Gramos)', empaque: 'Bolsa', descripcion: 'Pasta larga para preparaciones clasicas.' },
    3: { nombre: 'Cafe Colcafe Clasico (Gramos)', empaque: 'Frasco', descripcion: 'Cafe soluble tradicional.' },
    4: { nombre: 'Chocolate Jet (Gramos)', empaque: 'Barra', descripcion: 'Chocolate de leche en barra.' },
    5: { nombre: 'Salchicha Ranchera (Gramos)', empaque: 'Paquete', descripcion: 'Salchicha lista para cocinar.' },
    6: { nombre: 'Galletas Festival Vainilla', empaque: 'Paquete', descripcion: 'Galleta rellena sabor vainilla.' },
    7: { nombre: 'Pasta Doria Tornillos', empaque: 'Bolsa', descripcion: 'Pasta corta tipo tornillo.' },
    8: { nombre: 'Colcafe Cappuccino Vainilla', empaque: 'Caja', descripcion: 'Mezcla instantanea sabor vainilla.' },
    9: { nombre: 'Jet Leche Mani', empaque: 'Barra', descripcion: 'Chocolate con mani.' },
    10: { nombre: 'Ranchera Premium', empaque: 'Paquete', descripcion: 'Linea premium de salchichas.' }
  };

  function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }

  function renderizarPresentaciones(presentaciones) {
    if (!tbody) return;

    tbody.innerHTML = ''; 

    presentaciones.forEach(function (item) {
      const infoExtra = informacionProductos[item.id] || {
        nombre: 'Presentación Nutresa',
        empaque: 'Empaque',
        descripcion: item.descripcion
      };

      const codigoStr = `G1-PRE-${String(item.id).padStart(3, '0')}`;
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${codigoStr}</td>
        <td>${infoExtra.nombre}</td>
        <td>${item.contenidoNeto}${item.unidadMedida}</td>
        <td>${item.descripcion}</td>
        <td>${infoExtra.empaque}</td>
        <td>${infoExtra.descripcion}</td>
        <td>${formatearPrecio(item.precio)}</td>
      `;

      tbody.appendChild(tr);
    });

    if (estado) {
      estado.textContent = `Listado de las ${presentaciones.length} presentaciones comerciales cargado correctamente.`;
    }
  }

  async function iniciarPresentaciones() {
    try {
      const presentaciones = await presentacionServicio.listarPresentaciones();
      renderizarPresentaciones(presentaciones);
    } catch (error) {
      console.error('Error al cargar las presentaciones:', error);
    }
  }

  iniciarPresentaciones();
})();
// ===== G7-CUP · Cupón · fin =====
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
