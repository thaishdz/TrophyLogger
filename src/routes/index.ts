import { Router } from 'express';

import { validateSteamAuthParams } from '../middlewares/steamAuth.middleware';
import { getGameDetails } from '../controllers/games.controller'


const router = Router();

// Se ejecutan en este orden: middleware1 -> middleware2 -> controladorFinal
router.get(`/search-game/:gameName`, validateSteamAuthParams, getGameDetails);
/*router.get(`/game/:gameName/add`, addGame); 
router.get(`/dashboard`, getAchivementStats); */


export default router;