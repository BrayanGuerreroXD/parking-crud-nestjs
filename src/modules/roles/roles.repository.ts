import { Repository } from "typeorm";
import { RoleEntity } from "./entities/role.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class RolesRepository extends Repository<RoleEntity> {
    constructor(
        @InjectRepository(RoleEntity)
        private repository: Repository<RoleEntity>,
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner
        );
    }

    async findRoleByName(name: string): Promise<RoleEntity> {
        return await this.repository.createQueryBuilder('role')
            .where({ name })
            .getOne();
    }
}