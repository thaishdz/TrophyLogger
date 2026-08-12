import { Router } from "express";
import { passport } from "../config/passport";

const router = Router();

// Redirects the user to Steam to log in
router.get('/steam', passport.authenticate('steam-openid'));

// Steam redirects back here after login; then we redirect to the dashboard
router.get('/steam/return',
  passport.authenticate('steam-openid', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000/dashboard');
  }
);


export default router;
