import mongoose from 'mongoose';

/**
 * Conexión a la base de datos MongoDB (Local o Atlas)
 */
export async function conectarDB() {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_mabc';

    try {
        const conn = await mongoose.connect(mongoUri);
        console.log(`[MongoDB] Conectado exitosamente en: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error('[MongoDB Error] No se pudo conectar a MongoDB:', error.message);
        console.warn('[MongoDB Aviso] Asegúrate de que el servicio local de MongoDB esté iniciado o revisa el MONGO_URI en el archivo .env.');
    }
}

