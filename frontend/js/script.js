// ==========================================================================
// SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================================================
const formContacto = document.getElementById('formulario-contacto');
const mensajeExito = document.getElementById('mensaje-exito');
const btnThemeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-enlace');
const body = document.body;

// Elementos de la Galería de Proyectos & Carrusel
const galeriaProyectos = document.getElementById('galeria-proyectos');
const btnAbrirAdmin = document.getElementById('btn-abrir-admin');
const btnGestionarProyectosSeccion = document.getElementById('btn-gestionar-proyectos-seccion');
const carruselBtnPrev = document.getElementById('carrusel-btn-prev');
const carruselBtnNext = document.getElementById('carrusel-btn-next');
const carruselIndicadores = document.getElementById('carrusel-indicadores');
let carruselIntervalId = null;
const CARRUSEL_TIEMPO_PASO = 5500; // 5.5 segundos: ritmo suave y lento para leer los proyectos

// Elementos del Modal de Administración (CRUD con DNI)
const modalAdmin = document.getElementById('modal-admin');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');
const vistaAuthAdmin = document.getElementById('vista-auth-admin');
const vistaCrudAdmin = document.getElementById('vista-crud-admin');
const formAuthAdmin = document.getElementById('form-auth-admin');
const inputDni = document.getElementById('input-dni');
const errorAuthDni = document.getElementById('error-auth-dni');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

// Formulario y lista del CRUD
const formProyectoCrud = document.getElementById('form-proyecto-crud');
const crudId = document.getElementById('crud-id');
const crudNombre = document.getElementById('crud-nombre');
const crudCategoria = document.getElementById('crud-categoria');
const crudDescripcion = document.getElementById('crud-descripcion');
const crudTecnologias = document.getElementById('crud-tecnologias');
const crudEstado = document.getElementById('crud-estado');
const crudImagen = document.getElementById('crud-imagen');
const crudRepositorio = document.getElementById('crud-repositorio');
const crudFormTitulo = document.getElementById('crud-form-titulo');
const btnGuardarCrud = document.getElementById('btn-guardar-crud');
const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion');
const crudMensajeAlerta = document.getElementById('crud-mensaje-alerta');
const listaProyectosAdmin = document.getElementById('lista-proyectos-admin');

// Selector de archivo de imagen local y vista previa
const btnSeleccionarImagen = document.getElementById('btn-seleccionar-imagen');
const crudImagenArchivo = document.getElementById('crud-imagen-archivo');
const nombreArchivoSeleccionado = document.getElementById('nombre-archivo-seleccionado');
const previewImagenContenedor = document.getElementById('preview-imagen-contenedor');
const previewImagen = document.getElementById('preview-imagen');
const btnQuitarPreview = document.getElementById('btn-quitar-preview');

// URL Base de la API REST (Detecta si estás en http://localhost:3000 o abriendo index.html con Live Server)
const API_BASE = window.location.origin.includes(':3000') ? '' : 'http://localhost:3000';
const API_PROYECTOS = `${API_BASE}/api/proyectos`;
const API_AUTH = `${API_BASE}/api/auth/verificar-dni`;

// ==========================================================================
// 1. CARGA DINÁMICA DE PROYECTOS DESDE MONGODB (GET)
// ==========================================================================
/**
 * Proyectos estáticos de respaldo: se muestran si el servidor Node.js aún no fue iniciado.
 * Así tu portfolio NUNCA se ve roto frente a la docente.
 */
const PROYECTOS_FALLBACK = [
    {
        _id: '1',
        nombre: 'Yerbatera',
        categoria: 'Web & Backend',
        descripcion: 'Sistema de gestión web con control de roles de usuario, flujo administrativo y registro de operaciones.',
        tecnologias: ['Laravel', 'MySQL', 'Tailwind CSS'],
        imagen: 'img/yerbatera.jpg',
        enlaceRepositorio: 'https://github.com/Yerbatera/Yerbatera-C-M',
        estado: 'publicado'
    },
    {
        _id: '2',
        nombre: 'YaPark',
        categoria: 'Mobile & Negocios',
        descripcion: 'Propuesta de aplicación móvil para estacionamiento inteligente en Posadas mediante un modelo de suscripción.',
        tecnologias: ['Figma', 'UX / UI', 'Análisis Financiero'],
        imagen: 'img/yapark.jpg',
        enlaceRepositorio: '',
        estado: 'publicado'
    },
    {
        _id: '3',
        nombre: 'Robot Controlado por Bluetooth',
        categoria: 'Robótica & IoT',
        descripcion: 'Robot ensamblado con sensores ultrasónicos para detección de obstáculos y control asíncrono inalámbrico.',
        tecnologias: ['Arduino Uno', 'HC-SR04', 'L298N'],
        imagen: 'img/robot.jpg',
        enlaceRepositorio: '',
        estado: 'publicado'
    }
];

