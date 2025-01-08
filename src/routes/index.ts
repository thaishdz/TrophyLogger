import { Router } from 'express';

import { validateAuthParams } from '../middlewares/auth.middleware';
import { GameController } from '../controllers/games.controller'


const router = Router();
const gamesController = new GameController();

// Se ejecutan en este orden: middleware1 -> middleware2 -> controladorFinal
/*router.get(`/dashboard`, getAchivementStats); */
router.get(`/search`, validateAuthParams, gamesController.searchGame.bind(gamesController));
router.get(`/gameAchievements/:gameId`, validateAuthParams, gamesController.gameAchievements.bind(gamesController)); 



export default router;