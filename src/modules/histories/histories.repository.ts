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

    async countByParkingIdAndExitDateIsNull(parkingId: number, startDate: Date, endDate: Date): Promise<number> {
        return await this.repository.createQueryBuilder('history')
            .leftJoin('history.parkingRecord', 'parkingRecord')
            .leftJoin('parkingRecord.parking', 'parking')
            .where('parking.id = :parkingId', { parkingId })
            .andWhere('parkingRecord.entryDate between :startDate and :endDate', { startDate, endDate })
            .andWhere('parkingRecord.exitDate between :startDate and :endDate', { startDate, endDate })
            .getCount();
    }
}