
# Logging

# morgan

*Es un middleware de logging para aplicaciones Express.*

- Su función principal es registrar información sobre las solicitudes HTTP que llegan al servidor. 
- Básicamente, te ayuda a ver lo que está pasando en tu servidor en términos de solicitudes HTTP.

Cuando alguien hace una solicitud a tu servidor, Morgan puede generar un log con información útil sobre esa solicitud, como:

- El método HTTP (GET, POST, etc.)
- La URL solicitada
- El código de estado HTTP de la respuesta
- El tiempo que tardó en procesar la solicitud
- El agente de usuario (información del navegador)

## Ejemplo 

Si un cliente hace una solicitud `GET a /api/v1/users`, Morgan puede generar un *log* similar a esto:

```sh
GET /api/v1/users 200 150ms
```

Este log te da una idea rápida de qué solicitud fue realizada, si fue exitosa (`200 OK`), y cuánto tiempo tardó en procesarse.

# winston

Es un sistema de logging más general, utilizado para registrar eventos y mensajes en tu aplicación (no solo las solicitudes HTTP). Puedes usarlo para registrar errores, advertencias, o cualquier otro tipo de evento.

Usamos `winston`para registrar los mensajes de errores que combinamos con el middleware `morgan` para las solicitudes HTTP.

```ts
// config/logger.ts 📍

import winston from 'winston';

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

```

```ts
// Ejemplo de uso
logger.debug('Este es un log detallado'); // Visible solo en desarrollo
logger.info('Este es un log general'); // Visible en ambos entornos
logger.error('Este es un error crítico'); // Visible siempre
```

## Leyenda 🐲

### `level:`

*Determina qué nivel de logs se registran*. Los niveles predeterminados son:

- **error** ❌ : Solo errores críticos.
- **warn** ⚠️ : Advertencias.
- **info** ℹ️ : Información general.
- **http** 🛜 : Información sobre solicitudes HTTP.
- **verbose** ‼: Detalles adicionales.
- **debug** 🐞: Información útil para depuración.
- **silly** 🪿: Información extremadamente detallada.

> El nivel predeterminado es info, lo que significa que se registrarán todos los niveles info y superiores.

---

### `format:`

• Puedes personalizar cómo se registran los logs.
   • P.e: Agregar una marca de tiempo y registrar en formato JSON.

---

### `transports:`

• Especifica dónde se envían los logs.
   En el ejemplo, se envían tanto a la consola como a un archivo.


## Usage with `morgan`

```ts
// app.ts 📍

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import { config } from './config';
import logger from './config/logger';
import routes from './routes'; // Importa el archivo index.ts


export const init = () => {

    const app = express();

    if (!config.port || !config.mongoUri) {
        console.error('❌ Configuración faltante: Verifica las variables de entorno.');
        process.exit(1); // Salir del proceso con un código de error
    }
    
    const PORT = parseInt(config.port);
    const MONGO_URI = config.mongoUri
    
    // Crea un stream que morgan usará para enviar los logs a Winston
    const stream = {
        write: (message: string) => logger.info(message.trim()) // Envía los logs de morgan a winston
    };
    
    // Middlewares
    app.use(cors()); // Permite TODAS las conexiones exteriores
    app.use(express.json());
    app.use(morgan('combined', { stream })); // Usa morgan con un formato específico para registrar las solicitudes HTTP
    
    // Routes
    app.use('/api/v1', routes); // Todas las rutas comenzarán con "/api/v1"
    
    mongoose.connect(MONGO_URI)
        .then(() => console.log('Conectado al Mongui ✅'))
        .catch(err => {
            console.log('Fracaso al conectar a Mongui', err);
            process.exit(1); // Evita que el server siga intentando conectarse si hay un error crítico
        })
    
    
    app.listen(PORT, () =>{
        console.log(`Poniendo la 👂 en el ${PORT}`);
    });
}
```

Hemos importado el logger y lo hemos usamos para registrar los logs de las solicitudes HTTP con `morgan` y también para los logs generales del servidor.

## ¿Necesito llamar explícitamente a `stream`?

No. Cuando configuras Morgan con el stream, este lo usa internamente para redirigir los logs de las solicitudes HTTP a Winston. Esto sucede automáticamente cada vez que una solicitud es procesada por tu servidor.

### ¿Cómo funciona todo esto en el flujo?

**1. Configuras el stream para que Morgan use Winston para registrar los logs de las solicitudes.**


```ts
const stream = {
  write: (message: string) => logger.info(message.trim()) // Enviar los logs de morgan a winston
};
```

**2. Usas morgan como middleware en Express pasando el `stream` como parte de la configuración.** 

En este caso, usas el formato `'combined'` para los logs de solicitudes HTTP:

```ts
app.use(morgan('combined', { stream }));
```

**3. `morgan` automáticamente captura las solicitudes HTTP y genera un log para cada una.**

No tienes que llamar al stream manualmente. Morgan se encarga de eso internamente, enviando el mensaje generado por cada solicitud al método write del stream.

**4. El `write` del stream**

Recibe el mensaje de log de Morgan y lo pasa a Winston usando `logger.info(message.trim())`, lo que significa que el log de la solicitud será gestionado por Winston.
