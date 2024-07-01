import { IsString, IsNotEmpty, Length, Matches, IsPositive } from "class-validator";

export class MailRequestDto {
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
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