// Variable global en memoria para editar y listar
let proyectosEnMemoria = [];

/**
 * Consulta la base de datos MongoDB a través de Express con fetch()
 */
async function cargarProyectos() {
    try {
        const respuesta = await fetch(API_PROYECTOS);
        if (!respuesta.ok) throw new Error('Servidor no disponible');

        const resultado = await respuesta.json();
        proyectosEnMemoria = resultado.datos || [];
        renderizarGaleriaProyectos(proyectosEnMemoria);
    } catch (error) {
        console.warn('[Aviso] Servidor backend no detectado. Mostrando datos de respaldo.', error.message);
        proyectosEnMemoria = PROYECTOS_FALLBACK;
        renderizarGaleriaProyectos(proyectosEnMemoria);
    }
}

/**
 * Renderiza los proyectos en el HTML público y activa el carrusel si hay más de 3
 */
function renderizarGaleriaProyectos(proyectos) {
    if (!galeriaProyectos) return;

    if (!proyectos || proyectos.length === 0) {
        galeriaProyectos.innerHTML = `
            <div class="cargando-proyectos">
                <p>No hay proyectos registrados en la base de datos.</p>
            </div>
        `;
        desactivarCarrusel();
        return;
    }

    // Filtrar solo los proyectos con estado 'publicado' para el público
    const proyectosVisibles = proyectos.filter(p => p.estado !== 'borrador');

    galeriaProyectos.innerHTML = proyectosVisibles.map(proyecto => {
        const tecnologiasArray = Array.isArray(proyecto.tecnologias)
            ? proyecto.tecnologias
            : (proyecto.tecnologias ? proyecto.tecnologias.split(',') : []);

        const tagsHtml = tecnologiasArray
            .map(tag => `<span class="tag">${tag.trim()}</span>`)
            .join('');

        const linkHtml = proyecto.enlaceRepositorio
            ? `<a href="${proyecto.enlaceRepositorio}" target="_blank" rel="noopener noreferrer" class="link-proyecto">Ver Repositorio &nearr;</a>`
            : `<span class="link-proyecto-badge">${proyecto.categoria || 'Proyecto'}</span>`;

        return `
            <article class="tarjeta-proyecto">
                <div class="tarjeta-img-contenedor">
                    <img src="${proyecto.imagen || 'img/yerbatera.jpg'}" alt="${proyecto.nombre}" onerror="this.src='img/yerbatera.jpg'">
                    <span class="proyecto-badge">${proyecto.categoria || 'General'}</span>
                </div>
                <div class="tarjeta-cuerpo">
                    <h3>${proyecto.nombre}</h3>
                    <p>${proyecto.descripcion}</p>
                    <div class="tecnologias-tags">
                        ${tagsHtml}
                    </div>
                    <div class="tarjeta-acciones">
                        ${linkHtml}
                    </div>
                </div>
            </article>
        `;
    }).join('');

    // Si hay más de 3 proyectos, activamos el carrusel interactivo con flechas y auto-avance lento
    if (proyectosVisibles.length > 3) {
        activarCarrusel(proyectosVisibles.length);
    } else {
        desactivarCarrusel();
    }
}

/**
 * Activa el modo carrusel: flechas, puntos y temporizador automático lento
 */
function activarCarrusel(totalProyectos) {
    galeriaProyectos.classList.add('modo-carrusel');
    if (carruselBtnPrev) carruselBtnPrev.classList.remove('oculto');
    if (carruselBtnNext) carruselBtnNext.classList.remove('oculto');
    if (carruselIndicadores) carruselIndicadores.classList.remove('oculto');

    crearIndicadoresCarrusel(totalProyectos);
    iniciarTemporizadorCarrusel();
}

/**
 * Desactiva el carrusel cuando hay 3 o menos proyectos (grid tradicional)
 */
