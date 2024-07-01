import { IsString, IsNotEmpty, Length, Matches, IsPositive, MaxLength } from "class-validator";

export class MailRequestDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @MaxLength(50, {message: 'Email must be a maximum of 50 characters'})
    email: string;
    
    @IsString({message: 'Plate must be a string'})
    @IsNotEmpty({message: 'Plate is required'})
    @Length(6, 6, {message: 'Plate must be exactly 6 characters'})
    @Matches(/^[a-zA-Z0-9]+$/, {message: 'Plate must be alphanumeric, no special characters or letter ñ'})
    plate: string;

    @IsString({message: 'Message must be a string'})
    @IsNotEmpty({message: 'Message is required'})
    message: string;
    
    @IsPositive({message: 'Parking id must be a positive number'})
    @IsNotEmpty({message: 'Parking id is required'})
    parkingId: number;
}