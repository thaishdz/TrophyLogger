import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../shared/errors/baseError';


export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    // Si el error es una instancia de BaseError, se trata como error controlado (isOperational = true).
    if (err instanceof BaseError) {
        return res.status(err.httpCode).json({
            error: err.name,
            message: err.message
        });
    }

    // Error no controlado (isOperational = false)
    return res.status(500).json({
        error: 'Interval Server Error',
        message: 'Something went wrong'
    });
}