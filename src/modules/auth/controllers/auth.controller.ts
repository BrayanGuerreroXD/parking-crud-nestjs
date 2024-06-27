import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dto/auth.dto';
import { PublicAccess } from '../decorators/public.decorator';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @PublicAccess()
    async login(@Body() body : AuthDto, @Res() response : Response) {
        const userValidate = await this.authService.validateUser(body);
        if (!userValidate) 
            throw new UnauthorizedException('Data not valid');
        const jwt = await this.authService.generateJWT(userValidate);
        response.status(200).send(jwt);
    }

    @Post('logout')
    @PublicAccess()
    async logout(@Req() request: Request, @Res() response: Response) {
        await this.authService.logout(request);
        response.status(200).send({ message: 'Logout successful' });
    }
}