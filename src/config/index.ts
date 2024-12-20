import dotenv from 'dotenv';

dotenv.config();

//  Esto evita que cada parte del código tenga que saber cómo acceder o validar las variables de entorno.


function getEnv<T extends keyof NodeJS.ProcessEnv>(key: T, defaultValue?: NodeJS.ProcessEnv[T]): NodeJS.ProcessEnv[T] {
    const value = process.env[key];
  
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      throw new Error(`Missing environment variable: ${key}`);
    }
  
    return value as NodeJS.ProcessEnv[T]; // Devolvemos el valor (ya validado como tipo T)
}

const nodeEnv = getEnv('NODE_ENV');
const port = getEnv('PORT', '3000');
const databaseUri = getEnv('DATABASE_URL');
const apiUrl = getEnv('API_URL');
const apiUrlStore = getEnv('API_URL_STORE');
const apiKey = getEnv('API_KEY');
const steamId = getEnv('STEAM_ID_64');

export const config = {
    nodeEnv,
    port,
    databaseUri,
    apiUrl,
    apiUrlStore,
    apiKey,
    steamId
}