import { BaseError } from "./baseError";


// Se refiere a errores que ocurren en nuestra API
export class ApiError extends BaseError {
    constructor(message = 'Error Internal Server', httpCode = 500) {
        super('API Error', httpCode, message, true);
    }
}