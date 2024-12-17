import { Router } from 'express';

import { validateSteamParams } from '../middlewares/steamAuth.middleware';
import { getGameInfo } from '../controllers/games.controller'


const router = Router();


router.get(`/search-game/:game`, validateSteamParams, getGameInfo); // Se ejecutan en este orden: middleware1 -> middleware2 -> controladorFinal


export default router;