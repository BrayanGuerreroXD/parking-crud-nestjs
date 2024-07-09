import { Body, Controller, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dto/auth.dto';
import { PublicAccess } from '../decorators/public.decorator';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createErrorResponse } from 'src/config/base.swagger.error.response.options';
import { createSuccessResponse } from 'src/config/base.swagger.success.response.options';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Login user'})
    @ApiBody({ type: AuthDto })
    @ApiResponse(createSuccessResponse(
        HttpStatus.OK, 
        'Login successful', 
        'accessToken', 
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiIxIiwiaWF0IjoxNzE5ODYyNTQzLCJleHAiOjE3MTk4NjYxNDN9.qMOYT-hipMALLcK3kHIkMFaxcQQLH4bhbtkMl50-t-c', 
        'JWT token'
    ))
    @ApiResponse(createErrorResponse(HttpStatus.BAD_REQUEST, 'Bad Request - Caused by an incorrect request object', 'BadRequestException', [
        "Email must be a maximum of 50 characters",
        "Email is not valid",
        "Email cannot be empty",
        "Email must be a string"
    ]))
    @ApiResponse(createErrorResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized - Caused by an invalid user or password', 'UnauthorizedException', ['Data not valid']))
    @Post('login')
    @PublicAccess()
    async login(@Body() body : AuthDto, @Res() response : Response) {
        const userValidate = await this.authService.validateUser(body);
        if (!userValidate) 
            throw new UnauthorizedException('Data not valid');
        const jwt = await this.authService.generateJWT(userValidate);
        response.status(200).send(jwt);
    }

    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Logout user'})
    @ApiResponse(createSuccessResponse(HttpStatus.OK, 'Logout successful', 'message', 'Logout successful', 'Logout message'))
    @ApiResponse(createErrorResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized - Caused by an invalid token', 'InvalidTokenException', ['Invalid token']))
    @Post('logout')
    @PublicAccess()
    async logout(@Req() request: Request, @Res() response: Response) {
        await this.authService.logout(request);
        response.status(200).send({ message: 'Logout successful' });
    }
}