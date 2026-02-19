import { Request, Response, NextFunction } from "express";
import { HttpException } from "@/exceptions";
import { createApiResponse } from "@/common/http";


function errorMiddleware(error:HttpException, req: Request, res: Response, next: NextFunction) {

    res.status(error.status).json(
        createApiResponse(
            false, 
            error.status,
            error.message,
            null,
            { type: req.method, url: req.originalUrl }
        )
    );
}

export default errorMiddleware;