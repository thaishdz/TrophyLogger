

class ServiceError extends Error {
    constructor(message: string) {
        super(message); // Call the constructor of the base class Error
        this.name = "ServiceError";
    // Set the prototype explicitly to maintain the correct prototype chain
        Object.setPrototypeOf(this, ServiceError.prototype);
    }
}