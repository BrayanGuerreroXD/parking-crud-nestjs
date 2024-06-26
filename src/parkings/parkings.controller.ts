import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ParkingRequestDto } from './dto/parking.request.dto';
import { ParkingResponseDto } from './dto/parking.response.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller()
@UseGuards(RolesGuard, AuthGuard)
export class ParkingsController {
  constructor(private readonly parkingsService: ParkingsService) {}

  @Post('parking')
  @Roles('ADMIN')
  async createParking(@Body() body: ParkingRequestDto) : Promise<ParkingResponseDto> {
    return this.parkingsService.createParking(body);
  }
}