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

            if (!Array.isArray(data)) {
                throw new ServiceError("Invalid response: expected an array", "INVALID_RESPONSE"); 
            }

            if (data.length === 0) {
                throw new ServiceError("The player has no games in their library", "EMPTY_LIBRARY");
            }
            
            const gamesInfo: GameData[] = await Promise.all(
                data.map(async (game: GameLibraryResponse) => ({ 
                    gameId: game.appid, 
                    name: game.name            
                })));
            
            return gamesInfo; 

        } catch (error) {
            logger.error("Failed to fetch Games Library from Steam API:", error);

            if (error instanceof ServiceError) {
                throw error; // Re-lanzamos los errores que ya tienen contexto
            }
            // si no es instancia de error se crea nuevo objeto indicando que fue fallo de red
            throw new ServiceError("Error fetching games library", "FETCH_ERROR", error);
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
            throw new ServiceError("Game not found in your library", "FETCH_ERROR", error);
        }
    }

}

export default GameService;