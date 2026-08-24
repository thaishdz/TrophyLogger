import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";
import { HttpException } from "../exceptions/HttpException";

const userService = new UserService();


export const getSteamId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    req.steamId = await userService.getSteamId(req.user)
    return next();
  } catch (error) {
    next(error);
  }
}

