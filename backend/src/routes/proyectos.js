import express from 'express';
import { Proyecto } from '../models/Proyecto.js';

export const router = express.Router();

/**
 * Normaliza las tecnologías recibidas para guardarlas siempre como Array de strings
 */
function normalizarTecnologias(tecnologias) {
    if (Array.isArray(tecnologias)) {
        return tecnologias.map(t => t.trim()).filter(Boolean);
    }
    if (typeof tecnologias === 'string') {
        return tecnologias.split(',').map(t => t.trim()).filter(Boolean);
    }
    return [];
}

/**
 * GET /api/proyectos
 * Consultar: Obtiene todos los proyectos almacenados en la base de datos
 */
router.get('/', async (req, res) => {
    try {
        const { estado, todos } = req.query;

        // Si la petición viene del frontend público y no especifica 'todos=true', 
        // podemos filtrar por estado publicado o devolver todos ordenados
        const filtro = {};
        if (estado) {
            filtro.estado = estado;
        }

        const proyectos = await Proyecto.find(filtro).sort({ createdAt: -1 });

        res.status(200).json({
            ok: true,
            total: proyectos.length,
            datos: proyectos,
        });
    } catch (error) {
        console.error('[GET /api/proyectos Error]:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al consultar los proyectos en la base de datos.',
            error: error.message,
        });
    }
});

/**
 * GET /api/proyectos/:id
 * Consultar un único proyecto por su ID de MongoDB
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const proyecto = await Proyecto.findById(id);

        if (!proyecto) {
            return res.status(404).json({
                ok: false,
                mensaje: `No se encontró ningún proyecto con el ID: ${id}`,
            });
        }

        res.status(200).json({
            ok: true,
            datos: proyecto,
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            mensaje: 'ID de proyecto inválido.',
            error: error.message,
        });
    }
});

/**
 * POST /api/proyectos
 * Crear: Registra un nuevo proyecto en MongoDB
 */
router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, tecnologias, imagen, estado, categoria, enlaceRepositorio } = req.body;

        // Validación de datos básicos recibidos (Punto B del PDF)
        if (!nombre || !nombre.trim()) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El nombre del proyecto es obligatorio.',
            });
        }
        if (!descripcion || !descripcion.trim()) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La descripción del proyecto es obligatoria.',
            });
        }

        const nuevoProyecto = new Proyecto({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            tecnologias: normalizarTecnologias(tecnologias),
            imagen: imagen ? imagen.trim() : 'img/yerbatera.jpg',
            estado: estado || 'publicado',
            categoria: categoria ? categoria.trim() : 'Desarrollo Web',
            enlaceRepositorio: enlaceRepositorio ? enlaceRepositorio.trim() : '',
        });

        const proyectoGuardado = await nuevoProyecto.save();

        res.status(201).json({
            ok: true,
            mensaje: '¡Proyecto creado y persistido con éxito en MongoDB!',
            datos: proyectoGuardado,
        });
    } catch (error) {
        console.error('[POST /api/proyectos Error]:', error);
        res.status(400).json({
            ok: false,
            mensaje: 'Error al registrar el nuevo proyecto.',
            error: error.message,
        });
    }
});

/**
 * PUT /api/proyectos/:id
 * Modificar: Actualiza la información de un proyecto existente
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, tecnologias, imagen, estado, categoria, enlaceRepositorio } = req.body;

        const camposActualizados = {};
        if (nombre !== undefined) camposActualizados.nombre = nombre.trim();
        if (descripcion !== undefined) camposActualizados.descripcion = descripcion.trim();
        if (tecnologias !== undefined) camposActualizados.tecnologias = normalizarTecnologias(tecnologias);
        if (imagen !== undefined) camposActualizados.imagen = imagen.trim();
        if (estado !== undefined) camposActualizados.estado = estado;
        if (categoria !== undefined) camposActualizados.categoria = categoria.trim();
        if (enlaceRepositorio !== undefined) camposActualizados.enlaceRepositorio = enlaceRepositorio.trim();

        const proyectoActualizado = await Proyecto.findByIdAndUpdate(
            id,
            camposActualizados,
            { new: true, runValidators: true }
        );

        if (!proyectoActualizado) {
            return res.status(404).json({
                ok: false,
                mensaje: `No se encontró el proyecto con ID: ${id} para actualizar.`,
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'Proyecto modificado exitosamente.',
            datos: proyectoActualizado,
        });
    } catch (error) {
        console.error('[PUT /api/proyectos Error]:', error);
        res.status(400).json({
            ok: false,
            mensaje: 'Error al modificar el proyecto.',
            error: error.message,
        });
    }
});

/**
 * DELETE /api/proyectos/:id
 * Eliminar: Quita un proyecto registrado de la base de datos
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const proyectoEliminado = await Proyecto.findByIdAndDelete(id);

        if (!proyectoEliminado) {
            return res.status(404).json({
                ok: false,
                mensaje: `No se encontró ningún proyecto con el ID: ${id} para eliminar.`,
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: `El proyecto "${proyectoEliminado.nombre}" fue eliminado correctamente.`,
            datos: proyectoEliminado,
        });
    } catch (error) {
        console.error('[DELETE /api/proyectos Error]:', error);
        res.status(400).json({
            ok: false,
            mensaje: 'Error al eliminar el proyecto.',
            error: error.message,
        });
    }
});

