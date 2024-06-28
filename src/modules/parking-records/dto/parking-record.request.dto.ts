import { IsString, IsNotEmpty, Length, IsPositive, Matches } from "class-validator";

export class ParkingRecordRequestDto {
    @IsString({message: 'Plate must be a string'})
    @IsNotEmpty({message: 'Plate is required'})
    @Length(6, 6, {message: 'Plate must be exactly 6 characters'})
    @Matches(/^[a-zA-Z0-9]+$/, {message: 'Plate must be alphanumeric, no special characters or letter ñ'})
    plate: string;
    
    @IsPositive({message: 'Parking id must be a positive number'})
    @IsNotEmpty({message: 'Parking id is required'})
    parkingId: number;
}