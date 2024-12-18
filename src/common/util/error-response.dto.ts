import { ApiProperty } from '@nestjs/swagger';

export enum ErrorType {
  APPLICATION = 'APPLICATION',
  DATABASE = 'DATABASE',
  UNKNOWN = 'UNKNOWN',
}

export interface ErrorResponseInterface {
  type: ErrorType;
  statusCode: number;
  error: string;
  message?: string;
  code?: string;
  timestamp: string;
  path: string;
  method: string;
}

export class ErrorResponse implements ErrorResponseInterface {
  @ApiProperty({ enum: ErrorType })
  type!: ErrorType;

  statusCode!: number;
  error!: string;
  message?: string;
  code?: string;
  timestamp!: string;
  path!: string;
  method!: string;

  constructor(errorObject: ErrorResponseInterface) {
    Object.assign(this, errorObject);
  }
}
