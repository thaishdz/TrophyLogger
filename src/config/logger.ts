import winston from 'winston';

// Crea un logger con diferentes configuraciones para consola y archivos
const logger = winston.createLogger({
  level: 'info', // El nivel por defecto de log
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    // Log en consola
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // Log en archivo
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

export default logger;