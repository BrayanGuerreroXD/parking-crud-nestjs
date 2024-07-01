import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MailRequestDto } from './dto/mail.request.dto';

@Controller()
@UseGuards(AuthGuard, RolesGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post("sending-mail")
  @Roles('ADMIN')
  async sendMail(@Body() mailRequestDto: MailRequestDto) {
    return await this.mailService.sendMail(mailRequestDto);
  }
  
}