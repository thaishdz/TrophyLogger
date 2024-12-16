import { Router } from 'express';

import { getOwnedGames } from '../controllers/playerService.controller'
import { validateSteamParams } from '../middlewares/steamAuth.middleware';


const router = Router();


// Call to Steam API

router.get(`/GetOwnedGames/v1`, validateSteamParams, getOwnedGames);
// Se ejecutan en este orden: middleware1 -> middleware2 -> controladorFinal

export default router;