import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UsersModule } from '../users/users.module';
import { ParkingsModule } from '../parkings/parkings.module';

@Module({
  imports: [
    UsersModule,
    ParkingsModule
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
