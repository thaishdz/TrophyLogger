import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import config from ".";
import logger from "./logger";
import routes from "../routes"; // Importa el archivo index.ts

// Configura y prepara la aplicación Express con todos sus middlewares y rutas
export const createApp = () => {
  const app = express();

  // Configura un stream personalizado para que morgan envíe sus logs a Winston
  const stream = {
    write: (message: string) => logger.info(message.trim()), // Envía los logs de morgan a winston
  };

  // Configura middlewares
  app.use(cors()); // Permite TODAS las conexiones exteriores
  app.use(express.json()); // Analiza el body de solicitud JSON automáticamente
  app.use(morgan("combined", { stream })); // Registra detalles de cada solicitud HTTP usando Winston
  app.use("/api/v1", routes); // Todas las rutas comenzarán con "/api/v1"

  return app; // Devuelve la aplicación configurada
};

// Configura el server
export const init = async () => {
  const app = createApp();
  const PORT = config.PORT;
  const DATABASE_URL = config.DATABASE_URL;

  try {
    await mongoose.connect(DATABASE_URL);
    logger.info("Conectado al Mongui ✅");

    // Inicia el servidor HTTP para escuchar solicitudes
    app.listen(PORT, () => {
      logger.info(`Poniendo la 👂 en el ${PORT}`);
    });
  } catch (error) {
    logger.error("Fracaso al conectar a Mongui", error);
    process.exit(1); // Evita que el server siga intentando conectarse si hay un error crítico
  }

  return app; // En caso de necesitar la referencia a la app en algún momento
};
