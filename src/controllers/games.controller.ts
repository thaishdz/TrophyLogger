import { Request, Response } from 'express';
import { GameService } from '../services/games.service';
import { GameDetailsDto } from '../models/DTOs/gameDto';

export class GameController {
    private gameService: GameService;


    constructor() {
        this.gameService = new GameService();
    }

    public getGame = async (req: Request, res: Response) => {
        
        
        try {

            const gameName = String(req.query.game);
            const games = await this.gameService.getGameLibrary();
            const game = await this.gameService.getGame(gameName, games);  
            console.log("GAME", game);

            const achievementsDto = await this.gameService.getLockedAchievements(game.gameId);  

            const gameDetails: GameDetailsDto = {
                gameId: game.gameId,
                name: game.name,
                achievements: achievementsDto
            }
        
            res.json(gameDetails)
            
        } catch (error) {
            const errorMessage = (error as Error).message; // Aserción de tipo
            res.status(404).send(
                { 
                    error: errorMessage
                }
            )
        }
        
        
    }

}