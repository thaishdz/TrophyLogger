import { Router } from "express";

import { validateAuthParams } from "../middlewares/auth";
import { GameController } from "../controllers/GameController";
import SteamService from "../services/steam/SteamService";
import GameService from "../services/games/GameService";
import AchievementsService from "../services/achievements/AchievementsService";

const router = Router();

// si los servicios crecen, en vez de instanciar manualmente considera un refactor con inversión de control(IoC)
const steamService = new SteamService();
const gameService = new GameService(steamService);
const achievementsService = new AchievementsService(steamService);
const gamesController = new GameController(
  gameService,
  achievementsService,
  steamService,
);

router.get(`/`, (req, res) => {
  res.send("Welcome to the Steam API!");
});

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
