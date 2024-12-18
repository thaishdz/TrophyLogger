import { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

import { GameDTO } from '../DTOs/game.dto';

dotenv.config();

export const getGameDetails = async (req: Request, res: Response): Promise<void> => {
    
    const BASE_URL = process.env.BASE_URL_STORE;
    const game = req.params.gameName;
    const CC = 'es';

    let gameDTO = {}

    try {
       const response = await axios.get(`${BASE_URL}/storesearch?term=${game}&cc=${CC}`); // await se utiliza para esperar a que una promesa se resuelva o se rechace.
       const data = response.data.items;
       
       const achievements = await getAchivements(data[0].id); // await porque necesitará resolverse la promesa que devuelve 
       gameDTO = new GameDTO(data[0].id, data[0].name, data[0].tiny_image, achievements);
       res.json(gameDTO);
       return; // por si ocurren comportamientos inesperados pero no sería necesario

    } catch (err) {
        throw new Error("Retrieving game achievements");
    }
};

async function getAchivements (gameId: number): Promise<Array<object>> { // las async functions siempre devuelven una promesa
    const BASE_URL = process.env.BASE_URL_API!;
    const API_KEY = process.env.API_KEY!;

    try {
        const response = await axios.get(`${BASE_URL}/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${gameId}`);
        const data = response.data; 
        return data.game.availableGameStats.achievements;
    //TODO: Implementar mejor manejo de errores así como reintentos de conexión
    } catch (err) {
        throw new Error("Retrieving game achievements");
    }
} 