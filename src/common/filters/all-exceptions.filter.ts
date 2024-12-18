import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { isObject } from 'class-validator';
import type { Request, Response } from 'express';
import { TypeORMError } from 'typeorm';

import { ErrorResponse, ErrorType } from '../util/error-response.dto';

const DatabaseErrors: Record<
  string,
  { status: number; error: string } | undefined
> = {
  EntityNotFoundError: {
    status: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { method, url } = request;

    let type = ErrorType.UNKNOWN;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let message: string | undefined;
    let code: string | undefined;

    if (exception instanceof HttpException) {
      type = ErrorType.APPLICATION;
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (isObject(exceptionResponse)) {
        message = (<any>exceptionResponse).message;
        error = (<any>exceptionResponse).error;
      } else {
        error = exceptionResponse;
      }
    } else if (exception instanceof TypeORMError) {
      const dbError = DatabaseErrors[exception.constructor.name];
      code = (<any>exception).code;
      message = exception.message;
      type = ErrorType.DATABASE;
      if (dbError) {
        status = dbError.status;
        error = dbError.error;
      }
    } else {
      message = exception.message;
    }

    Logger.error(message, exception.stack, `${method} ${url}`);
    response.status(status).json(
      new ErrorResponse({
        type,
        statusCode: status,
        error,
        message,
        code,
        timestamp: new Date().toISOString(),
        path: url,
        method,
      }),
    );
  }
}
