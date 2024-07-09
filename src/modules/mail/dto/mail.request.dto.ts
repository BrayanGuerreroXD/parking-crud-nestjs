import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length, Matches, IsPositive, MaxLength, IsEmail } from "class-validator";

export class MailRequestDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @MaxLength(50, {message: 'Email must be a maximum of 50 characters'})
    @IsEmail({}, {message: 'Email is not valid'})
    @ApiProperty({
        type: String,
        description: 'User email',
        maxLength: 50,
        example: 'socio@mail.com',
    })
    email: string;
    
    @IsString({message: 'Plate must be a string'})
    @IsNotEmpty({message: 'Plate is required'})
    @Length(6, 6, {message: 'Plate must be exactly 6 characters'})
    @Matches(/^[a-zA-Z0-9]+$/, {message: 'Plate must be alphanumeric, no special characters or letter ñ'})
    @ApiProperty({
        type: String,
        description: 'Vehicle plate',
        example: 'ABC123',
        minLength: 6,
        maxLength: 6
    })
    plate: string;

    @IsString({message: 'Message must be a string'})
    @IsNotEmpty({message: 'Message is required'})
    @ApiProperty({
        type: String,
        description: 'Message to send',
        example: 'Your parking time is about to expire'
    })
    message: string;
    
    @IsPositive({message: 'Parking id must be a positive number'})
    @IsNotEmpty({message: 'Parking id is required'})
    @ApiProperty({
        type: Number,
        description: 'Parking id',
        example: 1
    })
    parkingId: number;
}