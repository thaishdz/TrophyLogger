

export class RepositoryError extends Error {
    constructor(message: string) {
        super(message); // Call the constructor of the base class Error
        this.name = "RepositoryError";
    // Set the prototype explicitly to maintain the correct prototype chain
        Object.setPrototypeOf(this, RepositoryError.prototype);
    }
}


