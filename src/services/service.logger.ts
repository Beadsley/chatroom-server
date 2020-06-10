import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: [new winston.transports.File({ filename: 'app-info.log' })],
});

export default logger;
