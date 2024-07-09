import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length, IsPositive, Matches } from "class-validator";

export class ParkingRecordRequestDto {
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
    
    @IsPositive({message: 'Parking id must be a positive number'})
    @IsNotEmpty({message: 'Parking id is required'})
    @ApiProperty({
        type: Number,
        description: 'Parking id',
        example: 1
    })
    parkingId: number;
}