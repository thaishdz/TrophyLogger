import app from './app'
import config from './config'
import logger from "./config/logger";

// Server entry point
app.listen(config.PORT, () => {
    logger.info(`Poniendo la 👂 en el ${config.PORT}`);
});

