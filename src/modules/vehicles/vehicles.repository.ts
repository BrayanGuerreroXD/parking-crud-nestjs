import { Repository } from "typeorm";
import { VehicleEntity } from "./entities/vehicle.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class VehiclesRepository extends Repository<VehicleEntity> {
    constructor(
        @InjectRepository(VehicleEntity)
        private repository: Repository<VehicleEntity>,
    ) {
        super(
            repository.target,
            repository.manager,
            repository.queryRunner,
        );
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