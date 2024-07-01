import { Injectable } from '@nestjs/common';
import { MailResponseDto } from './dto/mail.response.dto';
import { MailRequestDto } from './dto/mail.request.dto';
import { EmailNotFoundException, NotSendMailException } from 'src/exception-handler/exceptions.classes';
import { ParkingsService } from '../parkings/parkings.service';
import { UsersService } from '../users/users.service';
import { ParkingEntity } from '../parkings/entities/parking.entity';
import fetch from 'node-fetch';

@Injectable()
export class MailService {

  constructor(
    private readonly parkingService : ParkingsService,
    private readonly userService : UsersService,
  ) {}

  async sendMail(mailRequestDto: MailRequestDto): Promise<MailResponseDto> {
    const existEmail = await this.userService.existEmail(mailRequestDto.email);
    if (!existEmail)
      throw new EmailNotFoundException();

    const parking : ParkingEntity = await this.parkingService.getParkingEntityById(mailRequestDto.parkingId);

    const uri  = process.env.URL_API_MAIL;

    const body = JSON.stringify({
      email: mailRequestDto.email,
      plate: mailRequestDto.plate,
      message: mailRequestDto.message,
      parkingName: parking.name
    });

    const headers = { 'Content-Type': 'application/json' };

    let response;
    try {
      response = await fetch(uri, { method: 'post', body, headers });
    } catch (e) {
     throw e; 
    }
    
    if (!response.ok) 
      throw new NotSendMailException();
  
    const jsonResponse: Partial<MailResponseDto> = await response.json();
  
    if (!jsonResponse.message) 
      throw new NotSendMailException();
  
    return jsonResponse as MailResponseDto;
  }

}