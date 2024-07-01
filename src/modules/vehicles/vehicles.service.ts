import { Injectable } from '@nestjs/common';
import { VehicleEntity } from './entities/vehicle.entity';
import { VehiclesRepository } from './vehicles.repository';

@Injectable()
export class VehiclesService {

  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
  ) {}

  public async createVehicle(plate: string) : Promise<VehicleEntity> {
    const vehicleEntity: VehicleEntity = new VehicleEntity();
    vehicleEntity.plate = plate.toUpperCase();
    const savedVehicle = await this.vehiclesRepository.saveVehicle(vehicleEntity);
    return savedVehicle;
  }

  public async existsVehicleByPlate(plate: string) : Promise<boolean> {
    return await this.vehiclesRepository.existsByPlate(plate);
  }

  public async getVehicleByPlate(plate: string) : Promise<VehicleEntity> {
    return await this.vehiclesRepository.findByPlate(plate);
  }
}
