import { Catch, ArgumentsHost, HttpException, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ExceptionResponseDto } from './exception.response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const res = exception.getResponse();
        const defaultMessage = 'Unexpected error';
        let message: string[];

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

        const errorResponse = new ExceptionResponseDto(
            message,
            exception.name,
            exception.getStatus()
        );

        response.status(status).json(errorResponse);
    }
}