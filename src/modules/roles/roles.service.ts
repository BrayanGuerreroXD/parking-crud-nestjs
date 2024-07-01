import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RoleEntity } from './entities/role.entity';
import { EntityNotFoundException } from 'src/exception-handler/exceptions.classes';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
    constructor(
        private readonly roleRepository: RolesRepository,
    ) {}

    public async findByName(name: string): Promise<RoleEntity> {
        try {
            const role: RoleEntity = await this.roleRepository.findRoleByName(name);

            if (!role) 
              throw new EntityNotFoundException('Role not found');

            return role;
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);   
        }
    }
}