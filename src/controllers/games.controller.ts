import { Request, Response } from 'express';
import { GameService } from '../services/games.service';
import { GameDetailsDto } from '../models/DTOs/gameDto';

export class GameController {
    private gameService: GameService;


    constructor() {
        this.gameService = new GameService();
    }

    public searchGame = async (req: Request, res: Response) => {
        
        try {

            const gameName = String(req.query.game);
            const gamesLibrary = await this.gameService.getGameLibrary();
            const matchingGames = await this.gameService.findGames(gameName, gamesLibrary);
            const gamesWithCover = await this.gameService.coverGame(matchingGames);
            
            res.json({matchingGames: gamesWithCover})
            
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

            const achievements = await this.gameAchievementsDetails(gameId);

            const gameAchievements: GameDetailsDto = {
                gameId,
                name: achievements?.name,
                achievements 
            }
            
            res.json(gameAchievements);
            
        } catch (error) {
            const message = (error as Error).message;
            res.status(500).json({error: message});
            
        }
        

    }

    public gameAchievementsDetails = async (gameId: number) => {
        
        try {
            const achievementsDto = await this.gameService.lockedAchievements(gameId);  
            return achievementsDto;
            
        } catch (error) {
            throw new Error((error as Error).message);
        }
       
    }

}