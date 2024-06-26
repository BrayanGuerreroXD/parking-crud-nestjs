import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dto/auth.dto';
import { PublicAccess } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @PublicAccess()
    async login(@Body() body : AuthDto) {
        const userValidate = await this.authService.validateUser(body);
        if (!userValidate) 
            throw new UnauthorizedException('Data not valid');
        const jwt = await this.authService.generateJWT(userValidate);
        return jwt;
    }

}