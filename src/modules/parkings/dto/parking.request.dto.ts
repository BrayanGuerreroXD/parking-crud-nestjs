import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive, IsString, MaxLength } from "class-validator";

export class ParkingRequestDto {
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    @MaxLength(50, {message: 'Name must be a maximum of 50 characters'})
    @ApiProperty({
        type: String,
        description: 'Parking name',
        maxLength: 50,
        example: 'Parking One'
    })
    name!: string;

    @IsNotEmpty({message: 'Hourly cost is required'})
    @IsPositive({message: 'Hourly cost must be a positive number'})
    @ApiProperty({
        type: Number,
        description: 'Hourly cost',
        example: 10.5
    })
    hourlyCost!: number;

    @IsNotEmpty({message: 'Max parking space is required'})
    @IsPositive({message: 'Max parking space must be a positive number'})
    @ApiProperty({
        type: Number,
        description: 'Max parking space',
        example: 100
    })
    maxParkingSpace!: number;
    
    @IsNotEmpty({message: 'User id is required'})
    @IsPositive({message: 'User id must be a positive number'})
    @ApiProperty({
        type: Number,
        description: 'User id',
        example: 2
    })
    userId!: number;
}