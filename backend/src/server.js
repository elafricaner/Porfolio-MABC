import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { conectarDB } from './config/db.js';
import { router as proyectosRouter } from './routes/proyectos.js';
import { Proyecto } from './models/Proyecto.js';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json({ limit: '10mb' })); // Permite procesar payloads JSON e imágenes en Base64
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir la carpeta frontend como estática (opcional, permite abrir http://localhost:3000)
const rutaFrontend = path.join(__dirname, '../../frontend');
app.use(express.static(rutaFrontend));

/**
 * Función para sembrar los 3 proyectos iniciales si la base de datos está vacía.
 * Así la página nunca arranca en blanco la primera vez que se ejecuta.
 */
async function sembrarDatosIniciales() {
    try {
        const conteo = await Proyecto.countDocuments();
        if (conteo === 0) {
            console.log('[Sembrado] Base de datos vacía. Insertando proyectos iniciales...');
            await Proyecto.create([
                {
                    nombre: 'Yerbatera',
                    descripcion: 'Sistema de gestión web con control de roles de usuario, flujo administrativo y registro de operaciones.',
                    tecnologias: ['Laravel', 'MySQL', 'Tailwind CSS'],
                    imagen: 'img/yerbatera.jpg',
                    estado: 'publicado',
                    categoria: 'Web & Backend',
                    enlaceRepositorio: 'https://github.com/Yerbatera/Yerbatera-C-M',
                },
                {
                    nombre: 'YaPark',
                    descripcion: 'Propuesta de aplicación móvil para estacionamiento inteligente en Posadas mediante un modelo de suscripción.',
                    tecnologias: ['Figma', 'UX / UI', 'Análisis Financiero'],
                    imagen: 'img/yapark.jpg',
                    estado: 'publicado',
                    categoria: 'Mobile & Negocios',
                    enlaceRepositorio: '',
                },
                {
                    nombre: 'Robot Controlado por Bluetooth',
                    descripcion: 'Robot ensamblado con sensores ultrasónicos para detección de obstáculos y control asíncrono inalámbrico.',
                    tecnologias: ['Arduino Uno', 'HC-SR04', 'L298N'],
                    imagen: 'img/robot.jpg',
                    estado: 'publicado',
                    categoria: 'Robótica & IoT',
                    enlaceRepositorio: '',
                },
            ]);
            console.log('[Sembrado] ¡3 proyectos iniciales cargados con éxito en MongoDB!');
        }
    } catch (error) {
        console.warn('[Sembrado Aviso] No se pudieron insertar datos iniciales:', error.message);
    }
}

// Rutas de la API
app.use('/api/proyectos', proyectosRouter);

/**
 * POST /api/auth/verificar-dni
 * Endpoint simple para validar el DNI de acceso a la ventana modal de gestión
 */
app.post('/api/auth/verificar-dni', (req, res) => {
    const { dni } = req.body;
    const dniConfigurado = process.env.ADMIN_DNI || '12345678';

    if (!dni) {
        return res.status(400).json({ ok: false, mensaje: 'Por favor, ingresa tu DNI.' });
    }

    if (dni.toString().trim() === dniConfigurado.toString().trim()) {
        return res.status(200).json({ ok: true, mensaje: 'Acceso autorizado correctamente.' });
    }

    return res.status(401).json({ ok: false, mensaje: 'DNI incorrecto. Acceso denegado.' });
});

// Endpoint de estado del servidor
app.get('/api/estado', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Servidor Backend de Portfolio MABC funcionando correctamente.',
        timestamp: new Date().toISOString(),
    });
});

// Iniciar servidor y conectar base de datos
async function iniciarServidor() {
    await conectarDB();
    await sembrarDatosIniciales();

    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(` Servidor Backend activo en: http://localhost:${PORT}`);
        console.log(` API Endpoints: http://localhost:${PORT}/api/proyectos`);
        console.log(` Frontend disponible en: http://localhost:${PORT}`);
        console.log(`====================================================`);
    });
}

iniciarServidor();

