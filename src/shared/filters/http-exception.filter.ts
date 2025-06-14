import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../errors/domain-error';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: typeof exceptionResponse === 'string' 
          ? exceptionResponse 
          : (exceptionResponse as any).message,
      });
    }

    if (exception instanceof DomainError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
        message: exception.message,
        error: exception.name,
      });
    }

    // Erro não tratado
    console.error(exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      message: 'Internal server error',
    });
  }
} 