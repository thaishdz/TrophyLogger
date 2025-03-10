
export class ServiceError extends Error {
    code: string;
    cause?: unknown;

    constructor(message: string, code: string, cause?: unknown) {
        super(message); // Call the constructor of the base class Error
        this.name = "ServiceError";
        this.code = code;
        this.cause = cause;

        if (cause instanceof Error && cause.stack) {
            this.stack = `${this.stack}\nCaused by: ${cause.stack}`;
        }
    }
}