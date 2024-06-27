import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from 'src/exception-handler/exceptions.classes';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
    ) {}

    public async findByName(name: string): Promise<RoleEntity> {
        try {
            const role: RoleEntity = await this.roleRepository
                .createQueryBuilder('role')
                .where({ name })
                .getOne();

            if (!role) 
              throw new EntityNotFoundException('Role not found');

            return role;
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);   
        }
    }
}