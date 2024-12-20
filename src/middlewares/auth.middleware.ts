import { Request, Response, NextFunction } from 'express';
import { config } from '../config';


export const validateAuthParams = (req: Request, res: Response, next: NextFunction): void => {
    // 1. Recibe la petición
    // 2. Puede hacer validaciones, modificaciones, etc.
    // 3. Puede:
    //    - Pasar al siguiente middleware/controlador usando next()
    //    - O terminar la petición enviando una respuesta

    const API_KEY = config.apiKey;
    const STEAM_ID = config.steamId;

    if (!API_KEY || !STEAM_ID) {
        res.status(400).json({error: 'Faltan credenciales de Steam necesarias'});
        return; // la fn devuelve void y no puedo retornar un objeto Response
    }

    // Si todo va gucci 👍🏽 :
    // 1. Añadimos datos a req para usarlos después
    req.steamAuth = {
        apiKey: API_KEY,
        steamId: STEAM_ID
    };

    // 2. Continuamos con el siguiente middleware o controlador
    next();
}