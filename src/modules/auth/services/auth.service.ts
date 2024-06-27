import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthResponse } from '../interfaces/auth.interface';
import { AuthDto } from '../dto/auth.dto';
import { CreateTokenDto } from 'src/modules/tokens/dto/create-token.dto';
import { TokensService } from 'src/modules/tokens/tokens.service';
import { InvalidTokenException } from 'src/exception-handler/exceptions.classes';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly tokenService: TokensService
    ) {}

    public async validateUser(body: AuthDto): Promise<UserEntity | null> {
        // Check if the user exists in the database by email
        const userByEmail = await this.userService.findBy({
            key: 'email',
            value: body.email
        });

        // Check if the password is correct
        if (userByEmail) {
            const match = await bcrypt.compare(body.password, userByEmail.password);
            if (match) return userByEmail;
        }

        return null;
    }

    public async generateJWT(user: UserEntity): Promise<AuthResponse> {
        const EXPIRATION_TIME = process.env.EXPIRATION_TIME;
        
        const payload = {
            role: user.role.name,
            sub: user.id.toString(),
        };

        const token = this.signJWT({
            payload,
            secret: process.env.JWT_SECRET,
            expires: EXPIRATION_TIME,
        });

        const createToken: CreateTokenDto = {
            user: user.id,
            value: token,
        }
        await this.tokenService.createToken(createToken);

        return {
            accessToken: token,
        };
    }

    public async logout(request : Request) {
        const headers = request.headers;
        const bearerToken = headers['authorization']

        if (!bearerToken || Array.isArray(bearerToken))
            throw new InvalidTokenException();

        const token = bearerToken.split('Bearer ')[1];
        await this.tokenService.removeToken(token)
    }

    private signJWT({ payload, secret, expires,
    }: {
        payload: jwt.JwtPayload;
        secret: string;
        expires: number | string;
    }): string {
        return jwt.sign(payload, secret, { expiresIn: expires });
    }

}