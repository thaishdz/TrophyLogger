

declare namespace Express {  // "Hey TypeScript, en Express..."
    interface Request {      // "...el objeto Request..."
        steamAuth: {        // "...puede tener esta propiedad"
            apiKey: string;
            steamId: string;
        }
    }
}