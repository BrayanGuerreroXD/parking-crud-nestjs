import { Controller, Get, Post, Body, Param, HttpCode, UseGuards } from '@nestjs/common';
import { ParkingRecordsService } from './parking-records.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { ParkingRecordRequestDto } from './dto/parking-record.request.dto';
import { ParkingRecordEntryResponseDto, ParkingRecordExitResponseDto } from './dto/parking-record.response.dto';
import { VehicleResponseDto } from '../vehicles/dto/vehicle.response.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('parking-record')
@UseGuards(RolesGuard, AuthGuard)
export class ParkingRecordsController {
  constructor(
    private readonly parkingRecordsService: ParkingRecordsService
  ) {}

  @Post('entry')
  @Roles('SOCIO')
  @HttpCode(200)
  async createParkingEntryRecord(@Body() body : ParkingRecordRequestDto) : Promise<ParkingRecordEntryResponseDto> {
    return await this.parkingRecordsService.createParkingEntryRecord(body);
  }

  @Post('exit')
  @Roles('SOCIO')
  @HttpCode(200)
  async createParkingExitRecord(@Body() body : ParkingRecordRequestDto) : Promise<ParkingRecordExitResponseDto> {
    return await this.parkingRecordsService.createParkingExitRecord(body);
  }

  // Get the vehicles currently parked in a specific parking lot.
  @Get('parked-vehicles/parkingId/:parkingId')
  @Roles('SOCIO', 'ADMIN')
  @HttpCode(200)
  async getParkingRecordsWithExitDateNullByParkingId(@Param('parkingId') parkingId: number) : Promise<ParkingRecordEntryResponseDto[]> {
    return await this.parkingRecordsService.getParkingRecordsWithExitDateNullByParkingId(parkingId);
  }

  // Find the top 10 vehicles that have been registered the most times in all parking lots and how many times they have been registered.
  @Get('parked-vehicles/most-registered')
  @Roles('SOCIO', 'ADMIN')
  @HttpCode(200)
  async getMostRegisteredVehiclesAtAllParking() : Promise<VehicleResponseDto[]> {
    return await this.parkingRecordsService.getMostRegisteredVehiclesAtAllParking();
  }

  // // Find the 10 vehicles that have been registered the most times in a specific parking lot and how many times they have been registered.
  // @Get('parked-vehicles/most-registered/parkingId/:parkingId')
  // @Roles('SOCIO', 'ADMIN')
  // @HttpCode(200)
  // async getMostRegisteredVehiclesAtAllParkingByParkingId(@Param('parkingId') parkingId: number) : Promise<VehicleResponseDto[]> {
  //   return await this.parkingRecordsService.getMostRegisteredVehiclesAtAllParkingByParkingId(parkingId);
  // }

  // // Obtain vehicles parked for the first time in that parking lot.
  // @Get('parked-vehicles/first-time/parkingId/:parkingId')
  // @Roles('SOCIO', 'ADMIN')
  // @HttpCode(200)
  // async getParkingRecordsFirstTimeWithExitDateNullByParkingId(@Param('parkingId') parkingId: number) : Promise<ParkingRecordEntryResponseDto[]> {
  //   return await this.parkingRecordsService.getParkingRecordsFirstTimeWithExitDateNullByParkingId(parkingId);
  // }

  // // Search for parked vehicles by license plate match
  // @Get('parked-vehicles/matches/plate/:plate')
  // @Roles('SOCIO', 'ADMIN')
  // @HttpCode(200)
  // async getParkingRecordsByVehiclePlateMatches(@Param('plate') plate: string) : Promise<ParkingRecordEntryResponseDto[]> {
  //   return await this.parkingRecordsService.getParkingRecordsByVehiclePlateMatches(plate);
  // }

}