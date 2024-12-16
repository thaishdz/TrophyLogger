import express from 'express';
import routes from './routes'; // Importa el archivo index.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config; // Carga las varibles de entorno


const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI
const BASE_URL = process.env.BASE_URL

// Middleware
app.use(express.json());

// Routes
app.use(BASE_URL!, routes); // Todas las rutas comenzarán con http://api.steampowered.com

mongoose.connect(MONGO_URI!)  // El operador ! afirma que MONGO_URI no será undefined
    .then(() => console.log('Conectado al MongiDB'))
    .catch(err => console.log('Fracaso al conectar a MongiDB', err))


app.listen(PORT, () =>{
    console.log(`Poniendo la 👂 en el ${PORT}`);
});