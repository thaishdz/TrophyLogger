import Fuse from 'fuse.js'; // mi santo grial para realizar las búsquedas
import logger from '../config/logger'
import ApiRepository from '../repositories/api.repository';
import { GameDto } from "../models/DTOs/gameDto";


class GameService {

    private apiRepository: ApiRepository;

    constructor() {
        this.apiRepository = new ApiRepository();
    }

    public async getGameLibrary() {

        try {
            // devuelve una promesa el getOwnedGames por eso el await pa que se resuelva
            const gamesLibrary = await this.apiRepository.getOwnedGames(); 
            const gamesDetailsDto = await Promise.all(gamesLibrary.map(async (game: { appid: number; name: string; }) => ({ 
                gameId: game.appid, 
                name: game.name,
                cover: await this.apiRepository.getCoverGame(game.name, game.appid)
            }) as GameDto));
            
            return gamesDetailsDto; 

        } catch (error) {
            throw new Error("Error fetching games");
        }
    }

    public findGames (gameName: string, gamesLibrary: GameDto[]) {

        try {
            const options = {
                keys: ["name"], // La búsqueda es por la clave "name"
                isCaseSensitive: false,
                threshold: 0.2 // - Reducir para ser más exacto | + Aumentar para que se le vaya la bola
              };
              
            const fuse = new Fuse(gamesLibrary, options);
            
            const results = fuse.search(gameName);
            const games = results.map((result: {item: GameDto}) => result.item);
 
            if (!games) {
                throw new Error("Game not found in your library");
            }

            return games;
            
        } catch (error) {
            logger.error("Failed to fetch Game from Steam API:", error);
            throw new Error((error as Error).message);
        }
    }

}

export default GameService;