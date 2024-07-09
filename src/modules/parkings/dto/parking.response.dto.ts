import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { UserResponseDto } from "src/modules/users/dto/user.response.dto";

export class ParkingResponseDto {
    @Expose()
    @ApiProperty({
        type: Number,
        description: 'Parking id',
        example: 1
    })
    id: number;

    @Expose()
    @ApiProperty({
        type: String,
        description: 'Parking name',
        example: 'Parking One'
    })
    name: string;

    @Expose()
    @ApiProperty({
        type: Number,
        description: 'Hourly cost',
        example: 10.5
    })
    hourlyCost: number;

    @Expose()
    @ApiProperty({
        type: Number,
        description: 'Max parking space',
        example: 100
    })
    maxParkingSpace: number;

    @Expose()
    @Type(() => UserResponseDto)
    @ApiProperty({
        type: UserResponseDto,
        description: 'User',
    })
    user: UserResponseDto;
}