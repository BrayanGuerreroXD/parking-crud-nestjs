import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionResponseDto } from './exception.response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // Validate if the exception has getStatus method
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    
    const defaultMessage = 'Unexpected error';
    let message: string[];

    // Validate if the exception has getResponse method
    if (exception.getResponse) {
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = [res];
      } else if (typeof res === 'object' && res !== null) {
        if (typeof res['message'] === 'string') {
          message = [res['message']];
        } else if (Array.isArray(res['message'])) {
          message = res['message'];
        } else {
          message = [defaultMessage];
        }
      } else {
        message = [defaultMessage];
      }
    } else {
      // If the exception does not have getResponse method, we will use the message property
      message = [exception.message || defaultMessage];
    }

    const errorResponse = new ExceptionResponseDto(
      message,
      exception.name || 'Error',
      status,
    );

    response.status(status).json(errorResponse);
  }
}