import { Router } from "express";

import { ensureAuthenticated } from "../middlewares/auth";
import { GameController } from "../controllers/GameController";
import SteamService from "../services/steam/SteamService";
import GameService from "../services/games/GameService";
import AchievementsService from "../services/achievements/AchievementsService";
import { getSteamId } from "../middlewares/steamId";

const router = Router();

// si los servicios crecen, en vez de instanciar manualmente considera un refactor con inversión de control(IoC)
const steamService = new SteamService();
const gameService = new GameService(steamService);
const achievementsService = new AchievementsService(steamService);
const gamesController = new GameController(
  gameService,
  achievementsService
);

router.get(
  `/search`,
  ensureAuthenticated,
  getSteamId,
  gamesController.searchGame.bind(gamesController),
);
router.get(
  `/gameAchievements/:gameId`,
  ensureAuthenticated,
  getSteamId,
  gamesController.gameAchievements.bind(gamesController),
);

export default router;
