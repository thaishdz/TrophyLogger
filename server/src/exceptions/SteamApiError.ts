export default class SteamApiError extends Error {

    status: number;
    data?: {};

    constructor(status: number, message: string, data?: {}) {
        super(message);
        this.status = status;
        this.data = data;
    }
}