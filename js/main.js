let carrito =  JSON.parse(localStorage.getItem("carrito")) || [];
let productos = []

fetch("https://api-productos-nzlk.onrender.com/productos")
    .then(res => res.json())
    .then(data => {
        productos = data;
        mostrarProductos(productos);
    })



const contenedorProductos = document.querySelector('#productos');
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const numeroDelCarrito = document.querySelector(".cart-count");
const botonComprar = document.querySelector('.checkout-btn');
const botonesCategorias = document.querySelectorAll(".boton-categoria")

const mostrarProductos = (productosElegidos) => {

    contenedorProductos.innerHTML = "";
    productosElegidos.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
            <img src="${producto.img}" alt="${producto.titulo}">
            <h4 class="card-title">${producto.titulo}</h4>
            <div class="card-price">
                <p class="price">U$D ${producto.precio}</p>
            </div>
            <a href="producto.html?id=${producto.id}" class="btn-plus">Ver Mas</a>
        `;
        
        const btn = document.createElement("button");
        btn.classList.add("btn-plus");
        btn.innerText = "+";
    
        btn.addEventListener("click", () => {
            agregarAlCarrito(producto);
        })
        
        div.append(btn);
        contenedorProductos.append(div)
    })
}

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");
    
        const categoriaSeleccionada = e.currentTarget.id;
        
        if (categoriaSeleccionada !== "todos") {
            const productosFiltrados = productos.filter(producto => producto.categoria.id === categoriaSeleccionada);
            mostrarProductos(productosFiltrados);
        } else {
            mostrarProductos(productos);
        }
    });
});

    
function actualizarCarrito() {
    const carritoProductos = document.querySelector("#carrito-productos");
    const carritoTotal = document.querySelector("#carrito-total");

    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        vaciarCarritoBtn.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        vaciarCarritoBtn.classList.remove("d-none");
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
                restarDelCarrito(producto); 
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
                sumarDelCarrito(producto); 
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
    localStorage.setItem("carrito", JSON.stringify(carrito));
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

/* search */
/* document.addEventListener('keyup', e => {
    if (e.target.matches('#searchBar')){
        document.querySelectorAll('#productos').forEach(producto => {
            producto.textContent.toLocaleLowerCase().includes(e.target.value) ? producto.classList.remove('filto') : producto.classList.add('filtro');
        })
    }
}) */

