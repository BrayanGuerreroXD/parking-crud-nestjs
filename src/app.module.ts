import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { ParkingsModule } from './modules/parkings/parkings.module';
import { HistoriesModule } from './modules/histories/histories.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { ParkingRecordsModule } from './modules/parking-records/parking-records.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';

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
    MailModule,
  ],
})
export class AppModule {}
