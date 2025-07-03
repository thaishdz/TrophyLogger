import winston from 'winston';

// Crea un logger con diferentes configuraciones para consola y archivos
const logger = winston.createLogger({

  /**
   * logger.level -> Determina qué mensajes de logs se verán
   */
  level: 'warn', // solo se verán los mensajes de warn y error, el resto serán ignorados como info, verbose, debug
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      // Asegura que los objetos se serialicen correctamente
      const formattedMessage = typeof message === 'object' 
        ? JSON.stringify(message, null, 2) 
        : message;
      return `${timestamp} [${level}]: ${formattedMessage}`;
    })
  ),
  transports: [
    // Log en consola
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize()
      )
    }),
    // Log en archivo
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

export default logger;