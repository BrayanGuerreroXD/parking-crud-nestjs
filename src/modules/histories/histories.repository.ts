import { Repository } from "typeorm";
import { HistoryEntity } from "./entities/history.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class HistoriesRepository extends Repository<HistoryEntity> {

    constructor(
        @InjectRepository(HistoryEntity)
        private repository: Repository<HistoryEntity>,
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner,
        );
    }

    // async countByParkingIdAndExitDateIsNull(parkingId: number, startDate: Date, endDate: Date): Promise<number> {
    //     return await this.repository.createQueryBuilder('history')
    //         .leftJoin('history.parkingRecord', 'parkingRecord')
    //         .leftJoin('parkingRecord.parking', 'parking')
    //         .where('parking.id = :parkingId', { parkingId })
    //         .andWhere('parkingRecord.entryDate between :startDate and :endDate', { startDate, endDate })
    //         .andWhere('parkingRecord.exitDate between :startDate and :endDate', { startDate, endDate })
    //         .getCount();
    // }

    // @Query("SELECT SUM(hr.totalCost) FROM History hr WHERE hr.parkingRecord.parking.id = :parkingId AND "
    //     + "hr.parkingRecord.entryDate BETWEEN :startDate AND :endDate AND hr.parkingRecord.exitDate BETWEEN :startDate AND :endDate")
    // Double calculateEarningsByDateRange(@Param("parkingId") Long parkingId, 
    //                                     @Param("startDate") LocalDateTime startDate,
    //                                     @Param("endDate") LocalDateTime endDate);

    async countByParkingIdAndExitDateIsNull(parkingId: number, startDate: Date, endDate: Date): Promise<number> {
        const queryBuilder = this.repository.createQueryBuilder('hr');
        const totalCost = await queryBuilder
            .select('SUM(hr.totalCost)', 'totalEarned')
            .innerJoin('hr.parkingRecord', 'pr', 'pr.id = hr.parkingRecord.id')
            .innerJoin('pr.parking', 'p', 'p.id = :parkingId', { parkingId })
            .where('pr.entryDate BETWEEN :startDate AND :endDate', { startDate, endDate })
            .andWhere('pr.exitDate BETWEEN :startDate AND :endDate', { startDate, endDate })
            .getRawOne();
        return totalCost.totalEarned || 0;
    }
}