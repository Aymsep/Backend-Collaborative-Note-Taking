import { Injectable, ConsoleLogger, LogLevel, Global } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class CustomLoggerService extends ConsoleLogger {
  private readonly winstonLogger: winston.Logger;

  constructor() {
    super();

    const logFormat = winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    });

    // Initialize Winston logger with file and console transports
    this.winstonLogger = winston.createLogger({
      level: 'info', // Define the minimum log level for Winston
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        logFormat,
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '10d',
        }),
      ],
    });
  }

  log(message: string, ...optionalParams: any[]) {
    super.log(message, ...optionalParams); // Logs to console with NestJS format
    this.winstonLogger.info(message); // Logs to file via Winston
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context);
    this.winstonLogger.error(`${message} -> Trace: ${trace}`); // Logs error to file
  }

  warn(message: string, ...optionalParams: any[]) {
    super.warn(message, ...optionalParams);
    this.winstonLogger.warn(message); // Logs warning to file
  }

  debug(message: string, ...optionalParams: any[]) {
    super.debug(message, ...optionalParams);
    this.winstonLogger.debug(message); // Logs debug info to file
  }

  verbose(message: string, ...optionalParams: any[]) {
    super.verbose(message, ...optionalParams);
    this.winstonLogger.verbose(message); // Logs verbose info to file
  }
}
