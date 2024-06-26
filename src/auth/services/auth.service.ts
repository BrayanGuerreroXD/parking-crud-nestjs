import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from '../../users/entities/user.entity';
import { AuthResponse } from '../interfaces/auth.interface';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService
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

    public signJWT({ payload, secret, expires,
    }: {
        payload: jwt.JwtPayload;
        secret: string;
        expires: number | string;
    }): string {
        return jwt.sign(payload, secret, { expiresIn: expires });
    }

    public async generateJWT(user: UserEntity): Promise<AuthResponse> {
        const getUser = await this.userService.findUserById(user.id);
    
        const payload = {
            role: getUser.role.name,
            sub: getUser.id.toString(),
        };
    
        return {
            accessToken: this.signJWT({
                payload,
                secret: process.env.JWT_SECRET,
                expires: '1h',
            })
        };
    }

}