import passport, { DoneCallback } from 'passport';
import { SteamOpenIdStrategy, SteamOpenIdUserProfile } from 'passport-steam-openid';
import axios from 'axios';
import { User } from '../models/User';
import { SteamAuthService } from '../services/steam/SteamAuthService';
import config from "./";

const steamAuthService = new SteamAuthService()

// Steam a veces devuelve el Content-Type mal (text/html o text/plain
// en vez de application/json), aunque el cuerpo SÍ sea JSON válido.
// axios, sin este forzado, no auto-parsea y entrega el body como string
// crudo, lo cual rompe la validación interna de passport-steam-openid.
const steamHttpClient = axios.create({
    transformResponse: [(data) => {
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    }]
});


passport.use(
    new SteamOpenIdStrategy({
        returnURL: 'http://localhost:8000/auth/steam/return', // back to the backend to process the Steam callback
        profile: true,
        apiKey: config.STEAM_API_KEY,
        maxNonceTimeDelay: 120, // Optional, in seconds, time between creation and verification of nonce date
        httpClient: steamHttpClient,
    }, async (
        req: Request,
        identifier: string,
        profile: SteamOpenIdUserProfile, // if profile is false, then it's only { steamid }, otherwise full profile from GetPlayerSummaries api
        done: DoneCallback
    ) => {
        // Optional callback called only when successful authentication occurs
        // You can save the user to database here.
        try {
            const user = await steamAuthService.findOrCreateSteamUser(profile.steamid, profile.personaname)
            done(null, user) // llama a serializeUser
        } catch (error) {
          console.error('STEAM AUTH ERROR:', error)
          done(error as Error)
        }
    })
)

// Se ejecuta UNA VEZ, justo después del login y Passport guarda { _id: "abc123" } en la cookie de sesión
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Se ejecuta en CADA request que trae esa cookie, identifica quién es bajo esa cookie
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { passport };
