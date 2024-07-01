import { DataSource, Repository } from "typeorm";
import { ParkingRecordEntity } from "./entities/parking.record.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class ParkingRecordRepository extends Repository<ParkingRecordEntity> {
    constructor(
        @InjectRepository(ParkingRecordEntity)
        private repository: Repository<ParkingRecordEntity>,
        private readonly dataSource : DataSource
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner,
        );
    }

    async saveParkingRecord(parkingRecord: ParkingRecordEntity): Promise<ParkingRecordEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const result = await queryRunner.manager.save(parkingRecord);
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

    /**
     * (ADMIN and SOCIO) return the 10 vehicles that have been registered the most times in the different parking lots and how many
     * times they have been registered different parking lots and how many times they have been
     */

    async getMostRegisteredVehiclesAtAllParking() : Promise<object[]> {
        return await this.repository.createQueryBuilder('parkingRecord')
            .select('vehicle.id')
            .addSelect('vehicle.plate')
            .addSelect('COUNT(parkingRecord.vehicle.id) AS recordCount')
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
            .addSelect('COUNT(parkingRecord.vehicle.id) AS recordCount')
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

    /**
     * (ADMIN and SOCIO) return the 10 vehicles that have been registered the most times in a parking 
     * lot and how many times they have been registered.
     */

    async getMostRegisteredVehiclesAtAllParkingByParkingId(parkingId: number) : Promise<object[]> {
        return await this.repository.createQueryBuilder('parkingRecord')
            .select('vehicle.id')
            .addSelect('vehicle.plate')
            .addSelect('COUNT(parkingRecord.vehicle.id) AS recordCount')
            .leftJoin('parkingRecord.vehicle', 'vehicle')
            .leftJoin('parkingRecord.parking', 'parking')
            .where('parking.id = :parkingId', { parkingId })
            .groupBy('vehicle.id')
            .addGroupBy('vehicle.plate')
            .orderBy('recordCount', 'DESC')
            .limit(10)
            .getRawMany();
    }

    async getMostRegisteredVehiclesAtAllParkingByParkingIdAndUserId(parkingId: number, userId: number) : Promise<object[]> {
        return await this.repository.createQueryBuilder('parkingRecord')
            .select('vehicle.id')
            .addSelect('vehicle.plate')
            .addSelect('COUNT(parkingRecord.vehicle.id) AS recordCount')
            .leftJoin('parkingRecord.vehicle', 'vehicle')
            .leftJoin('parkingRecord.parking', 'parking')
            .leftJoin('parking.user', 'user')
            .where('parking.id = :parkingId', { parkingId })
            .andWhere('user.id = :userId', { userId })
            .groupBy('vehicle.id')
            .addGroupBy('vehicle.plate')
            .orderBy('recordCount', 'DESC')
            .limit(10)
            .getRawMany();
    }

    /**
     * (ADMIN and SOCIO) verify which vehicles are parked for the first time in that parking lot.
     */

    async getParkingRecordsFirstTimeWithExitDateNullByParkingId(parkingId: number): Promise<ParkingRecordEntity[]> {
        const subQuery = this.createQueryBuilder('r')
            .select('COUNT(r)')
            .where('r.vehicle.id = pr.vehicle.id')
            .andWhere('r.parking.id = :parkingId', { parkingId });

        const qb = this.createQueryBuilder('pr')
            .leftJoinAndSelect('pr.vehicle', 'v')
            .where('pr.parking.id = :parkingId', { parkingId })
            .andWhere('pr.exitDate IS NULL')
            .andWhere(`(${subQuery.getQuery()}) = 1`);

        const results = await qb.getMany();
        return results;
    }
    
    async getParkingRecordsFirstTimeWithExitDateNullByParkingIdAndUserId(parkingId: number, userId: number): Promise<ParkingRecordEntity[]> {
        const subQuery = this.createQueryBuilder('r')
            .select('COUNT(r)')
            .where('r.vehicle.id = pr.vehicle.id')
            .andWhere('r.parking.id = :parkingId', { parkingId });

        const qb = this.createQueryBuilder('pr')
            .leftJoinAndSelect('pr.vehicle', 'v')
            .leftJoinAndSelect('pr.parking', 'park')
            .leftJoinAndSelect('park.user', 'user')
            .where('park.id = :parkingId', { parkingId })
            .andWhere('user.id = :userId', { userId })
            .andWhere('pr.exitDate IS NULL')
            .andWhere(`(${subQuery.getQuery()}) = 1`);

        const results = await qb.getMany();
        return results;
    }

    /**
     * (ADMIN and PARTNER) Search for parked vehicles by matching license plate, e.g. entry "HT", 
     * you can return vehicles with license plate "123HT4" | "HT231E".
     */

    async getParkingRecordsByVehiclePlateMatches(plate: string): Promise<ParkingRecordEntity[]> {
        return await this.repository.createQueryBuilder('parkingRecord')
            .leftJoinAndSelect('parkingRecord.vehicle', 'vehicle')
            .where('UPPER(vehicle.plate) LIKE UPPER(:plate)', { plate: `%${plate}%` })
            .andWhere('parkingRecord.exitDate IS NULL')
            .getMany();
    }    

    async getParkingRecordsByUserIdAndVehiclePlateMatches(userId: number, plate: string): Promise<ParkingRecordEntity[]> {
        return await this.repository.createQueryBuilder('parkingRecord')
            .leftJoinAndSelect('parkingRecord.vehicle', 'vehicle')
            .leftJoinAndSelect('parkingRecord.parking', 'parking')
            .leftJoinAndSelect('parking.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('UPPER(vehicle.plate) LIKE UPPER(:plate)', { plate: `%${plate}%` })
            .andWhere('parkingRecord.exitDate IS NULL')
            .getMany();
    }

}