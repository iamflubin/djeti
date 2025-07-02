import { createLogger, format, Logger, transports } from 'winston';

const isProd = process.env.NODE_ENV === 'production';

export const logger: Logger = createLogger({
  level: isProd ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'express-api' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple() // colored output in dev
      ),
    }),

    // Optional: File logging (add this in prod)
    // new transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new transports.File({ filename: 'logs/combined.log' }),
  ],
});

export const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};
