import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";
import { APP_ERROR_MESSAGE } from "../constants/constant";


function errorMiddleware(error:HttpException, req: Request, res: Response, next: NextFunction) {
    const status = error.status;
    const message = status === 500 ? APP_ERROR_MESSAGE.serverError : error.message;
    const errors = error.error;
    res.status(status).json({ message, errors });
}

export default errorMiddleware;