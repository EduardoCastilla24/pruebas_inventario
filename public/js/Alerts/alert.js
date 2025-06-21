function Alertas(form_id, values) {
    'use strict'

    const forms = document.querySelectorAll('#'+form_id)

    Array.prototype.slice.call(forms)
        .forEach(function(form){
            form.addEventListener('submit', function(event){
                event.preventDefault()
                event.stopPropagation()

                Swal.fire({
                    title: values.title,
                    text: values.text,
                    icon: values.type,
                    showCancelButton: values.confirmation ? true : false,
                    confirmButtonText: values.confirmation ? 'Sí, confirmar!' : 'Aceptar',
                    cancelButtonText: values.confirmation ? 'Cancelar' : null
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Si es una acción de eliminación, mostramos la segunda alerta
                        if (values.type === 'warning' && values.title.includes('Cerrar Sesión')) {
                            // Para el caso específico de cerrar sesión, solo enviamos el formulario
                            form.submit();
                        } else {
                            // Para otras acciones, mostramos la segunda alerta
                            Swal.fire(
                                '¡Hecho!',
                                'Operación realizada con éxito',
                                'success'
                            ).then(function(){
                                form.submit();
                            });
                        }
                    }
                })
            }, false)
        })
}
