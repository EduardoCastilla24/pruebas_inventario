document.getElementById('toggle-sidebar').addEventListener('click', function (event) {
    // Detiene la propagación del clic para que no cierre el sidebar inmediatamente
    event.stopPropagation();

    var sidebar = document.getElementById('sidebar');
    var content = document.getElementById('content');

    // Mostrar/ocultar el sidebar
    if (sidebar.classList.contains('-translate-x-[80rem]')) {
        // Si está visible, ocúltalo y quita el desenfoque
        sidebar.classList.remove('-translate-x-[80rem]');
        content.classList.add('blur-xs');
    } else {
        // Si está oculto, muéstralo y aplica el desenfoque
        sidebar.classList.add('-translate-x-[80rem]');
        content.classList.remove('blur-xs');
    }
});

document.getElementById('content').addEventListener('click', function () {
    var sidebar = document.getElementById('sidebar');
    var content = document.getElementById('content');

    // Solo quitar el desenfoque y ocultar el sidebar si está visible
        sidebar.classList.add('-translate-x-[80rem]');
        content.classList.remove('blur-xs');
});
