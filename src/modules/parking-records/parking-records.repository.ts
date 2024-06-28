import { Repository } from "typeorm";
import { ParkingRecordEntity } from "./entities/parking.record.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class ParkingRecordRepository extends Repository<ParkingRecordEntity> {
    constructor(
        @InjectRepository(ParkingRecordEntity)
        private repository: Repository<ParkingRecordEntity>,
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner,
        );
    }

    async countByParkingIdAndExitDateIsNull(parkingId: number): Promise<number> {
        return await this.repository.count({
            where: {
                parking: {
                    id: parkingId
                },
                exitDate: null
            }
        });
    }

    async getLastParkingRecordByVehiclesPlate(plate: string): Promise<ParkingRecordEntity> {
        return await this.repository.createQueryBuilder('parkingRecord')
            .leftJoinAndSelect('parkingRecord.vehicle', 'vehicle')
            .leftJoinAndSelect('parkingRecord.parking', 'parking')
            .where('vehicle.plate = :plate', { plate })
            .orderBy('parkingRecord.entryDate', 'DESC')
            .getOne();
    }

    async findByParkingIdAndExitDateIsNull(parkingId: number): Promise<ParkingRecordEntity[]> {
        return await this.repository.createQueryBuilder('parkingRecord')
            .leftJoinAndSelect('parkingRecord.vehicle', 'vehicle')
            .leftJoinAndSelect('parkingRecord.parking', 'parking')
            .where('parking.id = :parkingId', { parkingId })
            .andWhere('parkingRecord.exitDate IS NULL')
            .getMany();
    }

    async findByParkingIdAndParkingUserIdAndExitDateIsNull(parkingId: number, userId: number): Promise<ParkingRecordEntity[]> {
        return await this.repository.createQueryBuilder('parkingRecord')
            .leftJoinAndSelect('parkingRecord.vehicle', 'vehicle')
            .leftJoinAndSelect('parkingRecord.parking', 'parking')
            .leftJoinAndSelect('parking.user', 'user')
            .where('parking.id = :parkingId', { parkingId })
            .andWhere('user.id = :userId', { userId })
            .andWhere('parkingRecord.exitDate IS NULL')
            .getMany();
    }

    async getMostRegisteredVehiclesAtAllParking() : Promise<object[]> {
        return await this.repository.createQueryBuilder('parkingRecord')
            .select('vehicle.id')
            .addSelect('vehicle.plate')
            .addSelect('COUNT(parkingRecord.vehicleId)', 'recordCount')
            .leftJoin('parkingRecord.vehicle', 'vehicle')
            .groupBy('vehicle.id')
            .addGroupBy('vehicle.plate')
            .orderBy('recordCount', 'DESC')
            .limit(10)
            .getRawMany();
    }

    async getMostRegisteredVehiclesAtAllParkingByUserId(userId: number) : Promise<object[]> {
        return await this.repository.createQueryBuilder('parkingRecord')
            .select('vehicle.id')
            .addSelect('vehicle.plate')
            .addSelect('COUNT(parkingRecord.vehicleId)', 'recordCount')
            .leftJoin('parkingRecord.vehicle', 'vehicle')
            .leftJoin('parkingRecord.parking', 'parking')
            .leftJoin('parking.user', 'user')
            .where('user.id = :userId', { userId })
            .groupBy('vehicle.id')
            .addGroupBy('vehicle.plate')
            .orderBy('recordCount', 'DESC')
            .limit(10)
            .getRawMany();
    }

}