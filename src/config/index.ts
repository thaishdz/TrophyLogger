import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, "./.env")}); // se usa path.resolve para asegurar de que se encuentra el archivo, incluso si la app se ejecuta desde diferentes ubicaciones

//console.debug(dotenv.config({ path: path.resolve(__dirname, "./.env")}));

/**
 * Hice esto porque cuando accedemos a process.env.PORT
 * Typescript lo ve así string | undefined, es un reflejo de cómo él lo ve
 */

interface ENV {
  NODE_ENV: string | undefined; 
  PORT: number | undefined;
  DATABASE_URL: string | undefined;
  API_URL: string | undefined;
  API_URL_STORE: string | undefined;
  API_KEY: string | undefined;
  STEAM_ID: string | undefined;
}

// Aquí le digo, vale Typescript pero yo quiero que estén definidas y deben verse así:
interface Config {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  API_URL: string;
  API_URL_STORE: string;
  API_KEY: string;
  STEAM_ID: string;
}


const getEnv = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    DATABASE_URL: process.env.DATABASE_URL,
    API_URL: process.env.API_URL,
    API_URL_STORE: process.env.API_URL_STORE,
    API_KEY: process.env.API_KEY,
    STEAM_ID: process.env.STEAM_ID_64
  }
}

const validateEnv = (config: ENV): Config => {
  for(const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    }
  }
  return config as Config;
}

const variablesEnv = getEnv();
const validatedEnv = validateEnv(variablesEnv);

export default validatedEnv;