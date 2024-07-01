import { DataSource, Repository } from "typeorm";
import { ParkingEntity } from "./entities/parking.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class ParkingRepository extends Repository<ParkingEntity> {
    constructor(
        @InjectRepository(ParkingEntity)
        private repository: Repository<ParkingEntity>,
        private readonly dataSource: DataSource
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner,
        );
    }

    async saveParking(parking: ParkingEntity): Promise<ParkingEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const savedParking = await queryRunner.manager.save(parking);
            await queryRunner.commitTransaction();
            return savedParking;
        } catch (e) {
            if (queryRunner.isTransactionActive)
                await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    async deleteParking(id: number): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(ParkingEntity, id);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    async findParkingById(id: number): Promise<ParkingEntity> {
        return await this.repository.createQueryBuilder('parking')
            .leftJoinAndSelect('parking.user', 'user')
            .leftJoinAndSelect('user.role', 'role')
            .where('parking.id = :id', { id })
            .getOne();
    }

    async findAllParkings(): Promise<ParkingEntity[]> {
        return await this.repository.createQueryBuilder('parking')
            .leftJoinAndSelect('parking.user', 'user')
            .leftJoinAndSelect('user.role', 'role')
            .getMany();
    }

    async findAllParkingsByUserId(userId: number): Promise<ParkingEntity[]> {
        return await this.repository.createQueryBuilder('parking')
            .leftJoinAndSelect('parking.user', 'user')
            .leftJoinAndSelect('user.role', 'role')
            .where('user.id = :userId', { userId })
            .getMany();
    }

    async existsByIdAndUserId(id: number, userId: number): Promise<boolean> {
        return await this.repository.createQueryBuilder('parking')
            .leftJoin('parking.user', 'user')
            .where('parking.id = :id', { id })
            .andWhere('user.id = :userId', { userId })
            .getCount() > 0;
    }

    async existsById(id: number): Promise<boolean> {
        return await this.repository.createQueryBuilder('parking')
            .where('parking.id = :id', { id })
            .getCount() > 0;
    }
}