import { Request, Response } from 'express';
import { GameService } from '../services/games.service';

export class GameController {
    private gameService: GameService;


    constructor() {
        this.gameService = new GameService();
    }

    public getGame = async (req: Request, res: Response) => {
        const gameName = String(req.query.name);
        const games = await this.gameService.getGamesWithLockedAchievements(gameName);        
        res.json(games)
    }

}