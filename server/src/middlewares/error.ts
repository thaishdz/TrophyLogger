import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";
import { createApiResponse } from "../common/http/responses";


function errorMiddleware(error:HttpException | Error, req: Request, res: Response, next: NextFunction) {
    console.error('FULL ERROR:', error);
    const status = error instanceof HttpException  ? error.status : 500;
    const message = error.message || "Internal server error";

    res.status(status).json(
        createApiResponse(
            false,
            status,
            message,
            null,
            { type: req.method, url: req.originalUrl }
        )
    );
}

export default errorMiddleware;
