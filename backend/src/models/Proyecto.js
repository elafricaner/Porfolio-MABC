import mongoose from 'mongoose';

/**
 * Esquema de Proyecto para MongoDB con Mongoose
 * Cumple con los requerimientos funcionales del PDF:
 * - Nombre
 * - Descripción
 * - Tecnologías utilizadas
 * - Imagen o enlace representativo
 * - Estado de publicación (publicado / borrador)
 */
const proyectoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del proyecto es obligatorio.'],
            trim: true,
        },
        descripcion: {
            type: String,
            required: [true, 'La descripción del proyecto es obligatoria.'],
            trim: true,
        },
        tecnologias: {
            type: [String],
            default: [],
        },
        imagen: {
            type: String,
            required: [true, 'La imagen o enlace es obligatorio.'],
            default: 'img/yerbatera.jpg',
        },
        estado: {
            type: String,
            enum: ['publicado', 'borrador', 'en_progreso'],
            default: 'publicado',
        },
        categoria: {
            type: String,
            default: 'Desarrollo Web',
            trim: true,
        },
        enlaceRepositorio: {
            type: String,
            default: '',
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const Proyecto = mongoose.model('Proyecto', proyectoSchema);

