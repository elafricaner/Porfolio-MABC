/**
 * ============================================================================
 * ACTIVIDAD INTEGRADORA - UNIDAD 5: TYPESCRIPT
 * Definición de Tipos e Interfaces para el Modelo de Datos de Proyectos
 * ============================================================================
 * 
 * JUSTIFICACIÓN TEÓRICA PARA LA DEFENSA:
 * TypeScript es un superconjunto tipado de JavaScript que añade tipado estático.
 * 
 * Ventajas que aporta el tipado estático:
 * 1. Detección temprana de errores en tiempo de compilación/desarrollo antes de 
 *    que lleguen a ejecución.
 * 2. Autocompletado inteligente (IntelliSense) y refactorización segura.
 * 3. Documentación viva del código: cualquier desarrollador o docente sabe con
 *    certeza qué campos y qué tipos de datos admite un "Proyecto".
 * 
 * Diferencias clave entre TypeScript y JavaScript:
 * - JavaScript es de tipado dinámico y débil (los tipos se resuelven en ejecución).
 * - TypeScript es de tipado estático (se valida antes de compilar y se compila a JS estándar).
 */

// Tipo unión para representar estrictamente el estado de publicación
export type EstadoPublicacion = 'publicado' | 'borrador' | 'en_progreso';

// Interfaz que define la estructura exacta que debe tener cada proyecto
export interface IProyecto {
    _id?: string;                          // Identificador único (generado por MongoDB)
    nombre: string;                        // Nombre o título del proyecto
    descripcion: string;                   // Resumen o detalle del proyecto
    tecnologias: string[];                 // Lista de tecnologías utilizadas (ej: ['Laravel', 'MySQL'])
    imagen: string;                        // Ruta de la imagen local o URL remota
    estado: EstadoPublicacion;             // Estado de publicación con tipo unión
    categoria?: string;                    // Categoría opcional (ej: 'Web & Backend', 'Robótica & IoT')
    enlaceRepositorio?: string;            // Enlace al código fuente en GitHub u otro
    fechaCreacion?: Date;                  // Fecha de alta en la base de datos
}

// Tipo auxiliar para la creación de un proyecto (sin _id aún asignado)
export type NuevoProyectoDTO = Omit<IProyecto, '_id' | 'fechaCreacion'>;

// Tipo que representa una lista de proyectos (Array de proyectos)
export type ListaProyectos = IProyecto[];

// Respuesta estándar tipada para la API
export interface ApiResponse<T> {
    ok: boolean;
    mensaje: string;
    datos?: T;
    error?: string;
}

