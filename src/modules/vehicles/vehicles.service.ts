import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { VehicleEntity } from './entities/vehicle.entity';
import { VehiclesRepository } from './vehicles.repository';

@Injectable()
export class VehiclesService {

  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    private readonly dataSource: DataSource
  ) {}

  public async createVehicle(plate: string) : Promise<VehicleEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const vehicleEntity: VehicleEntity = new VehicleEntity();
      vehicleEntity.plate = plate.toUpperCase();
      const savedVehicle = await queryRunner.manager.save(vehicleEntity);
      await queryRunner.commitTransaction();
      return savedVehicle;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  public async existsVehicleByPlate(plate: string) : Promise<boolean> {
    return await this.vehiclesRepository.existsByPlate(plate);
  }

  public async getVehicleByPlate(plate: string) : Promise<VehicleEntity> {
    return await this.vehiclesRepository.findByPlate(plate);
  }
}
