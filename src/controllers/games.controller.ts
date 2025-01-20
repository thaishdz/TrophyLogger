import { Request, Response } from 'express';

import GameService from '../services/games.service';
import AchievementsService from '../services/achievements.service';
import ApiRepository from '../repositories/api.repository';

import { GameAchievementsInfo } from '../types/game';

export class GameController {
    private gameService: GameService;
    private achievementService: AchievementsService;
    private apiRepository: ApiRepository;


    constructor() {
        this.gameService = new GameService();
        this.apiRepository = new ApiRepository();
        this.achievementService = new AchievementsService();
    }

    public searchGame = async (req: Request, res: Response) => {
        
        try {

            const gameName = String(req.query.game);
            // TODO: Llamar 1 sola vez a Steam para obtener la biblioteca y guardarla en BBDD
            const gamesLibraryDto = await this.gameService.getGameLibrary();
            const matchingGames = await this.gameService.findGames(gameName, gamesLibraryDto);
            
            res.json({matchingGames: matchingGames})
            
        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(500).json({error: error.message});
            } else if (error instanceof RepositoryError) {
                res.status(500).json({error: error.message})
            }
        }
    }

    public gameAchievements = async (req: Request, res:Response) => {
        
        try {
            const gameId = Number(req.params.gameId); 

            if (isNaN(gameId)) {
                res.status(400).json({error: "Invalid gameId"})
            }

            const { gameName, totalLocked, playerAchievementsData } = await this.achievementService.getPlayerLockedAchievements(gameId);   
            
            const gameAchievements: GameAchievementsInfo = {
                gameId,
                name: gameName,
                cover: await this.apiRepository.getCoverGame(gameName, gameId),
                totalLocked,
                achievements: playerAchievementsData
            };

            res.json(gameAchievements);

        } catch (error) {
            if (error instanceof ServiceError) {
                res.status(500).json({error: error.message});
            } else if (error instanceof RepositoryError) {
                res.status(500).json({error: error.message})
            }
        }
    }

}