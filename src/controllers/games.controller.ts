import { Request, Response } from 'express';

import GameService from '../services/games/games.service';
import AchievementsService from '../services/achievements/achievements.service';
import ApiHandlerService from '../services/api/apiHandler.service';

import { GameData, GameAchievementsReponse } from '../shared/types/game';

import { ExternalApiError } from '../shared/errors/externalApiError';
import { AchievementPlayerData } from '../shared/types/achievement';
import { ApiError } from '../shared/errors/apiError';

export class GameController {

    constructor(
        private gameService: GameService, 
        private achievementService: AchievementsService, 
        private apiService: ApiHandlerService
    ) {}

    //TODO: TESTING PENDING
    public searchGame = async (req: Request, res: Response): Promise<void> => {
        
        try {            
            const gameName: string = String(req.query.game);
            // TODO: Llamar 1 sola vez a Steam para obtener la biblioteca y guardarla en BBDD
            const gamesLibrary: GameData[] = await this.gameService.getGamesLibrary();
            const matchedGames = await this.gameService.findGames(gameName, gamesLibrary);
            
            if (matchedGames.length === 0) {
                res.status(200).json({ matchedGames: [] });
            }

            res.status(200).json({ matchedGames })
            
        } catch (error) {
            //TODO: Implementar middleware
            if (error instanceof ApiError) {
                res.status(500).json({ error: error.message });
            } else if (error instanceof ExternalApiError) {
                res.status(500).json({ error: error.message })
            }
        }
    }

    public gameAchievements = async (req: Request, res:Response): Promise<void> => {
        
        try {
            const gameId = Number(req.params.gameId); 

            if (isNaN(gameId)) {
                res.status(400).json({error: "Invalid gameId"})
            }

            const playerDataAchievements: AchievementPlayerData = await this.achievementService.getLockedAchievementsDataForPlayer(gameId);                        
            const gameData: GameData = {
                gameId,
                name: playerDataAchievements.gameName,
                cover: await this.apiService.getCoverGame(playerDataAchievements.gameName, gameId)
            }
            const gameAchievementsResponse: GameAchievementsReponse = {
                data: gameData,
                achievements: playerDataAchievements
            };

            res.status(200).json(gameAchievementsResponse);

        } catch (error) {
            if (error instanceof ApiError) {
                res.status(500).json({ error: error.message });
            } else if (error instanceof ExternalApiError) {
                res.status(500).json({ error: error.message })
            }
        }
    }

}