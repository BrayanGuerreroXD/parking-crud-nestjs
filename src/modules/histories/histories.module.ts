import { Module } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { HistoriesController } from './histories.controller';
import { HistoryEntity } from './entities/history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingsModule } from '../parkings/parkings.module';
import { TokensModule } from '../tokens/tokens.module';
import { HistoriesRepository } from './histories.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ HistoryEntity ]),
    TokensModule,
    ParkingsModule,
    UsersModule
  ],
  controllers: [HistoriesController],
  providers: [HistoriesService, HistoriesRepository],
  exports: [HistoriesService]
})
export class HistoriesModule {}
