import { Request, Response } from 'express';
import { GameService } from '../services/games.service';

export class GameController {
    private gameService: GameService;


    constructor() {
        this.gameService = new GameService();
    }

    public getGames = async (req: Request, res: Response) => {
        const gameName = String(req.query.name);
        const games = await this.gameService.getGames(gameName);        
        res.json(games)
    }

}