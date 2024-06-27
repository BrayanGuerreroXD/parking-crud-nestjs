import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner,
        );
    }

    async findUserById(id: number): Promise<UserEntity> {
        return await this.repository.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .where('user.id = :id', { id })
            .getOne();
    }

    async findByKey(key: string, value: any): Promise<UserEntity | undefined> {
        return await this.repository.createQueryBuilder('user')
            .addSelect('user.password')
            .leftJoinAndSelect('user.role', 'role')
            .where({ [key]: value })
            .getOne();
    }
}
