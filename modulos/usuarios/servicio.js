const baseURL = 'https://6ada65787512f497b3ffe957.mockapi.io/api/v1';
const section1 = document.getElementById("productContainer");
const section2 = document.querySelector("#userContainer");
const btnProduct = document.querySelector('#btnProducto');
const btnUser = document.querySelector('#btnUsuario');
const listaProductos = document.querySelector('#productosLista');
const estadoProductos = document.querySelector('#productosEstado');


async function obtenerUsuario() {
    try {
        const response = await fetch(`${baseURL}/users`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
    }
}

async function obtenerProductos() {
    try {
        const response = await fetch(`${baseURL}/productos`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('No fue posible obtener los productos:', error);
        return null;
    }
}

btnProduct.addEventListener('click', async () => {
    estadoProductos.textContent = 'Cargando productos...';
    listaProductos.replaceChildren();

    const datos = await obtenerProductos();
    if (!Array.isArray(datos) || datos.length === 0) {
        estadoProductos.textContent = 'No hay productos para mostrar.';
        return;
    }

    datos.forEach((producto) => {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'producto-tarjeta';

        const nombre = producto.nombre || producto.name || producto.nombreProducto || 'Producto';
        const descripcion = producto.descripcion || producto.description;
        const precio = producto.precio || producto.price || producto.precioReferencia;
        const imagen = producto.imagen || producto.image || producto.urlImagen;

        if (imagen) {
            const foto = document.createElement('img');
            foto.className = 'producto-tarjeta-imagen';
            foto.src = imagen;
            foto.alt = nombre;
            foto.loading = 'lazy';
            tarjeta.appendChild(foto);
        }

        const contenido = document.createElement('div');
        contenido.className = 'producto-tarjeta-contenido';

        const titulo = document.createElement('h3');
        titulo.textContent = nombre;
        contenido.appendChild(titulo);

        if (descripcion) {
            const textoDescripcion = document.createElement('p');
            textoDescripcion.textContent = descripcion;
            contenido.appendChild(textoDescripcion);
        }

        if (precio !== undefined && precio !== null && precio !== '') {
            const textoPrecio = document.createElement('p');
            textoPrecio.className = 'producto-tarjeta-precio';
            textoPrecio.textContent = `Precio: $${precio}`;
            contenido.appendChild(textoPrecio);
        }

        tarjeta.appendChild(contenido);
        listaProductos.appendChild(tarjeta);
    });

    estadoProductos.textContent = `${datos.length} productos encontrados.`;
})


