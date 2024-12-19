import { Request, Response } from 'express';
import axios from 'axios';

import { GameDTO } from '../DTOs/game.dto';

export const getAllGames = async (req: Request, res: Response) => {

    const game = req.params.gameName;

    
};

export const getGamesDetails = async (req: Request, res: Response): Promise<void> => {
    
    const game = req.params.gameName;

    let gameDTO = {}

    try {
       
       const achievements = await getAchivements(data[0].id, res); // await porque necesitará resolverse la promesa que devuelve 
       gameDTO = new GameDTO(data[0].id, data[0].name, data[0].tiny_image, achievements);
       res.json(gameDTO);
       return; // por si ocurren comportamientos inesperados pero no sería necesario

    } catch (err) {
        res.status(500).json({Error: "Failed retrieving game details"})
    }
};

async function getAchivements (gameId: number, res: Response) { // las async functions siempre devuelven una promesa
    const BASE_URL = process.env.BASE_URL_API!;
    const API_KEY = process.env.API_KEY!;

    try {
        const response = await axios.get(`${BASE_URL}/ISteamUserStats/GetSchemaForGame/v2/?key=${API_KEY}&appid=${gameId}`);
        const data = response.data; 
        return data.game.availableGameStats.achievements;
    //TODO: Implementar mejor manejo de errores así como reintentos de conexión
    } catch (err) {
        res.status(500).json({Error: "Failed retrieving game details"})
    }
} 