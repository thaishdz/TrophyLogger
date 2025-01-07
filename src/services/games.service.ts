import Fuse from 'fuse.js'; // mi santo grial para realizar las búsquedas
import logger from '../config/logger'
import ApiRepository from '../repositories/api.repository';
import { GameDto } from "../models/DTOs/gameDto";

export class GameService {

    private apiRepository: ApiRepository;

    constructor() {
        this.apiRepository = new ApiRepository();
    }

    public async getGameLibrary() {
        // devuelve una promesa el getOwnedGames por eso el await pa que se resuelva
        const games = await this.apiRepository.getOwnedGames(); 
        return games;
    }

    public async findGames (gameName: string, gamesLibrary: GameDto[]) {
        console.log("Estoy en el SERVICIO: findGames", gameName)
        
        try {
            const options = {
                keys: ["name"],
                isCaseSensitive: false
              };
              
            const fuse = new Fuse(gamesLibrary, options);
            
            const results = fuse.search(gameName);
            const games = results.map((result: {item: GameDto}) => result.item);
            console.log("GAMES findGames:", games);
 
            if (!games) {
                throw new Error("Game not found in your library");
            }

            return games;
            
        } catch (error) {
            logger.error("Failed to fetch Game from Steam API:", error);
            throw new Error((error as Error).message);
        }
    }


    public async getLockedAchievements(gameId: number) {

        try {
            const achievementsLockedDetailsDto = await this.apiRepository.getPlayerLockedAchivements(gameId);
            console.log("ACHIEVEMENTS?", achievementsLockedDetailsDto);

            if (!achievementsLockedDetailsDto) {
                return 
            }
            
            return achievementsLockedDetailsDto;

        } catch (error) {
            throw new Error((error as Error).message);
        }
        

    }
}