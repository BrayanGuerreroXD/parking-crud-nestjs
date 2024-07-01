import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, HttpCode } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { ParkingRequestDto } from './dto/parking.request.dto';
import { ParkingResponseDto } from './dto/parking.response.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller()
@UseGuards(RolesGuard, AuthGuard)
export class ParkingsController {
  constructor(private readonly parkingsService: ParkingsService) {}

  @Post('parking')
  @Roles('ADMIN')
  @HttpCode(200)
  async createParking(@Body() body: ParkingRequestDto) : Promise<ParkingResponseDto> {
    return this.parkingsService.createParking(body);
  }
  
  @Put('parking/:id')
  @Roles('ADMIN')
  @HttpCode(200)
  async updateParking(@Param('id') id : number, @Body() body: ParkingRequestDto) : Promise<ParkingResponseDto> {
    return this.parkingsService.updateParking(id, body);
  }

  @Get('parking/:id')
  @Roles('ADMIN', 'SOCIO')
  @HttpCode(200)
  async getParkingById(@Param('id') id : number) : Promise<ParkingResponseDto> {
    return this.parkingsService.getParkingById(id);
  }
  
  @Get('parkings')
  @Roles('ADMIN', 'SOCIO')
  @HttpCode(200)
  async getAllParkings() : Promise<ParkingResponseDto[]> {
    return this.parkingsService.getAllParkings();
  }

  @Delete('parking/:id')
  @Roles('ADMIN')
  @HttpCode(200)
  async deleteParking(@Param('id') id : number) : Promise<void> {
    return this.parkingsService.deleteParking(id);
  }
}