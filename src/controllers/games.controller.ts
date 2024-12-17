import { Request, Response } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const getGameInfo = (req: Request, res: Response): void => {
    
    const BASE_URL = process.env.BASE_URL_STORE;
    const game = req.params.game;
    const CC = 'es';

    //TODO: async-await
    axios.get(`${BASE_URL}/storesearch?term=${game}&cc=${CC}`)
        .then(response =>{
            return res.json(response.data);
        })
        .catch(err =>{
            return res
                .status(500)
                .json({
                    error: 'Error al obtener la info del juego'
                })
        })
};