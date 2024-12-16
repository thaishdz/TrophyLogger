import { Router } from 'express';
import dotenv from 'dotenv';

// Centraliza todas los endpoints de ISteamUserStats

dotenv.config;

const router = Router();


const API_KEY = process.env.API_KEY;
const STEAM_ID = process.env.STEAM_ID64;

// Haces las llamadas a la Steam API

router.get(`/GetOwnedGames/v1/?key=${API_KEY}}&steamid=${STEAM_ID}`, );




export default router;