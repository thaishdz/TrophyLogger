import { ratio } from "fuzzball";
import logger from '../config/logger'
import ApiRepository from '../repositories/api.repository';
import { GameDto } from "../models/DTOs/gameDto";

// Actúa como intermediario entre el repositorio y la lógica de negocio.
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

    public async getGame (gameName: string, games: GameDto[]) {
        console.log("Estoy en el SERVICIO: getGame")
        
        try {
            const game = games.find((game: GameDto) => {
                const score = ratio(game.name.toLowerCase(), gameName.toLowerCase());
                //console.log("SCORE de Juego INPUT con Juego", score, gameName.toLowerCase(), game.name.toLowerCase());
                return score > 70; // Umbral de similitud
            });
            console.log("GAME getGame:", game);
 
            if (game === undefined) {
                throw new Error("Game not found in your library");
            }
            
            return game;
            
        } catch (error) {
            logger.error("Failed to fetch Game from Steam API:", error);
            throw new Error((error as Error).message);
        }
        
    }

    public async getLockedAchievements(appid: number, name?: string) {

        try {

            const achievementsLockedDetailsDto = await this.apiRepository.getPlayerLockedAchivements(appid);
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