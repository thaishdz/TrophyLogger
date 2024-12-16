import { Router } from 'express';
import steamUserStatsRoutes from './steamUserStats.routes';
import playerServiceRoutes from './playerService.routes';

const router = Router();

router.use('/ISteamUserStats', steamUserStatsRoutes);
router.use('/IPlayerService', playerServiceRoutes);

export default router;