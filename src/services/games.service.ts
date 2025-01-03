import { ratio } from "fuzzball";
import ApiRepository from '../repositories/api.repository';


// Actúa como intermediario entre el repositorio y la lógica de negocio.
export class GameService {

    private apiRepository: ApiRepository;

    constructor() {
        this.apiRepository = new ApiRepository();
    }

    public async getGame(gameName: string) {
        console.log("Estoy en el SERVICIO getGame")
        
        const games = await this.apiRepository.getOwnedGames(); // devuelve una promesa el getOwnedGames por eso el await pa que se resuelva
        
        const game = games.find((game: { name: string; }) => {
            const score = ratio(game.name.toLowerCase(), gameName.toLowerCase());
            console.log("SCORE de Juego INPUT con Juego", score, gameName.toLowerCase(), game.name.toLowerCase());
            
            if (score > 70) { // Umbral de similitud
                return game;
            }
        });

        return game;
    }

    public async getLockedAchievements(appid: number, name?: string) {

        const lockedAchievements = await this.apiRepository.getPlayerLockedAchivements(appid);
        console.log("LOCKED ACHIEVEMENTS:", lockedAchievements);
        
        return lockedAchievements;

    }
}