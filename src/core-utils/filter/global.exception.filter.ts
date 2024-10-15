import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

export class ServerException {
  statusCode: HttpStatus;
  validationErrors?: string[];
  message?: string;
  error: string;
}

@Catch()
export class GlobalExceptionFilteer extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    let serverException;

    try {
      serverException = this.exceptionToServerException(exception);
    } catch (error) {
      serverException = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
      };
    }

    console.log('Error:');
    console.log(exception);

    return response.status(serverException.statusCode).json(serverException);
  }

  exceptionToServerException(exception: unknown): ServerException {
    let serverException: ServerException = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      if (this.isBadRequestException(exception)) {
        serverException = this.formatBadRequestException(exception);
      } else {
        serverException = this.formatGenericException(exception);
      }
    }

    return serverException;
  }

  private isBadRequestException(exception: HttpException) {
    const responseBody = exception.getResponse();
    const isBadRequest = exception.getStatus() === HttpStatus.BAD_REQUEST;
    const isResponseBodyAsObject = typeof responseBody === 'object';
    const doesMessageKeyExist = (responseBody as any).message;
    const isMessageKeyAnArray = doesMessageKeyExist && Array.isArray((responseBody as any).message);

    return isBadRequest && isResponseBodyAsObject && isMessageKeyAnArray;
  }

  private formatBadRequestException(exception: HttpException) {
    const responseBody = exception.getResponse();
    const doesErrorExist = (responseBody as any).error && (responseBody as any).error !== '';

    return {
      statusCode: exception.getStatus(),
      message: 'Some of the request data is invalid.',
      validationErrors: (responseBody as any).message,
      ...(doesErrorExist && { error: (responseBody as any).error }),
    };
  }

  private formatGenericException(exception: HttpException) {
    const responseBody = exception.getResponse();
    const doesErrorExist = (responseBody as any).error && (responseBody as any).error !== '';
    const doesMessageExist = (responseBody as any).message && (responseBody as any).message !== '';

    return {
      statusCode: exception.getStatus(),
      ...(doesErrorExist && { error: (responseBody as any).error }),
      ...(doesMessageExist && { message: (responseBody as any).message }),
    };
  }
}
