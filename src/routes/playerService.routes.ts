import { Router } from 'express';

import { validateSteamParams } from '../middlewares/steamAuth.middleware';
import { getOwnedGames } from '../controllers/playerService.controller'



const router = Router();


// Call to Steam API

router.get(`/GetOwnedGames/v1`, validateSteamParams, getOwnedGames);
// Se ejecutan en este orden: middleware1 -> middleware2 -> controladorFinal

export default router;