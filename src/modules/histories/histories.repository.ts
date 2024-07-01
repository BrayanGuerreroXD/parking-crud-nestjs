import { DataSource, Repository } from "typeorm";
import { HistoryEntity } from "./entities/history.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class HistoriesRepository extends Repository<HistoryEntity> {

    constructor(
        @InjectRepository(HistoryEntity)
        private repository: Repository<HistoryEntity>,
        private readonly dataSource: DataSource
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner,
        );
    }

    async saveHistory(body : HistoryEntity) : Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(body);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

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