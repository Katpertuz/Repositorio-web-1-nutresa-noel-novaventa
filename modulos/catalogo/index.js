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

// ===== G7-CUP · Cupón · inicio - Duvan Tique =====
(function () {
    const form = document.getElementById('formCrearPresentacion');
    const alerta = document.getElementById('alertaFormulario');

    if (!form || !alerta) {
        return;
    }

    form.addEventListener('submit', async function (evento) {
        evento.preventDefault();

        const idPresentacion = document.getElementById('idPresentacion').value.trim();
        const nombrePresentacion = document.getElementById('nombrePresentacion').value.trim();
        const pesoNeto = parseFloat(document.getElementById('pesoNeto').value);

        if (!idPresentacion || !nombrePresentacion || isNaN(pesoNeto) || pesoNeto <= 0) {
            alerta.className = 'alerta alerta-error';
            alerta.textContent = 'Por favor, completa todos los campos obligatorios correctamente.';
            alerta.hidden = false;
            return;
        }

        const nuevaPresentacion = {
            idPresentacion,
            nombrePresentacion,
            pesoNeto
        };

        try {
            if (window.catalogoServicio && typeof window.catalogoServicio.crearPresentacion === 'function') {
                await window.catalogoServicio.crearPresentacion(nuevaPresentacion);
            }

            alerta.className = 'alerta alerta-exito';
            alerta.textContent = '¡Presentación comercial registrada con éxito!';
            alerta.hidden = false;
            form.reset();

            document.dispatchEvent(new CustomEvent('catalogo:presentacion-creada', {
                detail: nuevaPresentacion
            }));

        } catch (error) {
            console.error(error);
            alerta.className = 'alerta alerta-error';
            alerta.textContent = 'No fue posible registrar la presentación. Intenta de nuevo más tarde.';
            alerta.hidden = false;
        }
    });
})();
// ===== G7-CUP · Cupón · fin =====