// api-response.helpers.ts
import { ApiResponseOptions } from '@nestjs/swagger';

export function createSuccessResponse(
  statusCode: number,
  description: string,
  propertyName: string,
  exampleValue: string,
  exampleDescription: string
): ApiResponseOptions {
  return {
    status: statusCode,
    description: description,
    schema: {
      type: 'object',
      properties: {
        [propertyName]: {
          type: 'string',
          example: exampleValue,
          description: exampleDescription,
        },
      },
    },
  };
}
