import { IsNotEmpty, IsPositive, IsString } from "class-validator";

export class ParkingRequestDto {
    @IsNotEmpty({message: 'Name is required'})
    @IsString({message: 'Name must be a string'})
    name!: string;

    @IsNotEmpty({message: 'Hourly cost is required'})
    @IsPositive({message: 'Hourly cost must be a positive number'})
    hourlyCost!: number;

    @IsNotEmpty({message: 'Max parking space is required'})
    @IsPositive({message: 'Max parking space must be a positive number'})
    maxParkingSpace!: number;
    
    @IsNotEmpty({message: 'User id is required'})
    @IsPositive({message: 'User id must be a positive number'})
    userId!: number;
}