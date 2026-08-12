import mongoose from 'mongoose';
import app from './app'
import config from './config'
import logger from "./config/logger";

async function runServer() {
    try {
        await mongoose.connect(config.DATABASE_URI);
        logger.info('Conectado a MongoDB');

        app.listen(config.PORT, () => {
            logger.info(`Poniendo la 👂 en el ${config.PORT}`);
        });
    } catch (error) {
        logger.error('No se pudo conectar a MongoDB:', error);
        process.exit(1);
    }
}

runServer();
