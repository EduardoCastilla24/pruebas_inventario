import { Close_Modal } from "../Modal/Modal.js";
import { Notify } from "../notiflix/notify.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".form_element"); // Seleccionar el formulario

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevenir que el formulario se envíe de forma predeterminada
        const fecha = document.querySelector("#fecha_ingreso").value
        const año = fecha.split("-")[0]; // Obtener el año de la fecha
        const mes = fecha.split("-")[1]; // Obtener el mes de la fecha
        const dia = fecha.split("-")[2]; // Obtener el día de la fecha

        // Obtener los valores de los inputs
        const data = {
            cod_prod: document.querySelector("#cod_producto").value,
            producto: document.querySelector("#nombre_producto").value,
            marca: document.querySelector("#marca").value,
            stock: document.querySelector("#stock").value,
            unidad: document.querySelector("#unidad").value,
            precio_mayorista: document.querySelector("#precio_mayorista").value,
            precio_minorista: document.querySelector("#precio_minorista").value,
            fecha_ingreso: fecha,
            estado:`=IF(TODAY() >= DATE(YEAR(${año})+3, MONTH(${mes}), DAY(${dia})), "Obsoleto", "Activo")`
        }

        // Serializar el objeto `data` como JSON
        const serializedData = JSON.stringify(data);

        // Construir la URL
        const scriptUrl = "https://script.google.com/macros/s/AKfycbwVfdaEo3uCey7ZhOqIoxjZDxr0QqI99IHSQ6yPVCveqnkgGt_o_QwTmuD8gKX_D3_w/exec";

        try {
            Close_Modal('modal_product', 'form_modal_product');
            Notiflix.Loading.pulse();

            console.log(scriptUrl); // Loguear la URL para verificar si está correctamente formada
            console.log(data); // Loguear la URL para verificar si está correctamente formada

            fetch(scriptUrl, { method: "GET" })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error en la petición: ${response.status}`);
                    }

                    return response.json();
                })
                .then((result) => {
                    Notiflix.Loading.remove();

                    if (result.success) {
                        Notify('success', "Producto agregado correctamente");
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        const errorMessage = result && result.error ? result.error : "Error desconocido en la primera petición.";

                        Notify('failure', `Error al agregar producto. Detalles: ${errorMessage}`);
                    }
                })
                .catch((error) => {
                    Notiflix.Loading.remove();
                    console.error(error); // Loguear el error completo para depuración
                    Notify('failure', `Error en la petición: ${error.message}`);
                });
        } catch (error) {
            Notiflix.Loading.remove();
            console.error(error); // Loguear el error completo para depuración
            Notify('failure', `Error al procesar la solicitud: ${error.message}`);
        }
    });
});
