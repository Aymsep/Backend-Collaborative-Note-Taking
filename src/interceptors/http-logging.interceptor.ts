import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
import { CustomLoggerService } from 'src/logger/logger.service';
  
  @Injectable()
  export class HttpLoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: CustomLoggerService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const { method, url, headers, body } = request;
      const startTime = Date.now();
  
      // Log incoming request details
      this.logger.log(
        `Incoming Request: ${method} ${url} - Headers: ${JSON.stringify(headers)} - Body: ${JSON.stringify(body)}`,
      );
  
      return next.handle().pipe(
        tap((responseBody) => {
          const endTime = Date.now();
          const timeTaken = endTime - startTime;
          const response = context.switchToHttp().getResponse();
  
          // Log outgoing response details
          this.logger.log(
            `Outgoing Response: ${method} ${url} - Status: ${response.statusCode} - Time Taken: ${timeTaken}ms - Response Body: ${JSON.stringify(
              responseBody,
            )}`,
          );
        }),
      );
    }
  }
  