import { ApiProperty } from "@nestjs/swagger";

export class CreateTokenDto {
    @ApiProperty({
        type: String,
        description: 'Token value',
    })
    value!: string;

    @ApiProperty({
        type: Number,
        description: 'User id',
        example: 1
    })
    user!: number;
}