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

// ===== G1-BUS · Ejercicio MockAPI (Katherin Ortega) · inicio =====
(function () {
  "use strict";


  const baseURL = "https://6ada65787512f497b3ffe949.mockapi.io/api/v1";

  
  async function obtenerImagenes() {
    try {
      const response = await fetch(`${baseURL}/imagenProducto`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Hubo un error obteniendo las imágenes:", error);
    }
  }

  
  document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.querySelector("#cardContainer");
    const btnImagenes = document.querySelector("#btnImagenes");

    if (!btnImagenes || !cardContainer) return;

    btnImagenes.addEventListener("click", async () => {
      btnImagenes.textContent = "Cargando imágenes...";
      btnImagenes.disabled = true;

      
      cardContainer.replaceChildren();

      const datos = await obtenerImagenes();

      if (datos && datos.length > 0) {
        const fragmento = document.createDocumentFragment();

        datos.forEach((img) => {
       
          const card = document.createElement("article");
          card.classList.add("card");

          const url = img.url || img.imagenProducto || img.avatar || "https://picsum.photos/300/200";
          const texto = img.textoAlternativo || img.nombre || `Imagen #${img.id}`;
          const idProducto = img.idProducto || img.id || "N/A";

          
          card.innerHTML = `
            <figure class="card-figura">
              <img src="${url}" alt="${texto}" class="card-img" loading="lazy" />
              ${img.esPrincipal ? '<figcaption class="card-badge">Principal</figcaption>' : ''}
            </figure>
            <header class="card-header">
              <h3>${texto}</h3>
            </header>
            <footer class="card-footer">
              <p><strong>ID Producto asociado:</strong> ${idProducto}</p>
              <p><strong>ID Registro:</strong> ${img.id}</p>
            </footer>
          `;

          fragmento.appendChild(card);
        });

      
        cardContainer.appendChild(fragmento);
      } else {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.className = "mensaje-estado";
        mensajeVacio.setAttribute("role", "alert");
        mensajeVacio.textContent = "No se encuentran imágenes en el servidor.";
        cardContainer.appendChild(mensajeVacio);
      }

      btnImagenes.textContent = "Obtener Imágenes de MockAPI";
      btnImagenes.disabled = false;
    });
  });
})();
// ===== G1-BUS · Ejercicio MockAPI (Katherin Ortega) · fin =====