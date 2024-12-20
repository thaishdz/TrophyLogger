import dotenv from 'dotenv';

dotenv.config();

//  Esto evita que cada parte del código tenga que saber cómo acceder o validar las variables de entorno.

export const config = {
    nodeEnv : process.env.NODE_ENV,
    port: process.env.PORT,
    mongoUri: process.env.MONGO_URI,
    apiUrl: process.env.BASE_URL_API,
    apiUrlStore: process.env.BASE_URL_STORE,
    apiKey: process.env.API_KEY,
    steamId: process.env.STEAM_ID_64
}