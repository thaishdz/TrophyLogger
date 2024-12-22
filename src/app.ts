import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import config from './config';
import logger from './config/logger';
import routes from './routes'; // Importa el archivo index.ts


export const init = () => {

    const app = express();
    
    const PORT = config.PORT;
    const DATABASE_URL = config.DATABASE_URL
    
    // Crea un stream que morgan usará para enviar los logs a Winston
    const stream = {
        write: (message: string) => logger.info(message.trim()) // Envía los logs de morgan a winston
    };
    
    // Middlewares
    app.use(cors()); // Permite TODAS las conexiones exteriores
    app.use(express.json());
    app.use(morgan('combined', { stream })); // Usa morgan con un formato específico para registrar las solicitudes HTTP
    
    // Routes
    app.use('/api/v1', routes); // Todas las rutas comenzarán con "/api/v1"
    
    mongoose.connect(DATABASE_URL)
        .then(() => logger.info('Conectado al Mongui ✅'))
        .catch(err => {
            logger.error('Fracaso al conectar a Mongui', err);
            process.exit(1); // Evita que el server siga intentando conectarse si hay un error crítico
        })
    
    
    app.listen(PORT, () =>{
        logger.info(`Poniendo la 👂 en el ${PORT}`);
    });
}
