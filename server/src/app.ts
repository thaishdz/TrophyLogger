import express from "express";
import cors from "cors";
import morgan from "morgan";
import { passport } from "./config/passport";
import session from "express-session";

import logger from "./config/logger";
import routes from "./routes";
import authRoutes from "./routes/auth"
import errorMiddleware from "./middlewares/error";

const app = express();

// Configura un stream personalizado para que morgan envíe sus logs a Winston
const stream = {
  write: (message: string) => logger.info(message.trim()), // Envía los logs de morgan a winston
};

// Debe ir antes de la rutas para protegerlas
app.use(cors()); // Permite TODAS las conexiones exteriores en PROD cambiarlo
app.use(express.json()); // Middlware de entrada de datos,analiza el body para ver si es un JSON y lo parsea para el controller
app.use(morgan("combined", { stream })); // Registra detalles de cada solicitud HTTP usando Winston

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use("/api/v1", routes);
app.use("/auth", authRoutes);


// Global error handler (should be after routes)
app.use(errorMiddleware);

export default app;
