import Fuse from 'fuse.js'; // mi santo grial para realizar las búsquedas
import logger from '../config/logger'
import ApiRepository from '../repositories/api.repository';
import { GameInfo } from '../types/game';
import { ServiceError } from '../errors/serviceError';

import { ApiResponse } from '../types/apiResponse';
import { GameLibraryResponse } from '../types/game';

class GameService {

    private apiRepository: ApiRepository;

    constructor() {
        this.apiRepository = new ApiRepository();
    }

    public async getGameLibrary(): Promise<GameInfo[]> {

        try {
            const {data}: ApiResponse<GameLibraryResponse[]> = await this.apiRepository.getOwnedGames(); 
            
            const gamesInfo: GameInfo[] = await Promise.all(data.map(
                async (game: GameLibraryResponse) => ({ 
                    gameId: game.appid, 
                    name: game.name,
                   // cover: await this.apiRepository.getCoverGame(game.name, game.appid)
            }) as GameInfo));
            
            return gamesInfo; 

        } catch (error) {
            throw new ServiceError("Error fetching games");
        }
    }

    public findGames (gameName: string, gamesLibrary: GameInfo[]) {
        
        try {
            const options = {
                keys: ["name"], // La búsqueda es por la clave "name"
                isCaseSensitive: false,
                threshold: 0.2 // - Reducir para ser más exacto | + Aumentar para que se le vaya la bola
              };
              
            const fuse = new Fuse(gamesLibrary, options);
            
            const results = fuse.search(gameName);
            const games = results.map((result: {item: GameInfo}) => result.item);
            
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