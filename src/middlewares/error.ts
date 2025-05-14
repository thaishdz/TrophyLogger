import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";
import { createApiResponse } from "../common/http/responses";
import { APP_ERROR_MESSAGE } from "../common/http/constants";


function errorMiddleware(error:HttpException, req: Request, res: Response, next: NextFunction) {
    
    const message = error.status === 500 ? APP_ERROR_MESSAGE.SERVER_ERROR : error.message;

    res.status(error.status).json(
        createApiResponse(
            false, 
            error.status,
            message,
            null,
            { type: req.method, url: req.originalUrl }
        )
    );
}

export default errorMiddleware;