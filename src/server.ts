import express from 'express';
import routes from './routes'; // Importa el archivo index.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

dotenv.config; // Carga las varibles de entorno


const app = express();
const PORT = parseInt(process.env.PORT!);
const MONGO_URI = process.env.MONGO_URI

// Middlewares
app.use(cors()); // Permite TODAS las conexiones exteriores
app.use(express.json());
app.use(morgan('combined')); // Configura morgan para registrar las solicitudes

// Routes
app.use('/api/v1', routes); // Todas las rutas comenzarán con "/api/v1"

mongoose.connect(MONGO_URI!)  // "!" dice que MONGO_URI no será undefined
    .then(() => console.log('Conectado al MongiDB'))
    .catch(err => console.log('Fracaso al conectar a MongiDB', err))


app.listen(PORT, () =>{
    console.log(`Poniendo la 👂 en el ${PORT}`);
});