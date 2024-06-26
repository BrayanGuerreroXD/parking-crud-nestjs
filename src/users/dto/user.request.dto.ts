import { IsNotEmpty, IsString } from "class-validator";

export class UserRequestDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}