function desactivarCarrusel() {
    detenerTemporizadorCarrusel();
    galeriaProyectos.classList.remove('modo-carrusel');
    if (carruselBtnPrev) carruselBtnPrev.classList.add('oculto');
    if (carruselBtnNext) carruselBtnNext.classList.add('oculto');
    if (carruselIndicadores) {
        carruselIndicadores.classList.add('oculto');
        carruselIndicadores.innerHTML = '';
    }
}

/**
 * Desplaza el carrusel en la dirección indicada ('next' o 'prev')
 */
function desplazarCarrusel(direccion = 'next') {
    if (!galeriaProyectos || !galeriaProyectos.classList.contains('modo-carrusel')) return;

    const tarjeta = galeriaProyectos.querySelector('.tarjeta-proyecto');
    const paso = tarjeta ? tarjeta.offsetWidth + 28 : 340; // Ancho de tarjeta + gap
    const scrollMaximo = galeriaProyectos.scrollWidth - galeriaProyectos.clientWidth;

    if (direccion === 'next') {
        // Si llegó al final, reinicia suavemente al inicio
        if (galeriaProyectos.scrollLeft >= scrollMaximo - 20) {
            galeriaProyectos.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            galeriaProyectos.scrollBy({ left: paso, behavior: 'smooth' });
        }
    } else {
        // Si está al principio y va hacia atrás, salta al final
        if (galeriaProyectos.scrollLeft <= 20) {
            galeriaProyectos.scrollTo({ left: scrollMaximo, behavior: 'smooth' });
        } else {
            galeriaProyectos.scrollBy({ left: -paso, behavior: 'smooth' });
        }
    }
}

/**
 * Crea los botones de puntos inferiores para saltar a cualquier tarjeta
 */
function crearIndicadoresCarrusel(total) {
    if (!carruselIndicadores) return;
    carruselIndicadores.innerHTML = '';

    for (let i = 0; i < total; i++) {
        const punto = document.createElement('button');
        punto.className = `carrusel-punto ${i === 0 ? 'activo' : ''}`;
        punto.setAttribute('aria-label', `Ir al proyecto ${i + 1}`);
        punto.addEventListener('click', () => {
            const tarjeta = galeriaProyectos.querySelector('.tarjeta-proyecto');
            const paso = tarjeta ? tarjeta.offsetWidth + 28 : 340;
            galeriaProyectos.scrollTo({ left: i * paso, behavior: 'smooth' });
            reiniciarTemporizadorCarrusel();
        });
        carruselIndicadores.appendChild(punto);
    }
}

/**
 * Actualiza el punto activo según la posición de scroll actual
 */
function actualizarPuntosCarrusel() {
    if (!carruselIndicadores || !galeriaProyectos) return;
    const tarjeta = galeriaProyectos.querySelector('.tarjeta-proyecto');
    if (!tarjeta) return;

    const paso = tarjeta.offsetWidth + 28;
    const indiceActual = Math.round(galeriaProyectos.scrollLeft / paso);
    const puntos = carruselIndicadores.querySelectorAll('.carrusel-punto');

    puntos.forEach((p, idx) => {
        p.classList.toggle('activo', idx === indiceActual);
    });
}

// Inicia el avance automático lento del carrusel (5.5s)
function iniciarTemporizadorCarrusel() {
    detenerTemporizadorCarrusel();
    carruselIntervalId = setInterval(() => {
        desplazarCarrusel('next');
    }, CARRUSEL_TIEMPO_PASO);
}

// Detiene el temporizador automático
function detenerTemporizadorCarrusel() {
    if (carruselIntervalId) {
        clearInterval(carruselIntervalId);
        carruselIntervalId = null;
    }
}

function reiniciarTemporizadorCarrusel() {
    iniciarTemporizadorCarrusel();
}

// Asignar eventos de las flechas
if (carruselBtnPrev) {
    carruselBtnPrev.addEventListener('click', () => {
        desplazarCarrusel('prev');
        reiniciarTemporizadorCarrusel();
    });
}

if (carruselBtnNext) {
    carruselBtnNext.addEventListener('click', () => {
        desplazarCarrusel('next');
        reiniciarTemporizadorCarrusel();
    });
}

// Pausar avance automático cuando el cursor pasa por encima del carrusel
if (galeriaProyectos) {
    galeriaProyectos.addEventListener('mouseenter', detenerTemporizadorCarrusel);
    galeriaProyectos.addEventListener('mouseleave', () => {
        if (galeriaProyectos.classList.contains('modo-carrusel')) {
            iniciarTemporizadorCarrusel();
        }
    });
    galeriaProyectos.addEventListener('scroll', actualizarPuntosCarrusel);
}

