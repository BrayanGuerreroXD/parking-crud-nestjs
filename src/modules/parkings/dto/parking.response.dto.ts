import { Expose, Type } from "class-transformer";
import { UserResponseDto } from "src/modules/users/dto/user.response.dto";

export class ParkingResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    hourlyCost: number;

    @Expose()
    maxParkingSpace: number;

    @Expose()
    @Type(() => UserResponseDto)
    user: UserResponseDto;
}