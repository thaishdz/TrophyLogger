import { Request, Response, NextFunction } from "express";

import GameService from "../services/games/GameService";
import AchievementsService from "../services/achievements/AchievementsService";

import { GameData } from "../shared/types/game";
import { AchievementPlayerData } from "../shared/types/achievement";
import { createApiResponse } from "../common/http/responses";
import { HTTP_RESPONSE_STATUS } from "../common/http/constants";
import { SteamApiError } from "../exceptions/SteamApiError";
import { HttpException } from "../exceptions/HttpException";


export class GameController {
  constructor(
    private gameService: GameService,
    private achievementService: AchievementsService
  ) {}

  // TODO: Llamar 1 sola vez a Steam para obtener la biblioteca y guardarla en BBDD
  public searchGame = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const gameName = String(req.query.game);
      if (!req.steamId) throw new HttpException(401, "SteamId no disponible");
      const steamId = req.steamId;
      const gamesLibrary: GameData[] = await this.gameService.getGamesLibrary(steamId);
      const matchedGames = this.gameService.findGames(gameName, gamesLibrary);
      const settledAchievements = await Promise.allSettled(matchedGames.map(game => this.gameAchievements(game.gameId, steamId)));
      const gamesWithAchievements = settledAchievements
        .filter((result): result is PromiseFulfilledResult<GameData> => result.status === "fulfilled")
        .map((result) => result.value);

      res.json(createApiResponse(true, HTTP_RESPONSE_STATUS.OK, '', gamesWithAchievements));

    } catch (error) {
      next(error);
    }
  };

  public getGameAchievements = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.steamId) throw new HttpException(401, "SteamId no disponible");
      const steamId = req.steamId;
      const achievementsData = await this.gameAchievements(Number(req.params.gameId), steamId);
      res.json(createApiResponse(true, HTTP_RESPONSE_STATUS.OK, '', achievementsData));
    } catch (error) {
      next(error)
    }
  }

  private async gameAchievements(gameId: number, steamId: string): Promise<GameData> {
    try {
      const playerDataAchievements: AchievementPlayerData =
        await this.achievementService.getLockedAchievementsDataForPlayer(
          gameId,
          steamId
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
