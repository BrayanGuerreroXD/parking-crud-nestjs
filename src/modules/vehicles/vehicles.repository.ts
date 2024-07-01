import { DataSource, Repository } from "typeorm";
import { VehicleEntity } from "./entities/vehicle.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class VehiclesRepository extends Repository<VehicleEntity> {
    constructor(
        @InjectRepository(VehicleEntity)
        private repository: Repository<VehicleEntity>,
        private readonly dataSource: DataSource
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner,
        );
    }

    async saveVehicle(vehicle: VehicleEntity): Promise<VehicleEntity> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const savedVehicle = await queryRunner.manager.save(vehicle);
            await queryRunner.commitTransaction();
            return savedVehicle;
        } catch (e) {
            if (queryRunner.isTransactionActive)
                await queryRunner.rollbackTransaction();
            throw e;
        } finally {
            await queryRunner.release();
        }
    }

    async existsByPlate(plate: string): Promise<boolean> {
        return await this.repository.createQueryBuilder('vehicle')
            .where('vehicle.plate = :plate', { plate })
            .getCount() > 0;
    }

    async findByPlate(plate: string): Promise<VehicleEntity> {
        return await this.repository.createQueryBuilder('vehicle')
            .where('vehicle.plate = :plate', { plate })
            .getOne();
    }
}