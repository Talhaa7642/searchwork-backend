import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { EntityNotFoundError, TypeORMError } from 'typeorm';

import { ErrorResponse, ErrorType } from '../util/error-response.dto';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exc: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exception = <any>exc;
    const error = <string>exception.message;
    const code = <string>exception.code;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    // TODO: write code -> (status and message) mapper
    switch (exception.constructor) {
      case EntityNotFoundError:
        status = HttpStatus.NOT_FOUND;
        break;
      default:
    }

    Logger.error(error, exception.stack, `${request.method} ${request.url}`);
    response.status(status).json(
      new ErrorResponse({
        type: ErrorType.DATABASE,
        statusCode: status,
        error,
        code,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      }),
    );
  }
}