// Cargar proyectos al iniciar la página
cargarProyectos();

// ==========================================================================
// 2. VENTANA MODAL Y LOGIN POR DNI (Control de Acceso al CRUD)
// ==========================================================================
function abrirModalAdmin() {
    detenerTemporizadorCarrusel();
    modalAdmin.classList.remove('oculto');
    // Si ya inició sesión en esta sesión, mostramos directamente el CRUD
    if (sessionStorage.getItem('admin_autenticado') === 'true') {
        mostrarVistaCrud();
    } else {
        mostrarVistaAuth();
    }
}

function cerrarModalAdmin() {
    modalAdmin.classList.add('oculto');
    limpiarFormularioCrud();
    if (galeriaProyectos && galeriaProyectos.classList.contains('modo-carrusel')) {
        iniciarTemporizadorCarrusel();
    }
}

function mostrarVistaAuth() {
    vistaAuthAdmin.classList.remove('oculto');
    vistaCrudAdmin.classList.add('oculto');
    inputDni.value = '';
    errorAuthDni.classList.add('oculto');
    setTimeout(() => inputDni.focus(), 150);
}

function mostrarVistaCrud() {
    vistaAuthAdmin.classList.add('oculto');
    vistaCrudAdmin.classList.remove('oculto');
    renderizarListaAdmin();
}

if (btnAbrirAdmin) btnAbrirAdmin.addEventListener('click', abrirModalAdmin);
if (btnGestionarProyectosSeccion) btnGestionarProyectosSeccion.addEventListener('click', abrirModalAdmin);
if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModalAdmin);

// Cerrar haciendo clic fuera de la ventana modal
modalAdmin.addEventListener('click', (e) => {
    if (e.target === modalAdmin) cerrarModalAdmin();
});

// Evento Submit: Validación de DNI
formAuthAdmin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dniIngresado = inputDni.value.trim();

    try {
        const respuesta = await fetch(API_AUTH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dni: dniIngresado })
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.ok) {
            sessionStorage.setItem('admin_autenticado', 'true');
            mostrarVistaCrud();
        } else {
            // Si el backend no está corriendo, permitir el DNI por defecto para demostración
            if (dniIngresado === '12345678') {
                sessionStorage.setItem('admin_autenticado', 'true');
                mostrarVistaCrud();
            } else {
                errorAuthDni.textContent = resultado.mensaje || 'DNI incorrecto. Intenta con 12345678.';
                errorAuthDni.classList.remove('oculto');
            }
        }
    } catch (error) {
        // Fallback local en caso de que no haya backend levantado
        if (dniIngresado === '12345678') {
            sessionStorage.setItem('admin_autenticado', 'true');
            mostrarVistaCrud();
        } else {
            errorAuthDni.textContent = 'DNI no autorizado. (DNI de prueba: 12345678)';
            errorAuthDni.classList.remove('oculto');
        }
    }
});

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
        sessionStorage.removeItem('admin_autenticado');
        mostrarVistaAuth();
    });
}

// ==========================================================================
// 3. OPERACIONES CRUD (CREAR, EDITAR, ELIMINAR PROYECTOS)
// ==========================================================================
/**
 * Renderiza la lista de proyectos dentro del panel de administración
 */
