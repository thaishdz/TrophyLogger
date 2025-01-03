import axios from 'axios';

import config from '../config';
import logger from '../config/logger'


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
            const games = response.data.response.games;

            const gamesDetails = games.map((game: { appid: number; name: string; }) => ({ appid: game.appid, name: game.name }));
            return gamesDetails;

         } catch (error) {
            logger.error("Failed to fetch games from Steam API:", error);
            throw new Error("Failed to fetch games from Steam API");
         }
    }


    async getPlayerLockedAchivements(appId: number) {
        
        try {
            const response = await axios.get(`${this.API_URL}/ISteamUserStats/GetPlayerAchievements/v1/?appid=${appId}&key=${this.API_KEY}&steamid=${this.STEAM_ID}`); 
            const unachieved = response.data.playerstats.achievements;
            
            const achievementsDetails = await this.getAchievementsDetails(appId);
            const unachievedFiltered = unachieved.filter((achievement: { achieved: number }) => achievement.achieved === 0);

            const playerLockedAchivements = achievementsDetails
                .map((achievement: { value: string; }) => { 
                    const matchingUnachieved = unachievedFiltered.find((unachieved: { apiname: string; }) => unachieved.apiname === achievement.value);

                    if (matchingUnachieved) {
                        return {...achievement, achieved: matchingUnachieved.achieved} // crea una copia del obj con todas sus propiedades y le añade una nueva
                    }
                })
                .filter((achievement: undefined) => achievement !== undefined)
            
            return playerLockedAchivements;

        } catch (error) {
            logger.error("Failed to fetch Achievements from Steam API:", error);
            return {
                code: 400,
                message: "El jugador no tiene este juego",
                success: false
            }
        }
    }


    async getAchievementsDetails(appId: number) {

        try {
            const response = await axios.get(`${this.API_URL}/ISteamUserStats/GetSchemaForGame/v2/?key=${this.API_KEY}&appid=${appId}`);
            const achievementsDetails = response.data.game.availableGameStats.achievements;
            //TODO: crea y usa la interfaz achievement
            return achievementsDetails.map((achievement: any) => ({
                name: achievement.displayName,
                value: achievement.name,
                description: achievement.description,
                icon: achievement.icongray
            }));
            
        } catch (error) {
            logger.error("Failed to fetch SchemaForGame from Steam API:", error);
            throw new Error("Failed to fetch SchemaForGame from Steam API");
        }
        
    }

}

export default ApiRepository;