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

    // async getParkingRecordsFirstTimeWithExitDateNullByParkingId(parkingId: number) : Promise<ParkingRecordEntity[]> {
    //     return await this.repository.createQueryBuilder('parkingRecord')
    //         .leftJoinAndSelect('parkingRecord.vehicle', 'vehicle')
    //         .leftJoinAndSelect('parkingRecord.parking', 'parking')
    //         .where('parking.id = :parkingId', { parkingId })
    //         .andWhere('parkingRecord.exitDate IS NULL')
    //         .andWhere('vehicle.id NOT IN (SELECT vehicle.id FROM parkingRecord WHERE parking.id = :parkingId AND pr.exitdate IS NOT NULL)')
    //         .getMany();
    // }

    // async getParkingRecordsFirstTimeWithExitDateNullByParkingIdAndUserId(parkingId: number, userId: number) : Promise<ParkingRecordEntity[]> {
    //     return await this.repository.createQueryBuilder('parkingRecord')
    //         .leftJoinAndSelect('parkingRecord.vehicle', 'vehicle')
    //         .leftJoinAndSelect('parkingRecord.parking', 'parking')
    //         .leftJoinAndSelect('parking.user', 'user')
    //         .where('parking.id = :parkingId', { parkingId })
    //         .andWhere('user.id = :userId', { userId })
    //         .andWhere('parkingRecord.exitDate IS NULL')
    //         .andWhere('vehicle.id NOT IN (SELECT vehicle.id FROM parkingRecord WHERE parking.id = :parkingId AND exitdate IS NOT NULL)')
    //         .getMany();
    // }

    async getParkingRecordsFirstTimeWithExitDateNullByParkingId(parkingId: number): Promise<ParkingRecordEntity[]> {
        const subQuery = this.createQueryBuilder('r')
            .select('COUNT(r.id)')
            .where('r.vehicle_id = pr.vehicle_id')
            .andWhere('r.parking_id = :parkingId', { parkingId });

        const qb = this.createQueryBuilder('pr')
            .leftJoin('pr.vehicle', 'v')
            .where('pr.parking_id = :parkingId', { parkingId })
            .andWhere('pr.exit_date IS NULL')
            .andWhere(`(${subQuery.getQuery()}) = 1`);

        const results = await qb.getMany();
        return results;
    }

    async getParkingRecordsFirstTimeWithExitDateNullByParkingIdAndUserId(parkingId: number, userId: number): Promise<ParkingRecordEntity[]> {
        const qb = this.createQueryBuilder('pr')
            .leftJoin('pr.vehicle', 'v')
            .leftJoin('pr.parking', 'park')
            .leftJoin('park.user', 'u')
            .where('pr.parking_id = :parkingId', { parkingId })
            .andWhere('pr.exit_date IS NULL')
            .andWhere('u.id = :userId', { userId })
            .andWhere(subQuery => {
                subQuery.select('COUNT(r.id)')
                    .from(ParkingRecordEntity, 'r')
                    .where('r.vehicle_id = pr.vehicle_id')
                    .andWhere('r.parking_id = :parkingId', { parkingId });
                return `(${subQuery.getQuery()}) = 1`;
            });

        const results = await qb.getMany();
        return results;
    }

    // @Query("SELECT pr FROM ParkingRecord pr " +
    //     "WHERE pr.parking.id = :parkingId " +
    //     "AND pr.exitDate IS NULL " +
    //     "AND (SELECT COUNT(r) FROM ParkingRecord r WHERE r.vehicle.id = pr.vehicle.id AND r.parking.id = :parkingId) = 1")
    // List<ParkingRecord> getParkingRecordsFirstTimeWithExitDateNullByParkingId(@Param("parkingId") Long parkingId);

    // @Query("SELECT pr FROM ParkingRecord pr " +
    //     "WHERE pr.parking.id = :parkingId " +
    //     "ANd pr.exitDate IS NULL " +
    //     "AND pr.parking.user.id = :userId " +
    //     "AND (SELECT COUNT(r) FROM ParkingRecord r WHERE r.vehicle.id = pr.vehicle.id AND r.parking.id = :parkingId) = 1")
    // List<ParkingRecord> getParkingRecordsFirstTimeWithExitDateNullByParkingIdAndUserId(@Param("parkingId") Long parkingId, @Param("userId") Long userId);

}