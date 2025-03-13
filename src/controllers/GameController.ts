import { Request, Response, NextFunction } from "express";

import GameService from "../services/games/GameService";
import AchievementsService from "../services/achievements/AchievementsService";
import ApiHandlerService from "../services/api/ApiHandlerService";

import { GameData, GameAchievementsReponse } from "../shared/types/game";
import { AchievementPlayerData } from "../shared/types/achievement";

export class GameController {
  constructor(
    private gameService: GameService,
    private achievementService: AchievementsService,
    private apiService: ApiHandlerService,
  ) {}

  //TODO: TESTING PENDING
  public searchGame = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const gameName: string = String(req.query.game);
      // TODO: Llamar 1 sola vez a Steam para obtener la biblioteca y guardarla en BBDD
      const gamesLibrary: GameData[] = await this.gameService.getGamesLibrary();
      const matchedGames = this.gameService.findGames(gameName, gamesLibrary);

      if (matchedGames.length === 0) {
        res.status(200).json({ matchedGames: [] });
      }

      res.status(200).json({ matchedGames });
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

      res.status(200).json(gameAchievementsResponse);
    } catch (error) {
      next(error);
    }
  };
}