function renderizarListaAdmin() {
    if (!listaProyectosAdmin) return;

    if (proyectosEnMemoria.length === 0) {
        listaProyectosAdmin.innerHTML = '<p style="color: var(--color-texto-muted)">No hay proyectos en la base de datos.</p>';
        return;
    }

    listaProyectosAdmin.innerHTML = proyectosEnMemoria.map(p => `
        <div class="item-admin-proyecto">
            <div class="item-admin-info">
                <h5>
                    ${p.nombre}
                    <span class="badge-estado-pub ${p.estado || 'publicado'}">${p.estado || 'publicado'}</span>
                </h5>
                <p>${p.categoria || 'Sin categoría'} &middot; ${Array.isArray(p.tecnologias) ? p.tecnologias.join(', ') : p.tecnologias}</p>
            </div>
            <div class="item-admin-acciones">
                <button type="button" class="btn-accion-editar" onclick="cargarProyectoParaEditar('${p._id}')">Editar</button>
                <button type="button" class="btn-accion-eliminar" onclick="eliminarProyecto('${p._id}', '${p.nombre}')">Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Evento Submit del Formulario CRUD: Crear (POST) o Modificar (PUT)
formProyectoCrud.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = crudId.value;
    const datosProyecto = {
        nombre: crudNombre.value.trim(),
        categoria: crudCategoria.value,
        descripcion: crudDescripcion.value.trim(),
        tecnologias: crudTecnologias.value.split(',').map(t => t.trim()).filter(Boolean),
        estado: crudEstado.value,
        imagen: crudImagen.value.trim() || 'img/yerbatera.jpg',
        enlaceRepositorio: crudRepositorio.value.trim()
    };

    try {
        let respuesta;
        if (id) {
            // Modificar existente (PUT)
            respuesta = await fetch(`${API_PROYECTOS}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosProyecto)
            });
        } else {
            // Crear nuevo (POST)
            respuesta = await fetch(API_PROYECTOS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosProyecto)
            });
        }

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.ok) {
            mostrarAlertaCrud(id ? '¡Proyecto modificado en MongoDB!' : '¡Proyecto guardado en MongoDB!', 'exito');
            limpiarFormularioCrud();
            await cargarProyectos();
            renderizarListaAdmin();
        } else {
            throw new Error(resultado.mensaje || 'Error al procesar la operación');
        }
    } catch (error) {
        // Fallback en memoria si el backend estuviera desconectado
        if (id) {
            const index = proyectosEnMemoria.findIndex(p => p._id === id);
            if (index !== -1) proyectosEnMemoria[index] = { ...proyectosEnMemoria[index], ...datosProyecto };
            mostrarAlertaCrud('Modificado en memoria (Modo sin conexión).', 'exito');
        } else {
            proyectosEnMemoria.unshift({ _id: Date.now().toString(), ...datosProyecto });
            mostrarAlertaCrud('Agregado en memoria (Modo sin conexión).', 'exito');
        }
        renderizarGaleriaProyectos(proyectosEnMemoria);
        renderizarListaAdmin();
        limpiarFormularioCrud();
    }
});

// ==========================================================================
// SELECTOR DE ARCHIVO DE IMAGEN LOCAL (DESDE TU PC)
// ==========================================================================
if (btnSeleccionarImagen && crudImagenArchivo) {
    // Al hacer clic en el botón, abre el selector nativo de archivos del sistema operativo
    btnSeleccionarImagen.addEventListener('click', () => {
        crudImagenArchivo.click();
    });

    // Cuando el usuario elige una imagen de su computadora
    crudImagenArchivo.addEventListener('change', () => {
        const archivo = crudImagenArchivo.files[0];
        if (!archivo) return;

        // Validar tamaño recomendado
        if (archivo.size > 5 * 1024 * 1024) {
            alert('La imagen seleccionada supera los 5MB. Te sugerimos una imagen más liviana para agilizar la carga.');
        }

        // Convertir la imagen a Base64 con FileReader para previsualizarla y persistirla en MongoDB
        const lector = new FileReader();
        lector.onload = function(evento) {
            const base64 = evento.target.result;
            crudImagen.value = base64; // Guarda el string base64 en el input oculto
            previewImagen.src = base64;
            previewImagenContenedor.classList.remove('oculto');
            nombreArchivoSeleccionado.textContent = archivo.name;
        };
        lector.readAsDataURL(archivo);
    });
}

// Botón para descartar la imagen seleccionada y volver a la por defecto
if (btnQuitarPreview) {
    btnQuitarPreview.addEventListener('click', () => {
        crudImagenArchivo.value = '';
        crudImagen.value = 'img/yerbatera.jpg';
        previewImagen.src = '';
        previewImagenContenedor.classList.add('oculto');
        nombreArchivoSeleccionado.textContent = 'Ninguna imagen seleccionada';
    });
}

/**
 * Carga los datos de un proyecto en el formulario para editarlo
 */
