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
            const games = await this.gameService.findGames(gameName, gamesLibrary);  
            console.log("CONTROLLER ESTOS SON LOS GAMES", games);
            
            res.json(games)
            
        } catch (error) {
            const errorMessage = (error as Error).message; // Aserción de tipo
            res.status(404).send(
                { 
                    error: errorMessage
                }
            )
        }
    }

    public gameData = async (req: Request, res:Response) => {
        const { gameId } = req.params;
        console.log("Request", req);
        
        console.log("GAMEID:", gameId);

        const achievements = await this.gameAchievementsDetails(Number(gameId));

        //const gameData: GameDetailsDto = {
            
        //}
        //res.json(gameData);


    }

    public gameAchievementsDetails = async (gameId: number) => {
        
        const achievementsDto = await this.gameService.getLockedAchievements(gameId);  
        return achievementsDto;
    }

}