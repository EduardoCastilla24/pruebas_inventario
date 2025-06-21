
import { searchProduct } from "./search_product.js";
import { Notify } from "../../notiflix/notify.js";
import { Read_Detalle_Boleta } from "../facturacion/read_boleta.js";

var Salida = [];

var cod_prod = document.getElementById('cod_prod');
const btnAgregar = document.getElementById(`añadir`);

// Evento al presionar Enter en el input
cod_prod.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        await agregarProducto();
    }
});

// Evento al hacer clic en el botón
if (btnAgregar) {
    btnAgregar.addEventListener('click', async () => {
        await agregarProducto();
    });
}

async function agregarProducto() {
    var cod_proforma = document.getElementById('cod_proforma').value;
    var cantidad = 1;


    // VALIDAR LA CANTIDAD DE STOCK DISPONIBLE
    const getProducto = searchProduct(cod_prod)

    if (!getProducto) {
        return;
    }

    const getProducto_stock = parseInt(getProducto.stock)
    const cod_producto = getProducto.cod_prod
    const producto = getProducto.producto
    const precio = getProducto.precio_minorista
    const unidad = getProducto.unidad
    var subtotal = cantidad * parseFloat(getProducto.precio_minorista)

    if (cantidad > getProducto_stock) {
        alert('No hay suficiente stock disponible para la cantidad solicitada');
    } else {
        create(cod_proforma, cod_producto, producto, unidad, cantidad, precio, subtotal)
    }

    limpiar()
}

var count = 0 //Variable para el id de las tablas

//Crear objeto JSON
function create(cod_proforma, cod_producto, producto, unidad, cantidad, precio, subtotal) {
    // Objeto JSON INGRESO
    var salidaList = {
        cod_proforma: cod_proforma,
        id: count,
        cod_prod: cod_producto,
        producto: producto,
        unidad: unidad,
        cantidad: cantidad,
        precio: precio,
        subtotal: cantidad * parseFloat(subtotal),

    };
    // Enviar los datos al arreglo
    Salida.push(salidaList)
    // Pintar los datos en la tabla
    agregarFila(cod_producto, producto, unidad, cantidad, precio, subtotal)
    count++
}

function agregarFila(codTable, productTable, unidadTable, cantidadTable, precioTable, subtotalTable) {
    var fila = `
    <tr id="row-${count}" class="!h-20 border-b border-gray-200">
        <td class="max-w-36 w-36">${codTable}</td>
        <td class="truncate max-w-[25rem] px-10 w-[25rem] text-center">${productTable}</td>
        <td>${unidadTable}</td>
        <td>
            <input type="number" value="${cantidadTable}" min="1" class="cantidad-input max-w-[5rem] text-center" data-id="${count}" />
        </td>
        <td>S/. ${precioTable}</td>
        <td class="subtotal">S/. ${subtotalTable.toFixed(2)}</td>
        <td>
            <div class="flex items-center justify-center">
                <button type="button" class="bg-red-600 text-white flex justify-center items-center" onclick="import('/js/proformas/productos/add_list.js').then(module => module.Eliminar('${count}'))">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                </button>
            </div>
        </td>
    </tr>`;

    $('#List_Proforma').append(fila);
    SumarTotal();

    // Agregar evento para detectar cambios en la cantidad
    document.querySelector(`#row-${count} .cantidad-input`).addEventListener('input', actualizarCantidad);
}

//Limpiar los datos de cantidadidad, producto y precio
function limpiar() {
    var cod_prod = document.getElementById('cod_prod');

    cod_prod.value = ""

}

//Sumar el total de los productos
function SumarTotal() {
    var subtotal = Salida.reduce((sum, value) => (sum + (value.subtotal - (value.subtotal * .18))), 0);
    var igv = Salida.reduce((sum, value) => (sum + value.subtotal * .18), 0);
    var total = (subtotal + igv)
    // Mostrar el precio en los inputs
    $('#subtotal').val(subtotal.toFixed(2))
    $('#igv').val(igv.toFixed(2))
    $('#total').val(total.toFixed(2))
}

// Eliminar la fila de la tabla
export function Eliminar(idTable) {
    const index = Salida.findIndex(item => item.id == idTable);
    if (index !== -1) {
        Salida.splice(index, 1);
    }

    const fila = document.getElementById(`row-${idTable}`);
    if (fila) fila.remove();

    // Limpiar campos de precios
    document.getElementById('subtotal').value = ""
    document.getElementById('igv').value = ""
    document.getElementById('total').value = ""

    SumarTotal();
}

