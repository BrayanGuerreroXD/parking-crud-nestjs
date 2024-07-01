import { DataSource, DeleteResult, Repository } from "typeorm";
import { TokenEntity } from "./entities/token.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class TokensRepository extends Repository<TokenEntity> {
    constructor(
        @InjectRepository(TokenEntity) private repository: Repository<TokenEntity>,
        private readonly dataSource: DataSource
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner,
        );
    }

    async findAllByUserId(userId: number): Promise<TokenEntity[]> {
        return await this.repository.createQueryBuilder('token')
            .where('token.user.id = :userId', { userId })
            .getMany();
    }

    async findByValueAndUserId(value: string, userId: number): Promise<TokenEntity> {
        return await this.repository.createQueryBuilder('token')
            .leftJoinAndSelect('token.user', 'user')
            .where('token.value = :value', { value })
            .andWhere('user.id = :userId', { userId })
            .getOne();
    }

    async existsByValueAndUserId(value: string, userId: number): Promise<boolean> {
        return await this.repository.createQueryBuilder('token')
            .leftJoin('token.user', 'user')
            .where('token.value = :value', { value })
            .andWhere('user.id = :userId', { userId })
            .getCount() > 0;
    }

    async saveToken(token: TokenEntity): Promise<TokenEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const savedToken = await queryRunner.manager.save(token);
            await queryRunner.commitTransaction();
            return savedToken;
        } catch (e) {
            if (queryRunner.isTransactionActive)
                await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    async removeToken(value: string, userId: number) : Promise<DeleteResult> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const result = await queryRunner.manager.createQueryBuilder()
                .delete()
                .from(TokenEntity)
                .where('value = :value', { value })
                .andWhere('user.id = :userId', { userId })
                .execute();
            await queryRunner.commitTransaction();
            return result;
        } catch (e) {
            if (queryRunner.isTransactionActive)
                await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }
}