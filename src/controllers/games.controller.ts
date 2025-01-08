import { Request, Response } from 'express';
import { GameService } from '../services/games.service';
import { GameDetailsDto } from '../models/DTOs/gameDto';
import ApiRepository from '../repositories/api.repository';

export class GameController {
    private gameService: GameService;
    private apiRepository: ApiRepository;


    constructor() {
        this.gameService = new GameService();
        this.apiRepository = new ApiRepository();
    }

    public searchGame = async (req: Request, res: Response) => {
        
        try {

            const gameName = String(req.query.game);
            // Refactor: Llamar 1 sola vez a Steam para obtener la biblioteca y guardarla en Mongo
            const gamesLibraryDto = await this.gameService.getGameLibrary();
            const matchingGames = await this.gameService.findGames(gameName, gamesLibraryDto);
            
            res.json({matchingGames: matchingGames})
            
        } catch (error) {
            const message = (error as Error).message; // Aserción de tipo
            res.status(404).json({ error: message});
        }
    }

    public gameAchievements = async (req: Request, res:Response) => {
        
        try {
            const gameId = Number(req.params.gameId); 

            if (isNaN(gameId)) {
                res.status(400).json({error: "Invalid gameId"})
            }

            const { gameName, total, playerLockedAchievements } = await this.gameService.lockedAchievements(gameId);
                        
            const gameAchievements: GameDetailsDto = {
                gameId,
                name: gameName,
                cover: await this.apiRepository.getCoverGame(gameName, gameId),
                achievements: {total, playerLockedAchievements}
            };
            res.json(gameAchievements);
            
        } catch (error) {
            const message = (error as Error).message;
            res.status(500).json({error: message});
            
        }
    }

}