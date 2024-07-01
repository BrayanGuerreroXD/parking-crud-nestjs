import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(
        @InjectRepository(UserEntity)
        private repository: Repository<UserEntity>,
        private readonly dataSource: DataSource,
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

    async saveUser(user: UserEntity): Promise<UserEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const savedUser = await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
            return savedUser;
        } catch (e) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw e;
        } finally {
            await queryRunner.release();
        }
    }
}
