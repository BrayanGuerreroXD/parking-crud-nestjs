import { ApiProperty } from "@nestjs/swagger";

export class ExceptionResponseDto {
    @ApiProperty({
        type: 'array',
        items: { type: 'string', example: [
            "Example error 1",
        ], description: 'List of errors'},
    })
    message!: string[];

    @ApiProperty({
        type: 'string',
        example: 'Example error',
        description: 'Error type',
    })
    error!: string;

    @ApiProperty({
        type: 'number',
        example: 4,
        description: 'HTTP status code',
    })
    status!: number;

    @ApiProperty({
        type: 'string',
        example: new Date().toISOString(),
        description: 'Date of the error',
    })
    date!: string;
  
    constructor(message: string[], error: string, status: number) {
        this.message = message;
        this.error = error;
        this.status = status;
        this.date = new Date().toISOString();
    }
}