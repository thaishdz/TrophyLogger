import { config } from '../config';
import axios from 'axios';

import { Game } from '../models/game.model';


export class ApiStoreRepository {
    private BASE_URL_STORE = config.apiUrlStore;

    constructor(apiBaseUrl: string) {
        this.BASE_URL_STORE = apiBaseUrl;
    }

    async getGames(game: string): Promise<Game[]> {

        const CC = 'es';

        try {
            const response = await axios.get(`${this.BASE_URL_STORE}/storesearch?term=${game}&cc=${CC}`); // await se utiliza para esperar a que una promesa se resuelva o se rechace.
            const games = response.data.items;
            return games.map((game: any)=> ({
                id: game.id,
                name: game.id,
                cover: game.tiny_image,
                achivements: game.achivements
            }));
         } catch (err) {
            console.error("Error fetching games from Steam API:", err);
            throw new Error("Failed to fetch games from Steam API");
         }
    }



}