import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleEntity } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesRepository } from './roles.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ RoleEntity ]),
  ],
  providers: [RolesService, RolesRepository],
  exports: [RolesService, TypeOrmModule],
})
export class RolesModule {}
