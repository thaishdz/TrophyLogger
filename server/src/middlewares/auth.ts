import { NextFunction, Request, Response } from 'express';
import { createApiResponse } from '../common/http/responses';


export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json(createApiResponse(false, 401, "Authentication Error", null, { type: req.method, url: req.originalUrl }))
};
