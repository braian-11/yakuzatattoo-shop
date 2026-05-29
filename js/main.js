// --- 1. ESTADO ---
let productos = [];
let carrito = JSON.parse(localStorage.getItem("carrito_tattoo")) || [];
let esMayorista = JSON.parse(localStorage.getItem("modo_mayorista")) || false;

// --- 2. SELECTORES ---
const contenedor = document.getElementById("contenedor-productos");
const btnSwitch = document.getElementById("btnSwitch");
const cartCount = document.getElementById("cart-count");
const modal = document.getElementById("modal-carrito");
const itemsCarrito = document.getElementById("items-carrito");
const totalPrecio = document.getElementById("total-precio");
const buscador = document.getElementById("buscador");
const botonesFiltro = document.querySelectorAll(".btn-filtro");

// --- 3. CARGA DE DATOS ---
const cargarData = async () => {
    try {
        const res = await fetch('./data/productos.json');
        if (!res.ok) throw new Error("Error en la carga");
        productos = await res.json();
        renderTienda(productos);
    } catch (e) {
        contenedor.innerHTML = "<h2 style='text-align:center; color:red;'>Error al cargar catálogo.</h2>";
    }
};

// --- 4. RENDER TIENDA ---
function renderTienda(lista = productos) {
    contenedor.innerHTML = "";
    if (lista.length === 0) {
        contenedor.innerHTML = "<h3 class='sin-resultados'>No se encontraron productos...</h3>";
        return;
    }
    lista.forEach(p => {
        const precio = esMayorista ? p.precioMay : p.precioMin;
        const card = document.createElement("div");
        card.className = "card-producto";
        card.innerHTML = `
            <img src="${p.img}" alt="${p.nombre}">
            <div class="info">
                <small>${p.seccion}</small>
                <h3>${p.nombre}</h3>
                <p class="precio">$${precio.toLocaleString()}</p>
                <button class="btn-add">Agregar al pedido</button>
            </div>
        `;
        card.querySelector(".btn-add").addEventListener("click", () => agregarAlCarrito(p.id, precio));
        contenedor.appendChild(card);
    });
}

// --- 5. LÓGICA BUSCADOR Y FILTROS ---
buscador.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
    renderTienda(filtrados);
});

botonesFiltro.forEach(btn => {
    btn.addEventListener("click", (e) => {
        botonesFiltro.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        const categoria = e.target.getAttribute("data-categoria");
        const filtrados = categoria === "Todos" ? productos : productos.filter(p => p.seccion === categoria);
        renderTienda(filtrados);
    });
});

// --- 6. LÓGICA DEL CARRITO ---
function agregarAlCarrito(id, precioVenta) {
    const productoOriginal = productos.find(p => p.id === id);
    const existe = carrito.find(item => item.id === id);

    if (existe) {
        if (existe.cantidad < productoOriginal.stock) {
            existe.cantidad++;
            mostrarNotificacion(productoOriginal.nombre);
        } else {
            alertaStock(productoOriginal.stock);
            return;
        }
    } else {
        if (productoOriginal.stock > 0) {
            carrito.push({ ...productoOriginal, precioFinal: precioVenta, cantidad: 1 });
            mostrarNotificacion(productoOriginal.nombre);
        } else {
            alertaStock(0);
            return;
        }
    }
    guardarYActualizar();
}

function renderCarrito() {
    itemsCarrito.innerHTML = "";
    carrito.forEach((item, index) => {
        const fila = document.createElement("div");
        fila.className = "item-carrito";
        fila.innerHTML = `
            <div class="info-item"><h4>${item.nombre}</h4><small>$${item.precioFinal.toLocaleString()} c/u</small></div>
            <div class="controles-cantidad">
                <button class="btn-qty" onclick="modificarCantidad(${index}, -1)">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-qty" onclick="modificarCantidad(${index}, 1)">+</button>
            </div>
            <p>$${(item.precioFinal * item.cantidad).toLocaleString()}</p>
        `;
        itemsCarrito.appendChild(fila);
    });
    const total = carrito.reduce((acc, i) => acc + (i.precioFinal * i.cantidad), 0);
    totalPrecio.textContent = `$${total.toLocaleString()}`;
}

window.modificarCantidad = (index, valor) => {
    const item = carrito[index];
    const productoOriginal = productos.find(p => p.id === item.id);
    if (valor === 1) {
        if (item.cantidad < productoOriginal.stock) item.cantidad++;
        else alertaStock(productoOriginal.stock);
    } else {
        item.cantidad--;
        if (item.cantidad <= 0) carrito.splice(index, 1);
    }
    guardarYActualizar();
    renderCarrito();
};

// --- 7. UTILIDADES ---
function guardarYActualizar() {
    localStorage.setItem("carrito_tattoo", JSON.stringify(carrito));
    cartCount.textContent = carrito.reduce((acc, i) => acc + i.cantidad, 0);
}

function mostrarNotificacion(nombre) {
    Toastify({
        text: `✔️ ${nombre} agregado`,
        duration: 2000,
        gravity: "bottom",
        position: "right",
        style: { background: "linear-gradient(to right, #d4af37, #f1c40f)", color: "#000", fontWeight: "bold", borderRadius: "8px" }
    }).showToast();
}

function alertaStock(limite) {
    Swal.fire({
        icon: 'warning',
        title: 'Límite de stock',
        text: limite > 0 ? `Solo tenemos ${limite} unidades disponibles.` : 'Producto sin stock.',
        background: '#1a1a1a', color: '#d4af37', confirmButtonColor: '#d4af37'
    });
}

// --- 8. EVENTOS Y CIERRE ---
btnSwitch.addEventListener("click", () => {
    esMayorista = !esMayorista;
    localStorage.setItem("modo_mayorista", JSON.stringify(esMayorista));
    btnSwitch.textContent = esMayorista ? "MODO: MAYORISTA" : "MODO: MINORISTA";
    renderTienda();
});

document.querySelector(".cart-icon").addEventListener("click", () => {
    modal.style.display = "flex";
    renderCarrito();
});

document.getElementById("cerrar-carrito").addEventListener("click", () => modal.style.display = "none");

document.getElementById("finalizar-compra").addEventListener("click", () => {
    if (carrito.length === 0) return Swal.fire("Carrito vacío", "Agregá productos primero.", "info");
    let mensaje = "¡Hola! Quisiera realizar este pedido:\n\n";
    carrito.forEach(i => mensaje += `- ${i.nombre} (x${i.cantidad}) - $${(i.precioFinal * i.cantidad).toLocaleString()}\n`);
    mensaje += `\n*TOTAL: ${totalPrecio.textContent}*`;
    window.open(`https://wa.me/5491123752864?text=${encodeURIComponent(mensaje)}`, "_blank");
});

document.getElementById("vaciar-carrito").addEventListener("click", () => {
    if (carrito.length === 0) return;
    Swal.fire({
        title: '¿Vaciar carrito?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d4af37',
        background: '#1a1a1a', color: '#f5f5f5'
    }).then((result) => {
        if (result.isConfirmed) {
            carrito = [];
            guardarYActualizar();
            renderCarrito();
            modal.style.display = "none";
        }
    });
});

guardarYActualizar();
cargarData();