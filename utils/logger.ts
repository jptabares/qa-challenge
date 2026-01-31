import { createLogger, format, transports } from 'winston';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env', quiet: true });

const logLevel = process.env.LOG_LEVEL || 'info';

const logger = createLogger({
    level: logLevel,
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [new transports.Console()],
});

export default logger;