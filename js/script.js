// Selección de elementos del DOM
const formContacto = document.getElementById('formulario-contacto');
const mensajeExito = document.getElementById('mensaje-exito');
const btnThemeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Evento Submit: Validación de información y prevención de recarga
formContacto.addEventListener('submit', function(evento) {
    evento.preventDefault(); // Evita que la página se recargue

    // Obtener valores (Variables y constantes)
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    // Estructura de control para validar
    if (nombre.trim() !== '' && email.trim() !== '' && mensaje.trim() !== '') {
        // Modificar clases para mostrar elemento
        mensajeExito.classList.remove('oculto');
        mensajeExito.style.color = 'green';
        
        // Limpiar el formulario
        formContacto.reset();

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            mensajeExito.classList.add('oculto');
        }, 3000);
    }
});

// Evento Click: Cambiar tema e ícono (Modo oscuro / Modo claro)
btnThemeToggle.addEventListener('click', function() {
    // Alternar la clase 'dark-mode' en el body
    body.classList.toggle('dark-mode');
    
    // Comprobar si el modo oscuro está activo
    const isDark = body.classList.contains('dark-mode');
    
    // Operador ternario para alternar el ícono:
    // Si está en modo oscuro muestra el sol (☀️) para volver a claro; si está en claro muestra la luna (🌙)
    btnThemeToggle.textContent = isDark ? '☀️' : '🌙';
    btnThemeToggle.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
});