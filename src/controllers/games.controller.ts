import { Request, Response } from 'express';
import { GameService } from '../services/games.service';

export class GameController {
    private gameService: GameService;


    constructor() {
        this.gameService = new GameService();
    }

    public getGame = async (req: Request, res: Response) => {
        const gameName = String(req.query.game);
        
        const game = await this.gameService.getGame(gameName);  

        if (game === undefined) {
            return {
                code: 404,
                message: "Game not found in your library",
                success: false
            }
        }

        res.json(game)
    }

}