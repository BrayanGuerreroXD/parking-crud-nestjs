import { Inject, Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenEntity } from './entities/token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useToken } from 'src/utils/user.token';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { InvalidTokenException, JwtAuthException } from 'src/exception-handler/exceptions.classes';
import { IUseToken } from '../auth/interfaces/auth.interface';

import { Request } from 'express';


@Injectable()
export class TokensService {

    constructor(
        @InjectRepository(TokenEntity) private readonly tokenRepository : Repository<TokenEntity>,
        @Inject('REQUEST') private readonly request: Request,
    ) {}

    public async createToken(createTokenDto: CreateTokenDto) {
        const tokens = await this.findAllByUserId(createTokenDto.user);
        const NUMBER_SESSIONS = process.env.NUMBER_SESSIONS;

        tokens.forEach((token, index) => {
          try {
              const manageToken: IUseToken = useToken(token.value);
              if (manageToken.isExpired) {
                  this.removeTokenByValueAndUserId(token.value, createTokenDto.user);
                  tokens.splice(index, 1);
              }
            } catch (e) {
                this.removeTokenByValueAndUserId(token.value, createTokenDto.user);
                tokens.splice(index, 1);
            }
        });

        if (tokens.length >= NUMBER_SESSIONS) 
            throw new JwtAuthException(`User has more than ${NUMBER_SESSIONS} ${NUMBER_SESSIONS > 1 ? 'sessions' : 'session'}.`);

        const user = new UserEntity();
        user.id = createTokenDto.user;

        const token = new TokenEntity();
        token.value = createTokenDto.value;
        token.user = user;

        await this.tokenRepository.save(token);
    }

    public async removeToken(toke: string) {
        const manageToken: IUseToken = useToken(toke);
        const userId = +manageToken.sub;
        if (manageToken.isExpired)
            throw new JwtAuthException('Token is expired');
        await this.removeTokenByValueAndUserId(toke, userId);
    }

    // Get the role of the user by the string token
    public async getRolesByToken(token: string): Promise<string> {
        const manageToken: IUseToken = useToken(token);
        return manageToken.role;
    }

    // Get the role of the user by the request token
    public async getRoleByRequestToken() : Promise<string> {
        const headers = this.request.headers;
        const bearerToken = headers['authorization']

        if (!bearerToken || Array.isArray(bearerToken))
            throw new InvalidTokenException();

        const token = bearerToken.split('Bearer ')[1];
        const manageToken: IUseToken = useToken(token);
        return manageToken.role;
    }

    // Get the user id by the string token
    public async getUserIdByToken(token: string): Promise<number> {
        const manageToken: IUseToken = useToken(token);
        return +manageToken.sub;
    }

    // Get the user id by the request token
    public async getUserIdByRequestToken() : Promise<number> {
        const headers = this.request.headers;
        const bearerToken = headers['authorization']

        if (!bearerToken || Array.isArray(bearerToken))
            throw new InvalidTokenException();

        const token = bearerToken.split('Bearer ')[1];
        const manageToken: IUseToken = useToken(token);
        return +manageToken.sub;
    }

    public async existsToken(token: string): Promise<boolean> {
        const manageToken: IUseToken = useToken(token);
        const userId = +manageToken.sub;
    
        const tokenExists = await this.tokenRepository
            .createQueryBuilder('token')
            .leftJoin('token.user', 'user')
            .where('token.value = :token', { token })
            .andWhere('user.id = :userId', { userId })
            .getCount() > 0;
    
        return tokenExists;
    }

    private async removeTokenByValueAndUserId(value: string, userId: number) {
        const token = await this.tokenRepository.createQueryBuilder('token')
            .leftJoinAndSelect('token.user', 'user')
            .where('token.value = :value', { value })
            .andWhere('user.id = :userId', { userId })
            .getOne();
        if (!token)
            throw new JwtAuthException('Token not found');
        await this.tokenRepository.remove(token);
    }    

    private async findAllByUserId(userId: number): Promise<TokenEntity[]> {
        return await this.tokenRepository.createQueryBuilder('token')
            .where('token.user.id = :userId', { userId })
            .getMany();
    }

}