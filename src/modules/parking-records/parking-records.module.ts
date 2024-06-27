import { Module } from '@nestjs/common';
import { ParkingRecordsService } from './parking-records.service';
import { ParkingRecordsController } from './parking-records.controller';

@Module({
  controllers: [ParkingRecordsController],
  providers: [ParkingRecordsService],
})
export class ParkingRecordsModule {}
