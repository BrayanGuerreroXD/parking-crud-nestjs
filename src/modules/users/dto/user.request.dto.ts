import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UserRequestDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @MaxLength(50, {message: 'Email must be a maximum of 50 characters'})
    @IsEmail({}, {message: 'Email must be a valid email address'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsString({message: 'Password must be a string'})
    password: string;
}