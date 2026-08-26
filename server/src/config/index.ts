import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, "./.env")}); // Busca el .env en la raíz del proyecto

/**
 * Hice esto porque cuando accedemos a process.env.PORT
 * Typescript lo ve así string | undefined, es un reflejo de cómo él lo ve
 */

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  DATABASE_URI: string | undefined;
  STEAM_API_KEY: string | undefined;
}

// Aquí le digo, vale Typescript pero yo quiero que estén definidas y deben verse así:
interface Config {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URI: string;
  STEAM_API_KEY: string;
}

const getEnv = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    DATABASE_URI: process.env.DATABASE_URI,
    STEAM_API_KEY: process.env.STEAM_API_KEY,
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
