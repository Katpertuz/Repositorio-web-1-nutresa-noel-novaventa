(function () {
  var catalogoMockData = {
    categorias: [
      { id: 1, nombre: "Galletas", descripcion: "Portafolio de galletas dulces y saladas.", urlIcono: "https://picsum.photos/seed/cat-galletas/200/200", activa: true, idUsuarioCreador: 1 },
      { id: 2, nombre: "Pastas", descripcion: "Pastas secas y listas para preparar.", urlIcono: "https://picsum.photos/seed/cat-pastas/200/200", activa: true, idUsuarioCreador: 1 },
      { id: 3, nombre: "Bebidas", descripcion: "Bebidas calientes y frias instantaneas.", urlIcono: "https://picsum.photos/seed/cat-bebidas/200/200", activa: true, idUsuarioCreador: 4 },
      { id: 4, nombre: "Chocolates", descripcion: "Chocolates y confites.", urlIcono: "https://picsum.photos/seed/cat-chocolates/200/200", activa: true, idUsuarioCreador: 4 },
      { id: 5, nombre: "Proteinas", descripcion: "Proteinas listas para consumo.", urlIcono: "https://picsum.photos/seed/cat-proteinas/200/200", activa: true, idUsuarioCreador: 10 }
    ],
    marcas: [
      { id: 1, nombre: "Noel", descripcion: "Linea de galletas y snacks.", paisOrigen: "Colombia", urlLogo: "https://picsum.photos/seed/marca-noel/200/120", activa: true, idUsuarioCreador: 1 },
      { id: 2, nombre: "Doria", descripcion: "Linea de pastas.", paisOrigen: "Colombia", urlLogo: "https://picsum.photos/seed/marca-doria/200/120", activa: true, idUsuarioCreador: 1 },
      { id: 3, nombre: "Colcafe", descripcion: "Linea de bebidas instantaneas.", paisOrigen: "Colombia", urlLogo: "https://picsum.photos/seed/marca-colcafe/200/120", activa: true, idUsuarioCreador: 4 },
      { id: 4, nombre: "Jet", descripcion: "Linea de chocolates.", paisOrigen: "Colombia", urlLogo: "https://picsum.photos/seed/marca-jet/200/120", activa: true, idUsuarioCreador: 4 },
      { id: 5, nombre: "Ranchera", descripcion: "Linea de embutidos y proteinas.", paisOrigen: "Colombia", urlLogo: "https://picsum.photos/seed/marca-ranchera/200/120", activa: true, idUsuarioCreador: 10 }
    ],
    productos: [
      { id: 1, nombre: "Galletas Noel Tradicional", descripcion: "Galleta dulce tradicional para lonchera.", precioReferencia: 4500, activo: true, idMarca: 1, idCategoria: 1 },
      { id: 2, nombre: "Pasta Doria Espagueti", descripcion: "Pasta larga para preparaciones clasicas.", precioReferencia: 5300, activo: true, idMarca: 2, idCategoria: 2 },
      { id: 3, nombre: "Cafe Colcafe Clasico", descripcion: "Cafe soluble tradicional.", precioReferencia: 7900, activo: true, idMarca: 3, idCategoria: 3 },
      { id: 4, nombre: "Chocolate Jet", descripcion: "Chocolate de leche en barra.", precioReferencia: 2200, activo: true, idMarca: 4, idCategoria: 4 },
      { id: 5, nombre: "Salchicha Ranchera", descripcion: "Salchicha lista para cocinar.", precioReferencia: 9800, activo: true, idMarca: 5, idCategoria: 5 },
      { id: 6, nombre: "Galletas Festival Vainilla", descripcion: "Galleta rellena sabor vainilla.", precioReferencia: 3200, activo: true, idMarca: 1, idCategoria: 1 },
      { id: 7, nombre: "Pasta Doria Tornillos", descripcion: "Pasta corta tipo tornillo.", precioReferencia: 5600, activo: true, idMarca: 2, idCategoria: 2 },
      { id: 8, nombre: "Colcafe Cappuccino Vainilla", descripcion: "Mezcla instantanea sabor vainilla.", precioReferencia: 14800, activo: true, idMarca: 3, idCategoria: 3 },
      { id: 9, nombre: "Jet Leche Mani", descripcion: "Chocolate con mani.", precioReferencia: 2800, activo: true, idMarca: 4, idCategoria: 4 },
      { id: 10, nombre: "Ranchera Premium", descripcion: "Linea premium de salchichas.", precioReferencia: 11200, activo: true, idMarca: 5, idCategoria: 5 }
    ],
    presentaciones: [
      { id: 1, descripcion: "Paquete x12 unidades", contenidoNeto: 300, unidadMedida: "g", precio: 4500, idProducto: 1 },
      { id: 2, descripcion: "Bolsa 500 gramos", contenidoNeto: 500, unidadMedida: "g", precio: 5300, idProducto: 2 },
      { id: 3, descripcion: "Frasco x 50 porciones", contenidoNeto: 170, unidadMedida: "g", precio: 7900, idProducto: 3 },
      { id: 4, descripcion: "Barra unidad", contenidoNeto: 35, unidadMedida: "g", precio: 2200, idProducto: 4 },
      { id: 5, descripcion: "Paquete x5 unidades", contenidoNeto: 400, unidadMedida: "g", precio: 9800, idProducto: 5 },
      { id: 6, descripcion: "Paquete x6 unidades", contenidoNeto: 240, unidadMedida: "g", precio: 3200, idProducto: 6 },
      { id: 7, descripcion: "Bolsa 500 gramos", contenidoNeto: 500, unidadMedida: "g", precio: 5600, idProducto: 7 },
      { id: 8, descripcion: "Caja x10 sobres", contenidoNeto: 180, unidadMedida: "g", precio: 14800, idProducto: 8 },
      { id: 9, descripcion: "Barra unidad", contenidoNeto: 30, unidadMedida: "g", precio: 2800, idProducto: 9 },
      { id: 10, descripcion: "Paquete x5 unidades", contenidoNeto: 420, unidadMedida: "g", precio: 11200, idProducto: 10 }
    ],
    imagenesProducto: [
      { id: 1, url: "https://saltinnoel.com.co/wp-content/uploads/2017/07/12-15-FotosDestacadas-SaltinNoel-3.jpg", textoAlternativo: "Galletas Noel Tradicional", esPrincipal: true, orden: 1, idProducto: 1 },
      { id: 2, url: "https://alimentosdoria.com/wp-content/uploads/2023/01/banner-spaghetti-1.png", textoAlternativo: "Pasta Doria Espagueti", esPrincipal: true, orden: 1, idProducto: 2 },
      { id: 3, url: "https://colcafe.com/wp-content/uploads/2025/03/Dummie-actual.png", textoAlternativo: "Cafe Colcafe Clasico", esPrincipal: true, orden: 1, idProducto: 3 },
      { id: 4, url: "https://chocolatesjet.com/wp-content/uploads/2021/01/03-06-BannerInternaJetTradicionalLaminaDorada-Jet.webp", textoAlternativo: "Chocolate Jet", esPrincipal: true, orden: 1, idProducto: 4 },
      { id: 5, url: "https://ranchera.com.co/wp-content/uploads/2021/10/DUMMIE-RANCHERA-SCHA-PREMIUM-480G-1-330x0-c-default.webp", textoAlternativo: "Salchicha Ranchera", esPrincipal: true, orden: 1, idProducto: 5 }
    ]
  };

  window.catalogoMockData = catalogoMockData;
  window.productosData = catalogoMockData.productos.map(function (producto) {
    return {
      idProducto: producto.id,
      nombreProducto: producto.nombre,
      idMarca: producto.idMarca,
      idCategoria: producto.idCategoria,
      precioRef: producto.precioReferencia
    };
  });
})();
