import { Repository } from "typeorm";
import { ParkingEntity } from "./entities/parking.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class ParkingRepository extends Repository<ParkingEntity> {
    constructor(
        @InjectRepository(ParkingEntity)
        private repository: Repository<ParkingEntity>,
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner,
        );
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