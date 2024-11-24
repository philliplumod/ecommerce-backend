import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;
    const path = context.switchToHttp().getRequest().url;
    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        success: data.success,
        result: data.result,
        statusCode,
        timestamp: new Date().toISOString(),
        path,
        data,
      })),
    );
  }
}
