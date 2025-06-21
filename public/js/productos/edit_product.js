import { Close_Modal } from "../Modal/Modal.js";
import { Notify } from "../notiflix/notify.js";

const scriptUrl = "https://script.google.com/macros/s/AKfycbwVfdaEo3uCey7ZhOqIoxjZDxr0QqI99IHSQ6yPVCveqnkgGt_o_QwTmuD8gKX_D3_w/exec";

var cod_prod =  document.querySelector("#cod_producto" + '_edit');
var producto =  document.querySelector("#nombre_producto" + '_edit');
var unidad =  document.querySelector("#unidad" + '_edit');
var stock =  document.querySelector("#stock" + '_edit');
var marca =  document.querySelector("#marca" + '_edit');
var precio_mayorista =  document.querySelector("#precio_mayorista" + '_edit');
var precio_minorista =  document.querySelector("#precio_minorista" + '_edit');
var fecha_ingreso =  document.querySelector("#fecha_ingreso" + '_edit')
var estado =  document.querySelector("#estado" + '_edit')


export function Edit_Product(codigo_producto){
    const params = new URLSearchParams({
        action: "search_product",
        cod_producto: codigo_producto
    });

    Notiflix.Loading.dots();

    fetch(`${scriptUrl}?${params}`, { method: "GET" })
    .then(response => response.json())
    .then(response => {

        Notiflix.Loading.remove();

        if (response.success) {
            const modal = document.getElementById('modal_product_edit');
            modal.showModal();

            cod_prod.value = response.data.cod_prod;
            producto.value = response.data.producto;
            unidad.value = response.data.unidad;
            stock.value = response.data.stock;
            marca.value = response.data.marca;
            precio_mayorista.value = response.data.precio_mayorista;
            precio_minorista.value = response.data.precio_minorista;
            fecha_ingreso.value = response.data.fecha_ingreso.split("T")[0];
            estado.value = response.data.estado;
        }

    })
}


document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#form_modal_product_edit"); // Seleccionar el formulario

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevenir que el formulario se envĂ­e de forma predeterminada

        const data = {
            cod_prod: cod_prod.value,
            producto: producto.value,
            unidad: unidad.value,
            stock: stock.value,
            marca: marca.value,
            precio_mayorista: precio_mayorista.value,
            precio_minorista: precio_minorista.value,
            fecha_ingreso: fecha_ingreso.value
        }

        const serializedData = JSON.stringify(data);

        Close_Modal('modal_product_edit', 'form_modal_product_edit')
        Notiflix.Loading.pulse();

        fetch(scriptUrl, { method: "GET" })
        .then(response => response.json())
        .then(response => {
            Notiflix.Loading.remove();
            if (response.success) {
                Notify('success', "Producto actualizado correctamente");
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                console.log(response);
            }
        })
    })
});
