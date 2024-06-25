import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './config/data.source';
import { MotorsModule } from './motors/motors.module';
import { MotorsModule } from './motors/motors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    TypeOrmModule.forRoot({...DataSourceConfig}),
    MotorsModule,
  ]
})
export class AppModule {}