// ENVIAR DATOS
export function Enviar_detalle() {
    // VALIDAR SI LOS CAMPOS ESTAN VACIOS
    if ($('#cliente').val() == "" && $('#fecha').val() == "") {
        // Alert('warning', 'Campos requeridos', 'ok', 'Debe rellenar todos los campos del formulario')
    } else {
        // VALIDAR QUE EL ARRAY TENGA ITEMS
        if (Salida.length == 0) {
            // Alert('warning', '¬°Oops!', 'Entendido', 'Debe ingresar al menos un producto');
        } else {
            // Enviar arreglo al controlador por medio de un ciclo
            for (var i = 0; i < Salida.length; i++) {

                const data = {
                    cod_proforma: Salida[i].cod_proforma,
                    cod_producto: Salida[i].cod_prod,
                    producto: Salida[i].producto,
                    unidad: Salida[i].unidad,
                    precio: Salida[i].precio,
                    cantidad: parseInt(Salida[i].cantidad),
                    subtotal: Salida[i].subtotal,
                }

                console.log(data);

                const serializedData = JSON.stringify(data);

                // Construir la URL
                const scriptURL = `https://script.google.com/macros/s/AKfycbyC4woxbJSeSZnip08wLvlk3wPWPhVVZftCbDdfI7h1hI4Kv7ao33O0X1KYlDN1OApn/exec?action=create_detalle_proforma&detalle_proforma=${encodeURIComponent(serializedData)}`;

                fetch(scriptURL, { method: "GET" })
                    .then((response) => {
                    })

            }

        }
    }
}

// Función para actualizar la cantidad en la lista y en la tabla
function actualizarCantidad(e) {
    const id = e.target.dataset.id;
    let nuevaCantidad = parseInt(e.target.value);

    // Si el campo está vacío o no es un número válido, asignamos 0
    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
        nuevaCantidad = 0;
    }

    // Actualizar la lista Salida
    const item = Salida.find(item => item.id == id);
    if (item) {
        item.cantidad = nuevaCantidad;
        item.subtotal = nuevaCantidad * item.precio;
    }

    // Actualizar el subtotal en la tabla
    const subtotalCell = document.querySelector(`#row-${id} .subtotal`);
    if (subtotalCell && item) {
        subtotalCell.textContent = `S/. ${item.subtotal.toFixed(2)}`;
    }

    // Recalcular totales
    SumarTotal();
}


// ENVIAR DATOS
export function Enviar_Proforma() {

    Notiflix.Loading.dots('Cargando...'); // Muestra el loading con un mensaje

    // VALIDAR SI LOS CAMPOS ESTAN VACIOS
    if ($('#cliente').val() == "" && $('#fecha').val() == "") {
        // Alert('warning', 'Campos requeridos', 'ok', 'Debe rellenar todos los campos del formulario')
    } else {
        // VALIDAR QUE EL ARRAY TENGA ITEMS
        const data_proforma = {
            cod_proforma: document.getElementById('cod_proforma').value,
            cliente: document.getElementById('cliente').value,
            igv: document.getElementById('igv').value,
            subtotal: document.getElementById('subtotal').value,
            total: document.getElementById('total').value,
            fecha: document.getElementById('fecha').value,
        }

        const serializedData = JSON.stringify(data_proforma);

        // Construir la URL
        const scriptURL = `https://script.google.com/macros/s/AKfycbyC4woxbJSeSZnip08wLvlk3wPWPhVVZftCbDdfI7h1hI4Kv7ao33O0X1KYlDN1OApn/exec?action=create_proforma&proforma=${encodeURIComponent(serializedData)}`;

        fetch(scriptURL, { method: "GET" })
            .then((response) => {
                // Mostrar el loading
                // Aquí puedes hacer alguna validación o procesamiento si es necesario
                return response.json();
            })
            .then((data) => {
                // Notificación de éxito
                Notify('success', 'Datos enviados correctamente');

                // Recargar la página después de 1.5 segundos
                setTimeout(() => {
                    // Ocultar el loading después de la respuesta
                    Notiflix.Loading.remove();  // Esto elimina el loading

                    Read_Detalle_Boleta()
                    window.location = '/Proformas';
                }, 2000);
            })
            .catch((error) => {
                // En caso de error, mostrar una notificación de error
                Notiflix.Loading.remove();  // Ocultar el loading
                Notiflix.Notify.failure('Hubo un error al enviar los datos');
                console.error(error);
            });
    }
}