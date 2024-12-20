import { Router } from 'express';

import { validateAuthParams } from '../middlewares/auth.middleware';
import { getGamesDetails } from '../controllers/games.controller'


const router = Router();

// Se ejecutan en este orden: middleware1 -> middleware2 -> controladorFinal
router.get(`/search-game/:gameName`, validateAuthParams, getGamesDetails);
//router.get(`/game/:gameName/add`, addGame); 
/*router.get(`/dashboard`, getAchivementStats); */


export default router;