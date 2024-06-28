import { Module } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { ParkingsController } from './parkings.controller';
import { ParkingEntity } from './entities/parking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/users/users.module';
import { ParkingRepository } from './parkings.repository';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ ParkingEntity ]),
    UsersModule,
    TokensModule
  ],
  controllers: [ParkingsController],
  providers: [ParkingsService, ParkingRepository],
})
export class ParkingsModule {}
