
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: string;
        API_URL: string;
        API_URL_STORE: string;
        DATABASE_URL: string;
        API_KEY: string;
        STEAM_ID_64: string;
        PORT?: string;
      }
    }
}