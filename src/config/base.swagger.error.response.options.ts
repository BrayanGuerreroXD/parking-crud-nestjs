// api-response.helpers.ts
import { ApiResponseOptions } from '@nestjs/swagger';

export function createErrorResponse(
    statusCode: number,
    description: string,
    errorClassName: string,
    examples: string[]
): ApiResponseOptions {
    return {
        status: statusCode,
        description: description,
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'array',
                    items: {
                        type: 'string',
                        example: examples,
                        description: 'List of errors',
                    },
                },
                error: {
                    type: 'string',
                    example: errorClassName,
                    description: 'Error type',
                },
                status: {
                    type: 'number',
                    example: statusCode,
                    description: 'HTTP status code',
                },
                date: {
                    type: 'string',
                    example: new Date().toISOString(),
                    description: 'Date of the error',
                },
            },
        },
    };
}