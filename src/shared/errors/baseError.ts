// Todos los errores de TrophyLog seguirán esta estructura común
export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean; // si es error esperado o no, es decir, tiene una clase específica para él

  constructor(
    name: string,
    httpCode: number,
    message: string,
    isOperational: boolean,
  ) {
    super(message);
    // restaura la cadena de prototypes para conservar la herencia y evitar problemas con instanceof al extender Error
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this); // guarda en la propiedad stack la traza
  }
}
