import axios from 'axios';

import config from '../config';
import { Game } from '../models/game.model';
import logger from '../config/logger'


class ApiRepository {
    private API_URL: string;
    private API_URL_STORE: string;

    constructor() {
        this.API_URL = config.API_URL;
        this.API_URL_STORE = config.API_URL_STORE;
    }

    async getGames(name: string): Promise<Game[]> {

        const CC = 'es';

        try {
            const response = await axios.get(`${this.API_URL}/storesearch?term=${name}&cc=${CC}`); // await se utiliza para esperar a que una promesa se resuelva o se rechace.
            const games = response.data.items;
            return games.map((game: any)=> ({
                id: game.id,
                name: game.id,
                cover: game.tiny_image,
                achivements: game.achivements
            }));
         } catch (err) {
            logger.error("Failed to fetch games from Steam API:", err);
            throw new Error("Failed to fetch games from Steam API");
         }
    }

}

export default ApiRepository;