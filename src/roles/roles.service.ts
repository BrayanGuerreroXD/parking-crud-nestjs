import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';

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
              throw new ErrorManager({ type: "NOT_FOUND", message: 'Role not found' });

            return role;
        } catch (e) {
          throw ErrorManager.createSignatureError(e.message);  
        }
    }
}