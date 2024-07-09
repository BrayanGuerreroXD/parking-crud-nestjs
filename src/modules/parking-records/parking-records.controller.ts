import { Controller, Get, Post, Body, Param, HttpCode, UseGuards, HttpStatus } from '@nestjs/common';
import { ParkingRecordsService } from './parking-records.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { ParkingRecordRequestDto } from './dto/parking-record.request.dto';
import { ParkingRecordEntryResponseDto, ParkingRecordExitResponseDto } from './dto/parking-record.response.dto';
import { VehicleResponseDto } from '../vehicles/dto/vehicle.response.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse, ApiParam, ApiOperation } from '@nestjs/swagger';
import { createErrorResponse } from 'src/config/base.swagger.error.response.options';

@ApiTags('Parking Records')
@ApiBearerAuth('access-token')
@Controller('parking-record')
@UseGuards(RolesGuard, AuthGuard)
export class ParkingRecordsController {
  constructor(
    private readonly parkingRecordsService: ParkingRecordsService
  ) {}

  @ApiOperation({ summary: 'Create parking entry record' })
  @ApiBody({ type: ParkingRecordRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: ParkingRecordEntryResponseDto })
  @ApiResponse(createErrorResponse(
    HttpStatus.BAD_REQUEST, 
    'Bad Request - This endpoint can return multiple responses based on bad request', 
    'BadRequestException, ParkingNotAssignedException, ParkingIsFullException, ParkingNotExistsException', 
    [
      'Parking not exists', 'The parking not assigned to the user', 'Parking is full', 'Unable to Register Entry, vehicle already in a parking lot'
    ]
  ))
  @ApiResponse(createErrorResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized - Caused by user does not have permission to access this route', 'JwtAuthException', ['User does not have permission to access this route']))
  @Post('entry')
  @Roles('SOCIO')
  @HttpCode(HttpStatus.OK)
  async createParkingEntryRecord(@Body() body : ParkingRecordRequestDto) : Promise<ParkingRecordEntryResponseDto> {
    return await this.parkingRecordsService.createParkingEntryRecord(body);
  }

  @ApiOperation({ summary: 'Create parking exit record' })
  @ApiBody({ type: ParkingRecordRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: ParkingRecordExitResponseDto })
  @ApiResponse(createErrorResponse(
    HttpStatus.BAD_REQUEST, 
    'Bad Request - This endpoint can return multiple responses based on bad request', 
    'BadRequestException, ParkingNotAssignedException, VehicleNotFoundException, ParkingNotExistsException', 
    [
      'Parking not exists', 
      'The parking not assigned to the user', 
      'Vehicle not found',
      'Unable to Register Exit, no license plate found in any parking lot.', 
      'Unable to Register Exit, vehicle license plate in another parking lot.', 
      'Unable to Register Exit, vehicle not found in a parking lot.'
    ]
  ))
  @ApiResponse(createErrorResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized - Caused by user does not have permission to access this route', 'JwtAuthException', ['User does not have permission to access this route']))
  @Post('exit')
  @Roles('SOCIO')
  @HttpCode(HttpStatus.OK)
  async createParkingExitRecord(@Body() body : ParkingRecordRequestDto) : Promise<ParkingRecordExitResponseDto> {
    return await this.parkingRecordsService.createParkingExitRecord(body);
  }

  @ApiOperation({ summary: 'Get the vehicles currently parked in a specific parking lot' })
  @ApiParam({ name: 'parkingId', type: Number, required: true, description: 'Parking id'})
  @ApiResponse({ status: HttpStatus.OK, type: [ParkingRecordEntryResponseDto] })
  @ApiResponse(createErrorResponse(
    HttpStatus.BAD_REQUEST, 
    'Bad Request - This endpoint can return multiple responses based on bad request', 
    'ParkingNotExistsException, ParkingNotAssignedException', 
    [
      'Parking not exists', 
      'The parking not assigned to the user', 
    ]
  ))
  // Get the vehicles currently parked in a specific parking lot.
  @Get('parked-vehicles/parkingId/:parkingId')
  @Roles('SOCIO', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async getParkingRecordsWithExitDateNullByParkingId(@Param('parkingId') parkingId: number) : Promise<ParkingRecordEntryResponseDto[]> {
    return await this.parkingRecordsService.getParkingRecordsWithExitDateNullByParkingId(parkingId);
  }

  @ApiOperation({ summary: 'Find the top 10 vehicles that have been registered the most times in all parking lots and how many times they have been registered' })
  @ApiResponse({ status: HttpStatus.OK, type: [VehicleResponseDto] })
  // Find the top 10 vehicles that have been registered the most times in all parking lots and how many times they have been registered.
  @Get('parked-vehicles/most-registered')
  @Roles('SOCIO', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async getMostRegisteredVehiclesAtAllParking() : Promise<VehicleResponseDto[]> {
    return await this.parkingRecordsService.getMostRegisteredVehiclesAtAllParking();
  }
  
  @ApiOperation({ summary: 'Find the 10 vehicles that have been registered the most times in a specific parking lot and how many times they have been registered' })
  @ApiParam({ name: 'parkingId', type: Number, required: true, description: 'Parking id'})
  @ApiResponse({ status: HttpStatus.OK, type: [VehicleResponseDto] })
  @ApiResponse(createErrorResponse(
    HttpStatus.BAD_REQUEST, 
    'Bad Request - This endpoint can return multiple responses based on bad request', 
    'ParkingNotExistsException, ParkingNotAssignedException', 
    [
      'Parking not exists', 
      'The parking not assigned to the user', 
    ]
  ))
  // Find the 10 vehicles that have been registered the most times in a specific parking lot and how many times they have been registered.
  @Get('parked-vehicles/most-registered/parkingId/:parkingId')
  @Roles('SOCIO', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async getMostRegisteredVehiclesAtAllParkingByParkingId(@Param('parkingId') parkingId: number) : Promise<VehicleResponseDto[]> {
    return await this.parkingRecordsService.getMostRegisteredVehiclesAtAllParkingByParkingId(parkingId);
  }

  @ApiOperation({ summary: 'Obtain vehicles parked for the first time in that parking lot' })
  @ApiParam({ name: 'parkingId', type: Number, required: true, description: 'Parking id'})
  @ApiResponse({ status: HttpStatus.OK, type: [ParkingRecordEntryResponseDto] })
  @ApiResponse(createErrorResponse(
    HttpStatus.BAD_REQUEST, 
    'Bad Request - This endpoint can return multiple responses based on bad request', 
    'ParkingNotExistsException, ParkingNotAssignedException', 
    [
      'Parking not exists', 
      'The parking not assigned to the user', 
    ]
  ))
  // Obtain vehicles parked for the first time in that parking lot.
  @Get('parked-vehicles/first-time/parkingId/:parkingId')
  @Roles('SOCIO', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async getParkingRecordsFirstTimeWithExitDateNullByParkingId(@Param('parkingId') parkingId: number) : Promise<ParkingRecordEntryResponseDto[]> {
    return await this.parkingRecordsService.getParkingRecordsFirstTimeWithExitDateNullByParkingId(parkingId);
  }

  @ApiOperation({ summary: 'Obtain vehicles parked for the first time in all parking lots' })
  @ApiParam({name: 'plate', type: String, required: true, description: 'Vehicle plate number'})
  @ApiResponse({ status: HttpStatus.OK, type: [ParkingRecordEntryResponseDto] })
  // Search for parked vehicles by license plate match
  @Get('parked-vehicles/matches/plate/:plate')
  @Roles('SOCIO', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async getParkingRecordsByVehiclePlateMatches(@Param('plate') plate: string) : Promise<ParkingRecordEntryResponseDto[]> {
    return await this.parkingRecordsService.getParkingRecordsByVehiclePlateMatches(plate);
  }

}