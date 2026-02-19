import { Request, Response, NextFunction } from "express";

import { AchievementPlayerData, GameData } from "@trophylogger-types";
import { createApiResponse } from "@common/http";
import { HTTP_RESPONSE_STATUS } from "@common/http/constants";
import { SteamApiError } from "@exceptions";
import logger from "@config/logger";
import { AchievementsService, GameService } from '@/services';



export default class GameController {
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
