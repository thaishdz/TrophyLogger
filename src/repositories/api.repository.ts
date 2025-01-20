import axios from 'axios';

import config from '../config';
import logger from '../config/logger'

import { ApiResponse } from '../types/apiResponse';

class ApiRepository {
    private API_URL: string;
    private API_URL_STORE: string;
    private API_KEY: string;
    private STEAM_ID: string;

    constructor() {
        this.API_URL = config.API_URL;
        this.API_URL_STORE = config.API_URL_STORE;
        this.API_KEY = config.API_KEY;
        this.STEAM_ID = config.STEAM_ID;
    }

    async getOwnedGames() {    

        try {
            const response = await axios.get(`${this.API_URL}/IPlayerService/GetOwnedGames/v1/?key=${this.API_KEY}&steamid=${this.STEAM_ID}&include_appinfo=true&include_played_free_games=true`); // await se utiliza para esperar a que una promesa se resuelva o se rechace.
            const gamesLibrary = response.data.response.games;
            return gamesLibrary;

         } catch (error) {
            logger.error("Failed to fetch games from Steam API:", error);
            throw new RepositoryError("Failed to fetch Games from Steam API");
         }
    }


    async getPlayerAchievements<Data>(gameId: number): Promise<ApiResponse<Data>> {
        
        try {
            const response = await axios
                .get(`${this.API_URL}/ISteamUserStats/GetPlayerAchievements/v1/?appid=${gameId}&key=${this.API_KEY}&steamid=${this.STEAM_ID}`); 
            
            const playerAchievementsData: Data = await response.data.playerstats;

            return {data: playerAchievementsData};

        } catch (error) {
            logger.error("Failed to fetch Achievements from Steam API:", error);
            throw new RepositoryError("Failed to fetch Achievements from Steam API");
        }
    }

    async getAchievementsDetails<Data>(appId: number): Promise<ApiResponse<Data>> {

        try {
            const response = await axios.get(`${this.API_URL}/ISteamUserStats/GetSchemaForGame/v2/?key=${this.API_KEY}&appid=${appId}`);
            const achievementsDetails: Data = response.data.game.availableGameStats.achievements;         
            
            return {data: achievementsDetails};
            
        } catch (error) {
            logger.error("Failed to fetch SchemaForGame from Steam API:", error);
            throw new RepositoryError("Failed to fetch SchemaForGame from Steam API");
        }
        
    }

    async getCoverGame(gameName: string, gameId: number): Promise<string> {
        
        try {
            
            const response = await axios.get(`${this.API_URL_STORE}/storesearch?term=${gameName}&cc=es`);
            
            const game = response.data.items.find((item: { id: number; }) => item.id === gameId);
            return game?.tiny_image || ''; // la cover, retorna '' si game es undefined

        } catch (error) {
            logger.error("Failed to fetch Cover game from Steam API:", error);
            throw new RepositoryError("Failed to fetch Cover game from Steam API")
        }
    }

}

export default ApiRepository;