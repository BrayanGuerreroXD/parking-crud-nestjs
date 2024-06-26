import { Catch, ArgumentsHost, HttpException, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionResponseDto } from './exception.response.dto';

/**FIXME: Todas las exceptions llegan con status 500 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        console.log(exception)

        const message = exception instanceof HttpException
            ? (typeof exception.getResponse() === 'string' ? exception.getResponse() : exception.getResponse()['message'])
            : 'Unexpected error';

        const errorResponse = new ExceptionResponseDto(message);

        response.status(status).json(errorResponse);
    }
}