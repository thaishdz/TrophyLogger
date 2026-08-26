import { HttpException } from "./HttpException";

export class SteamApiError extends HttpException {
    constructor(status: number, message: string, data?: {}) {
        super(status,message, data);
    }
}
