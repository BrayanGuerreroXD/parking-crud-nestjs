import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { AuthBody } from "../interfaces/auth.interface";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDto implements AuthBody {
    @IsNotEmpty({message: 'Email is required'})
    @IsString({message: 'Email must be a string'})
    @MaxLength(50, {message: 'Email must be a maximum of 50 characters'})
    @IsEmail({}, {message: 'Email must be a valid email address'})
    @ApiProperty({
        type: String,
        description: 'User email',
        maxLength: 50,
        example: 'admin@mail.com'
    })
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    @IsString({message: 'Password must be a string'})
    @ApiProperty({
        type: String,
        description: 'User password',
        example: 'admin'
    })
    password: string;
}