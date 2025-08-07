import { Request, Response, NextFunction } from "express";

import GameService from "../services/games/GameService";
import AchievementsService from "../services/achievements/AchievementsService";

import { GameData } from "../shared/types/game";
import { AchievementPlayerData } from "../shared/types/achievement";
import { createApiResponse } from "../common/http/responses";
import { HTTP_RESPONSE_STATUS } from "../common/http/constants";
import { SteamApiError } from "../exceptions/SteamApiError";
import logger from "../config/logger";



export class GameController {
  constructor(
    private gameService: GameService,
    private achievementService: AchievementsService,
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
      const gamesWithAchievements = await Promise.all(matchedGames.map(game => this.gameAchievements(game.gameId)));
            
      res.json(createApiResponse(true, HTTP_RESPONSE_STATUS.OK, '', gamesWithAchievements));
      
    } catch (error) {
      next(error);
    }
  };

  private async gameAchievements(gameId: number): Promise<GameData> {
    try {
      const playerDataAchievements: AchievementPlayerData =
        await this.achievementService.getLockedAchievementsDataForPlayer(
          gameId,
        );
      const gameAchievements: GameData = {
        gameId,
        ...playerDataAchievements,
      };

      return gameAchievements;

    } catch (error) {
      throw new SteamApiError(500, `An error occurred while fetching achievements for gameID ${gameId}`);
    }
  };
}
