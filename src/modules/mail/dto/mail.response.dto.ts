import { ApiProperty } from "@nestjs/swagger";

export class MailResponseDto {
    @ApiProperty({
        type: String,
        description: 'Message sent by the server',
        example: 'Mail sent successfully'
    })
    message!: string;

    constructor(message: string) {
        this.message = message;
    }
}