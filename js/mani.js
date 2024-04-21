/* ------carpi------- */

let carrito =  JSON.parse(localStorage.getItem("carrito")) || [];
console.log(carrito);


const productos = [
    {
        titulo: "Iphone 15 PRO",
        precio: 1150,
        img: "./img/D_NQ_NP_918178-MLA71783088444_092023-O.webp"
    },
    {
        titulo: "Iphone 14 PRO",
        precio: 900,
        img: "./img/D_NQ_NP_904279-MLU70351459718_072023-O.webp"
    },
    {
        titulo: "Iphone 13",
        precio: 700,
        img: "./img/D_NQ_NP_736168-MLA47781742030_102021-O.webp"
    },
    {
        titulo: "Iphone 12",
        precio: 520,
        img: "./img/D_NQ_NP_789656-MLA73571835400_122023-O.webp"
    },
    {
        titulo: "Iphone 11",
        precio: 450,
        img: "./img/D_NQ_NP_656548-MLA46114829749_052021-O.webp"
    },
    {
        titulo: "Iphone XR",
        precio: 320,
        img: "./img/D_NQ_NP_652817-MLA75551789182_042024-O.webp"
    },
    {
        titulo: "Vision PRO",
        precio: 5000,
        img: "./img/D_NQ_NP_2X_909202-MLA75217037309_032024-F.webp"
    },
    {
        titulo: "Ipad AIR",
        precio: 2000,
        img: "./img/D_NQ_NP_2X_838164-MLA52223468040_102022-F.webp"
    },
];

const contenedorProductos = document.querySelector('#productos');
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const numeroDelCarrito = document.querySelector(".cart-count");
const botonComprar = document.querySelector('.checkout-btn');

productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
        <img class="img-producto" src="${producto.img}" alt="${producto.titulo}">
        <h4 class="card-title">${producto.titulo}</h4>
        <div class="card-price">
            <p class="price">U$D ${producto.precio}</p>
        </div>
    `;

    const btn = document.createElement("button");
    btn.classList.add("btn-plus");
    btn.innerText = "Agregar al carrito";

    btn.addEventListener("click", () => {
        agregarAlCarrito(producto);
    })

    div.append(btn);
    contenedorProductos.append(div)
})

function actualizarCarrito() {
    const carritoProductos = document.querySelector("#carrito-productos");
    const carritoTotal = document.querySelector("#carrito-total");

    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        
        carritoProductos.innerHTML = "";

        let total = 0;

        carrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="img-sidebar" src="${producto.img}"></img>
                <h4 class="titulo-producto-sidebar contenido-producto">${producto.titulo}</h4>
                <p class="precio-sidebar contenido-producto">$ ${(producto.precio * producto.cantidad).toFixed(2)}</p>
            `;

            const btnRestar = document.createElement("button");
            btnRestar.classList.add("carrito-producto-restar", "contenedor-sumar-restar");
            btnRestar.innerText = "-";
            btnRestar.addEventListener("click", () => {
                restarDelCarrito(producto); // Cambiar a función para restar del carrito
            })
            div.append(btnRestar);

            const numeroCantidad = document.createElement("p");
            numeroCantidad.classList.add("cantidad-sidebar", "contenedor-sumar-restar");
            numeroCantidad.innerHTML = `${producto.cantidad}`;
            div.append(numeroCantidad);

            const btnSumar = document.createElement("button");
            btnSumar.classList.add("carrito-producto-sumar", "contenedor-sumar-restar");
            btnSumar.innerText = "+";
            btnSumar.addEventListener("click", () => {
                sumarDelCarrito(producto); // Cambiar a función para agregar al carrito
            })
            div.append(btnSumar);

            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("carrito-producto-btn");
            btnEliminar.innerText = "🗑";
            btnEliminar.addEventListener("click", () => {
                borrarDelCarrito(producto);
            })
            div.append(btnEliminar);
            carritoProductos.append(div);
        });
    }
    actualizarTotalCarrito();
    numeroDelCarrito.innerText = actualizarContadorCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

/* se llama cuando se agrega un producto al carro */
const agregarAlCarrito = (producto) => {
    const itemEncontrado = carrito.find(item => item.titulo === producto.titulo);
    if (itemEncontrado) {
        itemEncontrado.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1});
    }

    actualizarCarrito();

    Toastify({
        text: "Producto agregado al carrito.",
        gravity: "bottom",
        duration: 1000,
        style: {
            background: "#202020",
        },
    }).showToast();
}

const borrarDelCarrito = (producto) => {
    const productoIndex = carrito.findIndex(item => item.titulo === producto.titulo);
    carrito.splice(productoIndex, 1);
    actualizarCarrito();
    actualizarContadorCarrito();
}

const restarDelCarrito = (producto) => {
    if (producto.cantidad !== 1) {
        producto.cantidad--;
    }
    actualizarCarrito();
}

const sumarDelCarrito = (producto) => {
    producto.cantidad++;
    actualizarCarrito();
}

const vaciarCarrito = () => {
    Swal.fire({
        title: "Estas seguro?",
        text: "Se eliminaran todos los productos del carrito.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vaciar carrito"
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = []; 
            actualizarCarrito(); 
          Swal.fire({
            title: "Se eliminaron los productos correctamente!",
            text: "El carrito esta vacío.",
            icon: "success"
          });
        } 
      });
}

botonComprar.addEventListener('click', () => {
    if (carrito.length > 0) {
        Swal.fire({
            title: '¿Quieres finalizar tu compra?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Comprar'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito = []; 
                actualizarCarrito(); 
                Swal.fire(
                    '¡Compra realizada con éxito!',
                    'Muchas gracias por tu compra.',
                    'success'
                )
            }
        });
    } else {
        Swal.fire(
            'Carrito vacío',
            'No hay productos en tu carrito de compras.',
            'info'
        )
    }
});

/* vaciar el carrito al hacer clic en el botón */
const vaciarCarritoBtn = document.getElementById("vaciar-carrito-btn");
vaciarCarritoBtn.addEventListener("click", vaciarCarrito);

const actualizarContadorCarrito = () => {
    const contadorCarrito = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    return contadorCarrito;
}

const actualizarTotalCarrito = () => {
    const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0).toFixed(2);
    carritoTotal.innerText = `U$D ${total}`;
}


/* mostrar el sidebar */
const mostrarSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.add("open");
}

/* ocultar el sidebar */
const ocultarSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.remove("open");
}

/* función para alternar la visibilidad del sidebar */
const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
}

/* evento para mostrar el sidebar al hacer clic en el ícono del carrito */
const carritoIcon = document.querySelector(".carrito-icon");
carritoIcon.addEventListener("click", mostrarSidebar);

/* evento para ocultar el sidebar al hacer clic en el ícono de cierre */
const sidebarCloseIcon = document.querySelector(".sidebar-close");
sidebarCloseIcon.addEventListener("click", ocultarSidebar);

actualizarCarrito();