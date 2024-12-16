import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';


dotenv.config();


export const validateSteamParams = (req: Request, res: Response, next: NextFunction) => {
    // 1. Recibe la petición
    // 2. Puede hacer validaciones, modificaciones, etc.
    // 3. Puede:
    //    - Pasar al siguiente middleware/controlador usando next()
    //    - O terminar la petición enviando una respuesta

    const API_KEY = process.env.API_KEY;
    const STEAM_ID = process.env.STEAM_ID_64;


    if (!API_KEY || !STEAM_ID) {
        return res.status(400).json({
            error: 'Faltan credenciales de Steam necesarias'
        });
    }

    // Si todo está bien:
    // 1. Añadimos datos a req para usarlos después
    req.steamAuth = {
        apiKey: API_KEY,
        steamId: STEAM_ID
    };

    // 2. Continuamos con el siguiente middleware o controlador
    next();
}