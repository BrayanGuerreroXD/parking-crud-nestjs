import { Module } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { ParkingsController } from './parkings.controller';
import { ParkingEntity } from './entities/parking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ ParkingEntity ]),
    UsersModule
  ],
  controllers: [ParkingsController],
  providers: [ParkingsService],
})
export class ParkingsModule {}
