import {Notify} from  '../../Alerts/notify.js';

export function searchProduct(cod_producto) {
    // Validar que el valor del input sea un número válido
    const codigo = parseInt(cod_producto.value);

    if (!codigo || isNaN(codigo)) {
        Notify('failure', 'Debe de agregar un cod. de barras', 'center-bottom', 'from-bottom');
        return null;
    }

    // Obtener productos del localStorage
    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    // Validar si existen productos en el localStorage
    if (productos.length === 0) {
        Notify('failure', 'No hay productos',  'center-bottom', 'from-bottom');
        return null;
    }

    // Buscar el producto por su código de barras
    const producto = productos.find(p => p.cod_prod === codigo);

    // Si se encuentra el producto, devolverlo, si no, mostrar un mensaje de error
    if (producto) {
        console.log('Producto encontrado:', producto);
        return producto;
    } else {
        Notify('failure', 'Producto no encontrado',  'center-bottom', 'from-bottom');
        return null;
    }
}
