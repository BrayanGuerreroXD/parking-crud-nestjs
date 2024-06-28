import { Module } from '@nestjs/common';
import { ParkingRecordsService } from './parking-records.service';
import { ParkingRecordsController } from './parking-records.controller';
import { ParkingRecordEntity } from './entities/parking.record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from '../tokens/tokens.module';
import { ParkingsModule } from '../parkings/parkings.module';
import { ParkingRecordRepository } from './parking-records.repository';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { HistoriesModule } from '../histories/histories.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ ParkingRecordEntity ]),
    TokensModule,
    ParkingsModule,
    VehiclesModule,
    HistoriesModule,
    UsersModule
  ],
  controllers: [ParkingRecordsController],
  providers: [ParkingRecordsService, ParkingRecordRepository],
})
export class ParkingRecordsModule {}
