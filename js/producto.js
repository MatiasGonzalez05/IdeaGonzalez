const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get("id");

fetch("https://api-productos-nzlk.onrender.com/productos")
    .then(res => res.json())
    .then(data => {
        const producto = data.find(item => item.id === parseInt(idParam));
        if (producto) {
            mostrarInfoProducto(producto);
            actualizarCarritoEnTodasLasPaginas(); // Actualizar el carrito al cargar el producto
        } else {
            innerHTML = "producto no encontrado"
        }
    });

const contenedor = document.querySelector("#single-product");


const mostrarInfoProducto = (producto) => {
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="card-producto">
            <a class="link-volver-inicio" href="index.html"><</a>
            <div class="container-producto">
                <img class="img-producto" src="${producto.img}" />
                <div class="contenedor-descripcion">  
                    <h2 class="titulo-producto contenido-producto">${producto.titulo}</h2>
                    <p class="descripcion-producto">${producto.descripciones}</p>
                    <p class="contenido-producto">$${producto.precio}</p>
                </div>
            </div>
        </div>
    `;
    contenedor.append(div);
}

const actualizarCarritoEnTodasLasPaginas = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    const carritoProductosContainer = document.querySelector("#carrito-productos");
    const numeroDelCarrito = document.querySelector(".cart-count");

    if (carritoGuardado.length === 0) {
        carritoProductosContainer.innerHTML = ""; 
        carritoProductosContainer.classList.add("d-none"); 
        document.querySelector("#carrito-vacio").classList.remove("d-none"); 
    } else {
        carritoProductosContainer.innerHTML = ""; 
        document.querySelector("#carrito-vacio").classList.add("d-none"); 
        carritoProductosContainer.classList.remove("d-none"); 

        carritoGuardado.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="img-sidebar" src="${producto.img}" alt="${producto.titulo}">
                <h4 class="titulo-producto-sidebar contenido-producto">${producto.titulo}</h4>
                <p class="precio-sidebar contenido-producto">$${(producto.precio * producto.cantidad).toFixed(2)}</p>
                <p>x${producto.cantidad}</p>
            `;
            carritoProductosContainer.appendChild(div);
        });
    }

    // Actualizar el total del carrito
    const total = carritoGuardado.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0).toFixed(2);
    document.querySelector("#carrito-total").innerText = `U$D ${total}`;

    const contadorCarrito = carritoGuardado.reduce((acc, prod) => acc + prod.cantidad, 0);
    numeroDelCarrito.innerText = contadorCarrito;
}




document.addEventListener("DOMContentLoaded", () => {
    const carritoIcon = document.querySelector(".carrito-icon");
    const sidebarCloseIcon = document.querySelector(".sidebar-close");
    const sidebar = document.getElementById("sidebar");

    carritoIcon.addEventListener("click", () => {
        sidebar.classList.add("open");
        actualizarCarritoEnTodasLasPaginas(); 
    });

    sidebarCloseIcon.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });

    // Recuperar productos del localStorage
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
    if (carritoGuardado && carritoGuardado.length > 0) {
        carrito = carritoGuardado;
    }
    actualizarCarritoEnTodasLasPaginas();
});



