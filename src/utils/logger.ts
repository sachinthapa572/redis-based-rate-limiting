import winston from 'winston';
import config from '../config/env';

const logLevel = config.isDevelopment ? 'debug' : 'info';

const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
    ),
    defaultMeta: { service: 'rate-limiter-service' },
    transports: [
        new winston.transports.Console({
            format: config.isDevelopment
                ? winston.format.combine(
                    winston.format.colorize(),
                    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
                )
                : winston.format.json()
        })
    ]
});

export default logger;
