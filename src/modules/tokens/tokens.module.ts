import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokenEntity } from './entities/token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ TokenEntity ])
  ],
  providers: [TokensService],
  exports: [TokensService]
})
export class TokensModule {}
