import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehicleEntity } from './entities/vehicle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesRepository } from './vehicles.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ VehicleEntity ]),
  ],
  providers: [VehiclesService, VehiclesRepository],
  exports: [VehiclesService],
})
export class VehiclesModule {}
