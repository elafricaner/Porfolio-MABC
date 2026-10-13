// Selección de elementos del DOM
const formContacto = document.getElementById('formulario-contacto');
const mensajeExito = document.getElementById('mensaje-exito');
const btnThemeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-enlace');
const body = document.body;

// ==========================================================================
// TEMA (MODO OSCURO / MODO CLARO) CON PERSISTENCIA
// ==========================================================================
// Cargar preferencia guardada en localStorage
const temaGuardado = localStorage.getItem('portfolio-tema');
if (temaGuardado === 'oscuro') {
    body.classList.add('dark-mode');
    btnThemeToggle.textContent = '☀️';
    btnThemeToggle.setAttribute('title', 'Cambiar a modo claro');
}

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
    
    // Guardar preferencia del usuario en el almacenamiento local
    localStorage.setItem('portfolio-tema', isDark ? 'oscuro' : 'claro');
});

// ==========================================================================
// MENÚ RESPONSIVE PARA DISPOSITIVOS MÓVILES
// ==========================================================================
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('activo');
    });

    // Cerrar el menú al hacer clic en cualquier enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('activo');
        });
    });
}

// ==========================================================================
// INDICADOR DINÁMICO DE NAVEGACIÓN ACTIVA EN SCROLL
// ==========================================================================
const secciones = document.querySelectorAll('section[id]');
window.addEventListener('scroll', function() {
    const scrollPos = window.scrollY + 100;

    secciones.forEach(seccion => {
        const top = seccion.offsetTop;
        const height = seccion.offsetHeight;
        const id = seccion.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ==========================================================================
// EVENTO SUBMIT: VALIDACIÓN DE INFORMACIÓN Y PREVENCIÓN DE RECARGA
// ==========================================================================
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
        
        // Limpiar el formulario
        formContacto.reset();

        // Ocultar el mensaje después de 3.5 segundos con transición suave
        setTimeout(() => {
            mensajeExito.classList.add('oculto');
        }, 3500);
    }
});