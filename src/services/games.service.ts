import Fuse from 'fuse.js'; // mi santo grial para realizar las búsquedas
import logger from '../config/logger'
import ApiHandlerService from './api/apiHandler.service';
import { GameData } from '../types/game';
import { ServiceError } from '../errors/serviceError';

import { ApiResponse } from '../types/apiResponse';
import { GameLibraryResponse } from '../types/game';

class GameService {

    //INFO:
    /* 
    ** Al usar inyección de dependencias (DI) no solo desacoplamos la fuente de datos, 
    ** siendo vital en caso de que un día queramos sustituirla
    ** también facilita mockear en los tests
    */

    constructor(private apiService: ApiHandlerService) {}

    async getGamesLibrary(): Promise<GameData[]> {

        try {
            const { data }: ApiResponse<GameLibraryResponse[]> = await this.apiService.getOwnedGames(); 
            
            const gamesInfo: GameData[] = await Promise.all(
                data.map(async (game: GameLibraryResponse) => ({ 
                    gameId: game.appid, 
                    name: game.name            
                })));
            
            return gamesInfo; 

        } catch (error) {
            throw new ServiceError("Error fetching games");
        }
    }

    findGames (gameName: string, gamesLibrary: GameData[]) {
        
        try {
            const options = {
                keys: ["name"], // La búsqueda es por la clave "name"
                isCaseSensitive: false,
                threshold: 0.2 // - Reducir para ser más exacto | + Aumentar para que se le vaya la bola
              };
              
            const fuse = new Fuse(gamesLibrary, options);
            
            const results = fuse.search(gameName);
            const games = results.map((result: {item: GameData}) => result.item);
            
            if (!games) {
                throw new Error("Game not found in your library");
            }

            return games;
            
        } catch (error) {
            logger.error("Failed to fetch Game from Steam API:", error);
            throw new ServiceError("Game not found in your library");
        }
    }

}

export default GameService;