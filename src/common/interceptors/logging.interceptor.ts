import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, params, query } = req;
    const now = Date.now();

    this.logger.log(`Incoming Request`, {
      context: 'LoggingInterceptor',
      method,
      url,
      body: this.sanitize(body),
      params,
      query,
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          this.logger.log(`Outgoing Response`, {
            context: 'LoggingInterceptor',
            method,
            url,
            statusCode: res.statusCode,
            duration: `${Date.now() - now}ms`,
          });
        },
        error: (err) => {
          this.logger.error(`Request Error`, {
            context: 'LoggingInterceptor',
            method,
            url,
            error: err.message,
            duration: `${Date.now() - now}ms`,
          });
        },
      }),
    );
  }

  private sanitize(body: any): any {
    if (!body) return body;
    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret'];
    sensitiveFields.forEach((field) => {
      if (sanitized[field]) sanitized[field] = '***';
    });
    return sanitized;
  }
}
