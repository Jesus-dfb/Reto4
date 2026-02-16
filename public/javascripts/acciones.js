// validación de Bootstrap
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
        // Validar que las contraseñas coincidan
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

    // Limpiar campos si el usuario se equivoca
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            this.setCustomValidity('')
        })
    }
})()


// Capturar el juego a eliminar
document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', function() {
        const juegoId = this.getAttribute('data-juego-id');
        const juegoTitulo = this.getAttribute('data-juego-titulo');
            
        document.querySelector('#juegoNombre').textContent = juegoTitulo;
        document.querySelector('#formEliminar').action = '/eliminar/' + juegoId;
    });
});

// Funcionalidad de Favoritos con LocalStorage
(function() {
    'use strict';

    // Obtener el ID del usuario
    const userId = document.body.getAttribute('data-user-id') || null;
    
    if (!userId) {
        return; 
    }

    const FAVORITOS_KEY = `favoritos_${userId}`;

    // Función para obtener favoritos del LocalStorage
    function obtenerFavoritos() {
        const favoritosStr = localStorage.getItem(FAVORITOS_KEY);
        return favoritosStr ? JSON.parse(favoritosStr) : [];
    }

    // Función para guardar favoritos en LocalStorage
    function guardarFavoritos(favoritos) {
        localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
    }

    // Función para agregar/quitar favorito
    function toggleFavorito(juegoId) {
        const favoritos = obtenerFavoritos();
        const index = favoritos.indexOf(juegoId.toString());
        
        if (index > -1) {
            favoritos.splice(index, 1);
        } else {
            favoritos.push(juegoId.toString());
        }
        
        guardarFavoritos(favoritos);
        return favoritos;
    }


    // Filtrar juegos por favoritos si se solicita
    function filtrarPorFavoritos() {
        const urlParams = new URLSearchParams(window.location.search);
        const mostrarFavoritos = urlParams.get('favoritos') === 'true';
        
        const favoritos = obtenerFavoritos();
        const gameCards = document.querySelectorAll('.game-card');
        
        if (mostrarFavoritos) {
            gameCards.forEach(card => {
                const juegoId = card.querySelector('.btn-favorito')?.getAttribute('data-juego-id');
                if (juegoId && !favoritos.includes(juegoId)) {
                    card.closest('.col').style.display = 'none';
                } else {
                    card.closest('.col').style.display = '';
                }
            });
        } else {
            // Mostrar todos los juegos
            gameCards.forEach(card => {
                card.closest('.col').style.display = '';
            });
        }
    }

    // Al cargar la página, marcar favoritos existentes y filtrar
    function inicializarFavoritos() {
        const favoritos = obtenerFavoritos();
        document.querySelectorAll('.btn-favorito').forEach(btn => {
            const juegoId = btn.getAttribute('data-juego-id');
            if (juegoId && favoritos.includes(juegoId)) {
                const icono = btn.querySelector('i');
                if (icono) {
                    icono.classList.remove('bi-star');
                    icono.classList.add('bi-star-fill', 'text-warning');
                    // Si el botón tiene texto, también actualizarlo
                    const texto = btn.querySelector('span');
                    if (texto && btn.classList.contains('btn-outline-warning')) {
                        btn.classList.remove('btn-outline-warning');
                        btn.classList.add('btn-warning');
                    }
                }
            }
        });
        // Solo filtrar si estamos en la página de perfil
        if (document.querySelector('.game-card')) {
            filtrarPorFavoritos();
        }
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarFavoritos);
    } else {
        inicializarFavoritos();
    }

    // Manejar clic en botones de favorito (incluye los de la página de editar)
    document.querySelectorAll('.btn-favorito').forEach(btn => {
        btn.addEventListener('click', function() {
            const juegoId = this.getAttribute('data-juego-id');
            if (!juegoId) return;
            
            const favoritos = toggleFavorito(juegoId);
            const icono = this.querySelector('i');
            const texto = this.querySelector('span');
            
            if (favoritos.includes(juegoId)) {
                if (icono) {
                    icono.classList.remove('bi-star');
                    icono.classList.add('bi-star-fill', 'text-warning');
                }
                // Si es el botón de editar, cambiar estilo
                if (this.classList.contains('btn-outline-warning')) {
                    this.classList.remove('btn-outline-warning');
                    this.classList.add('btn-warning');
                }
            } else {
                if (icono) {
                    icono.classList.remove('bi-star-fill', 'text-warning');
                    icono.classList.add('bi-star');
                }
                // Si es el botón de editar, cambiar estilo
                if (this.classList.contains('btn-warning')) {
                    this.classList.remove('btn-warning');
                    this.classList.add('btn-outline-warning');
                }
            }
        });
    });
})();

// AJAX para formularios de creación y actualización
(function() {
    'use strict';

    // Formulario de creación de juego
    const formNuevoJuego = document.querySelector('form[action="/nuevo-juego"]');
    if (formNuevoJuego) {
        formNuevoJuego.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            const marcarFavorito = data.marcarFavorito === 'true';
            
            fetch('/api/nuevo-juego', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Si se marcó como favorito, guardarlo en LocalStorage
                    if (marcarFavorito && result.juegoId) {
                        const userId = document.body.getAttribute('data-user-id');
                        if (userId) {
                            const FAVORITOS_KEY = `favoritos_${userId}`;
                            const favoritosStr = localStorage.getItem(FAVORITOS_KEY);
                            const favoritos = favoritosStr ? JSON.parse(favoritosStr) : [];
                            if (!favoritos.includes(result.juegoId.toString())) {
                                favoritos.push(result.juegoId.toString());
                                localStorage.setItem(FAVORITOS_KEY, JSON.stringify(favoritos));
                            }
                        }
                    }
                    window.location.href = '/perfil';
                } else {
                    alert('Error: ' + (result.error || 'No se pudo crear el juego'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al crear el juego. Por favor, intenta de nuevo.');
            });
        });
    }

    // Formulario de edición de juego
    const formEditar = document.querySelector('form[action^="/editar/"]');
    if (formEditar) {
        formEditar.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            const juegoId = this.getAttribute('action').split('/').pop();
            
            fetch(`/api/editar/${juegoId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    const urlOrigen = data.urlOrigen || '/perfil';
                    window.location.href = urlOrigen;
                } else {
                    alert('Error: ' + (result.error || 'No se pudo actualizar el juego'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al actualizar el juego. Por favor, intenta de nuevo.');
            });
        });
    }
})();