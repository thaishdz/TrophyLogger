import { Router } from 'express';

import { validateAuthParams } from '../middlewares/auth.middleware';
import { GameController } from '../controllers/games.controller'


const router = Router();
const gamesController = new GameController();

// Se ejecutan en este orden: middleware1 -> middleware2 -> controladorFinal
router.get(`/search`, validateAuthParams, gamesController.getGames.bind(gamesController));
//router.get(`/game/:gameName/add`, addGame); 
/*router.get(`/dashboard`, getAchivementStats); */


export default router;