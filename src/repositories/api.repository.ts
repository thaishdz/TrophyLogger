import axios from 'axios';
import _, { unescape } from 'lodash';

import config from '../config';
import logger from '../config/logger'


import { AchievementDetails, 
        AchievementsLockedData, 
        AchievementPlayerAchievedStats, 
        AchievementApiResponse,
        AchievementPlayerData
    } from '../types/achievement';

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
            throw new Error("Failed to fetch Games from Steam API");
         }
    }


    async getPlayerLockedAchievements(gameId: number): Promise<AchievementPlayerData> {
        
        try {
            const response = await axios
                .get(`${this.API_URL}/ISteamUserStats/GetPlayerAchievements/v1/?appid=${gameId}&key=${this.API_KEY}&steamid=${this.STEAM_ID}`); 
            
            const gameName: string = response.data.playerstats.gameName;
            const achievementPlayerAchievedStats: AchievementPlayerAchievedStats[] = response.data.playerstats.achievements;
            const achievementsDetails: AchievementDetails[] = await this.getAchievementsDetails(gameId);

            //TODO: Consider moving this part to a new service ---> achievements.service.ts
            const playerLockedAchievementsData = this.getAchievementsLockedData(achievementPlayerAchievedStats, achievementsDetails);
            const totalAchievementsLocked: number = playerLockedAchievementsData.length;

            const playerLockedAchievements: AchievementPlayerData = {
                gameName, 
                totalLocked: totalAchievementsLocked, 
                playerAchievementsData: playerLockedAchievementsData
            }

            return playerLockedAchievements;

        } catch (error) {
            logger.error("Failed to fetch Achievements from Steam API:", error);
            throw new Error("Failed to fetch Achievements from Steam API");
        }
    }

    // TODO: Consider moving this function to a new service achievements.service.ts
    getAchievementsLockedData(achievementPlayerAchievedStats: AchievementPlayerAchievedStats[], achievementsDetails: AchievementDetails[]): AchievementsLockedData[] {

        const unachievedsFiltered: AchievementPlayerAchievedStats[] = achievementPlayerAchievedStats
            .filter((achievement: AchievementPlayerAchievedStats) => achievement.achieved === 0);

        const achievementsLockedData: AchievementsLockedData[]  = achievementsDetails
            .map((achievementDetail: AchievementDetails)  => { 

                const matchingUnachieved: AchievementPlayerAchievedStats | undefined = unachievedsFiltered
                    .find((unachieved: AchievementPlayerAchievedStats) => unachieved.apiname === achievementDetail.value);

                return matchingUnachieved ? {
                    ...achievementDetail, // crea una copia del obj con todas sus propiedades 
                    achieved: matchingUnachieved.achieved // y le añade esta 
                } : undefined
            })
            // con el filter nos aseguramos que el map siempre devuelva un valor
            .filter((lockedAchievementData): lockedAchievementData is AchievementsLockedData => lockedAchievementData !== undefined);          
        
        return achievementsLockedData;
    }

    async getAchievementsDetails(appId: number): Promise<AchievementDetails[]> {

        try {
            const response = await axios.get(`${this.API_URL}/ISteamUserStats/GetSchemaForGame/v2/?key=${this.API_KEY}&appid=${appId}`);
            const achievementsResponse: AchievementApiResponse[] = response.data.game.availableGameStats.achievements;            
            
            return achievementsResponse.map((achievement: AchievementApiResponse): AchievementDetails => ({
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

    async getCoverGame(gameName: string, gameId: number): Promise<string> {
        
        try {
            
            const response = await axios.get(`${this.API_URL_STORE}/storesearch?term=${gameName}&cc=es`);
            
            const game = response.data.items.find((item: { id: number; }) => item.id === gameId);
            return game?.tiny_image || ''; // la cover, retorna '' si game es undefined

        } catch (error) {
            logger.error("Failed to fetch Cover game from Steam API:", error);
            throw new Error("Failed to fetch Cover game from Steam API")
        }
    }

}

export default ApiRepository;