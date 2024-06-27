import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RolesModule } from '../roles/roles.module';
import { UserRepository } from './users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ UserEntity ]),
    RolesModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
