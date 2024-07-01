import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokenEntity } from './entities/token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensRepository } from './tokens.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ TokenEntity ])
  ],
  providers: [TokensService, TokensRepository],
  exports: [TokensService]
})
export class TokensModule {}
