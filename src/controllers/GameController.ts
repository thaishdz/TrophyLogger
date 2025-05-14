import { Request, Response, NextFunction } from "express";

import GameService from "../services/games/GameService";
import AchievementsService from "../services/achievements/AchievementsService";
import ApiHandlerService from "../services/api/ApiHandlerService";

import { GameData, GameAchievementsReponse } from "../shared/types/game";
import { AchievementPlayerData } from "../shared/types/achievement";
import { createApiResponse } from "../common/http/responses";
import { HTTP_RESPONSE_STATUS } from "../common/http/constants";

export class GameController {
  constructor(
    private gameService: GameService,
    private achievementService: AchievementsService,
    private apiService: ApiHandlerService,
  ) {}

  public searchGame = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const gameName = String(req.query.game);
      // TODO: Llamar 1 sola vez a Steam para obtener la biblioteca y guardarla en BBDD
      const gamesLibrary: GameData[] = await this.gameService.getGamesLibrary();
      const matchedGames = this.gameService.findGames(gameName, gamesLibrary);

      res.json(createApiResponse(true, HTTP_RESPONSE_STATUS.OK, '', matchedGames));
      
    } catch (error) {
      next(error);
    }
  };

  public gameAchievements = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const gameId = Number(req.params.gameId);

      //REFACTOR: Añadir validación de gameId a través de express-validator
      if (isNaN(gameId)) {
        res.status(400).json({ error: "Invalid gameId" });
      }

      const playerDataAchievements: AchievementPlayerData =
        await this.achievementService.getLockedAchievementsDataForPlayer(
          gameId,
        );
      const gameData: GameData = {
        gameId,
        name: playerDataAchievements.gameName,
        cover: await this.apiService.getCoverGame(
          playerDataAchievements.gameName,
          gameId,
        ),
      };
      const gameAchievementsResponse: GameAchievementsReponse = {
        data: gameData,
        achievements: playerDataAchievements,
      };

      res.json(createApiResponse(true, HTTP_RESPONSE_STATUS.OK, '', gameAchievementsResponse));
    } catch (error) {
      next(error);
    }
  };
}
