import dotenv from 'dotenv';
import logger from './logger'

dotenv.config();

//  Esto evita que cada parte del código tenga que saber cómo acceder o validar las variables de entorno.

function getEnv<T extends keyof NodeJS.ProcessEnv>(key: T, defaultValue?: NodeJS.ProcessEnv[T]): NonNullable<NodeJS.ProcessEnv[T]> {
    const value = process.env[key];
  
    if (value === undefined) {
      if (defaultValue !== undefined) {
        return defaultValue;
      }
      logger.error(`Missing environment variables:" ${key}`)
      throw new Error(`Missing environment variables: ${key}`);
    }
  
    return value as NonNullable<NodeJS.ProcessEnv[T]>; // Typescript inferirá el valor devuelto siempre como string
}

// TODO: Hacer un barrido inicial de todas las variables para ver si están seteadas
const nodeEnv = getEnv('NODE_ENV', 'development');
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