// Script para validación de Bootstrap
(function () {
    'use strict'

    // Obtener el formulario
    const form = document.querySelector('.needs-validation')
    if (!form) {
        return
    }

    const passwordInput = form.querySelector('input[name="password"]')
    const confirmPasswordInput = form.querySelector('input[name="confirmPassword"]')

    form.addEventListener('submit', function (event) {
        // Validar que las contraseñas coincidan si existen ambos campos
        if (passwordInput && confirmPasswordInput) {
            const password = passwordInput.value
            const confirmPassword = confirmPasswordInput.value
            
            if (password !== confirmPassword) {
                event.preventDefault()
                event.stopPropagation()
                confirmPasswordInput.setCustomValidity('Las contraseñas no coinciden')
            } else {
                confirmPasswordInput.setCustomValidity('')
            }
        }

        // Verificar validación del formulario
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
    }, false)

    // Limpiar error personalizado cuando el usuario escribe
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            this.setCustomValidity('')
        })
    }
})()


// Capturar el juego a eliminar cuando se abre el modal
document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', function() {
        const juegoId = this.getAttribute('data-juego-id');
        const juegoTitulo = this.getAttribute('data-juego-titulo');
            
        document.querySelector('#juegoNombre').textContent = juegoTitulo;
        document.querySelector('#formEliminar').action = '/eliminar/' + juegoId;
    });
});