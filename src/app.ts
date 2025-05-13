import express from "express";
import cors from "cors";
import morgan from "morgan";

import logger from "./config/logger";
import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();
  
// Configura un stream personalizado para que morgan envíe sus logs a Winston
const stream = {
  write: (message: string) => logger.info(message.trim()), // Envía los logs de morgan a winston
};

// Routes
app.use("/api/v1", routes);

// Middlewares
app.use(cors()); // Permite TODAS las conexiones exteriores
app.use(express.json()); // Middlware de entrada de datos,analiza el body para ver si es un JSON y lo parsea para el controller
app.use(morgan("combined", { stream })); // Registra detalles de cada solicitud HTTP usando Winston

// Global error handler (should be after routes)
app.use(errorMiddleware); 

export default app;