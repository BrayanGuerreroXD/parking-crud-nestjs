import { Catch, ArgumentsHost, HttpException, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionResponseDto } from './exception.response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const message = exception instanceof HttpException
            ? (typeof exception.getResponse() === 'string' ? exception.getResponse() : exception.getResponse()['message'])
            : 'Unexpected error';

        const errorResponse = new ExceptionResponseDto(message);

        response.status(status).json({
            ...errorResponse,
            timestamp: new Date().toISOString(),
        });
    }
}