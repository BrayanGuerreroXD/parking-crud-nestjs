import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TokensModule } from 'src/modules/tokens/tokens.module';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [UsersModule, TokensModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