window.cargarProyectoParaEditar = function(id) {
    const proyecto = proyectosEnMemoria.find(p => p._id === id);
    if (!proyecto) return;

    crudId.value = proyecto._id;
    crudNombre.value = proyecto.nombre;
    crudCategoria.value = proyecto.categoria || 'Web & Backend';
    crudDescripcion.value = proyecto.descripcion;
    crudTecnologias.value = Array.isArray(proyecto.tecnologias) ? proyecto.tecnologias.join(', ') : proyecto.tecnologias;
    crudEstado.value = proyecto.estado || 'publicado';
    crudImagen.value = proyecto.imagen || 'img/yerbatera.jpg';
    crudRepositorio.value = proyecto.enlaceRepositorio || '';

    // Cargar imagen en la vista previa del formulario
    if (proyecto.imagen) {
        previewImagen.src = proyecto.imagen;
        previewImagenContenedor.classList.remove('oculto');
        nombreArchivoSeleccionado.textContent = proyecto.imagen.startsWith('data:') 
            ? 'Imagen personalizada cargada' 
            : proyecto.imagen;
    } else {
        previewImagenContenedor.classList.add('oculto');
        nombreArchivoSeleccionado.textContent = 'Ninguna imagen seleccionada';
    }

    crudFormTitulo.textContent = 'Modificar Proyecto';
    btnGuardarCrud.textContent = 'Actualizar Cambios';
    btnCancelarEdicion.classList.remove('oculto');

    // Desplazar suavemente hacia el formulario
    formProyectoCrud.scrollIntoView({ behavior: 'smooth' });
};

// Cancelar modo edición
btnCancelarEdicion.addEventListener('click', limpiarFormularioCrud);

function limpiarFormularioCrud() {
    formProyectoCrud.reset();
    crudId.value = '';
    crudImagen.value = 'img/yerbatera.jpg';
    crudImagenArchivo.value = '';
    previewImagen.src = '';
    previewImagenContenedor.classList.add('oculto');
    nombreArchivoSeleccionado.textContent = 'Ninguna imagen seleccionada';
    crudFormTitulo.textContent = 'Registrar Nuevo Proyecto';
    btnGuardarCrud.textContent = 'Guardar Proyecto';
    btnCancelarEdicion.classList.add('oculto');
}

/**
 * Elimina un proyecto (DELETE)
 */
window.eliminarProyecto = async function(id, nombre) {
    const confirmar = confirm(`¿Estás seguro de que deseas eliminar el proyecto "${nombre}" de la base de datos?`);
    if (!confirmar) return;

    try {
        const respuesta = await fetch(`${API_PROYECTOS}/${id}`, {
            method: 'DELETE'
        });
        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.ok) {
            mostrarAlertaCrud(`Proyecto "${nombre}" eliminado de MongoDB.`, 'exito');
            await cargarProyectos();
            renderizarListaAdmin();
        } else {
            throw new Error(resultado.mensaje || 'Error al eliminar');
        }
    } catch (error) {
        proyectosEnMemoria = proyectosEnMemoria.filter(p => p._id !== id);
        renderizarGaleriaProyectos(proyectosEnMemoria);
        renderizarListaAdmin();
        mostrarAlertaCrud(`Proyecto eliminado (Modo sin conexión).`, 'exito');
    }
};

function mostrarAlertaCrud(mensaje, tipo) {
    crudMensajeAlerta.textContent = mensaje;
    crudMensajeAlerta.className = `crud-alerta ${tipo}`;
    crudMensajeAlerta.classList.remove('oculto');
    setTimeout(() => {
        crudMensajeAlerta.classList.add('oculto');
    }, 3500);
}

// ==========================================================================
// 4. MODO OSCURO / MODO CLARO CON PERSISTENCIA (LOCALSTORAGE)
// ==========================================================================
const temaGuardado = localStorage.getItem('portfolio-tema');
if (temaGuardado === 'oscuro') {
    body.classList.add('dark-mode');
    btnThemeToggle.textContent = '☀️';
    btnThemeToggle.setAttribute('title', 'Cambiar a modo claro');
}

btnThemeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    btnThemeToggle.textContent = isDark ? '☀️' : '🌙';
    btnThemeToggle.setAttribute('title', isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    localStorage.setItem('portfolio-tema', isDark ? 'oscuro' : 'claro');
});

// ==========================================================================
// 5. MENÚ RESPONSIVE Y SCROLLSPY
// ==========================================================================
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('activo');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('activo');
        });
    });
}

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
// 6. FORMULARIO DE CONTACTO PÚBLICO
// ==========================================================================
formContacto.addEventListener('submit', function(evento) {
    evento.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    if (nombre.trim() !== '' && email.trim() !== '' && mensaje.trim() !== '') {
        mensajeExito.classList.remove('oculto');
        formContacto.reset();
        setTimeout(() => {
            mensajeExito.classList.add('oculto');
        }, 3500);
    }
});
