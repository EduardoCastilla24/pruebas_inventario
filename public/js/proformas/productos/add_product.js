import { searchProduct } from "./search_product.js";

export function addProduct(input) {
    const input_producto = document.getElementById('producto');
    const input_precio = document.getElementById('precio');

    input.addEventListener('blur', ()=>{
        input_producto.value = ""
        input_precio.value = ""

        const productos = searchProduct(input);

        input_producto.value = productos.nombre;
        input_precio.value = productos.precio_minorista
    }); // cuando se sale del input
    // O si prefieres al presionar Enter:
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const productos = searchProduct(input);

            input_producto.value = productos.nombre;
            input_precio.value = productos.precio_minorista
        }
    });

}

