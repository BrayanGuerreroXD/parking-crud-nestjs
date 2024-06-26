import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { ParkingRecordsModule } from './parking-records/parking-records.module';
import { ParkingsModule } from './parkings/parkings.module';
import { HistoriesModule } from './histories/histories.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({...DataSourceConfig}),
    UsersModule,
    RolesModule,
    VehiclesModule,
    TokensModule,
    AuthModule,
    HistoriesModule,
    ParkingsModule,
    ParkingRecordsModule,
  ],
})
export class AppModule {}
