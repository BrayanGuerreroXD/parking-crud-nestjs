import { Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { TokenEntity } from './entities/token.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { useToken } from 'src/utils/user.token';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { JwtAuthException } from 'src/exception-handler/exceptions.classes';
import { IUseToken } from '../auth/interfaces/auth.interface';

@Injectable()
export class TokensService {

    constructor(
      @InjectRepository(TokenEntity) private readonly tokenRepository : Repository<TokenEntity>
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

    public async getRolesByToken(token: string): Promise<string> {
        const manageToken: IUseToken = useToken(token);
        return manageToken.role;
    }

    public async getUserIdByToken(token: string): Promise<number> {
        const manageToken: IUseToken = useToken(token);
        return +manageToken.sub;
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