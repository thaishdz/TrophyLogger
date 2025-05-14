import { Router } from "express";

import { validateAuthParams } from "../middlewares/auth";
import { GameController } from "../controllers/GameController";
import ApiHandlerService from "../services/api/ApiHandlerService";
import GameService from "../services/games/GameService";
import AchievementsService from "../services/achievements/AchievementsService";

const router = Router();

// si los servicios crecen, en vez de instanciar manualmente considera un refactor con inversión de control(IoC)
const apiService = new ApiHandlerService();
const gameService = new GameService(apiService);
const achievementsService = new AchievementsService(apiService);
const gamesController = new GameController(
  gameService,
  achievementsService,
  apiService,
);

// Se ejecutan en este orden: middleware1 -> middleware2 -> controladorFinal
/*router.get(`/dashboard`, getAchivementStats); */
router.get(
  `/search`,
  validateAuthParams,
  gamesController.searchGame.bind(gamesController),
);
router.get(
  `/gameAchievements/:gameId`,
  validateAuthParams,
  gamesController.gameAchievements.bind(gamesController),
);

export default router;
