import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { ParkingsService } from './parkings.service';
import { ParkingRequestDto } from './dto/parking.request.dto';
import { ParkingResponseDto } from './dto/parking.response.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createErrorResponse } from 'src/config/base.swagger.error.response.options';

@ApiTags('Parkings')
@ApiBearerAuth('access-token')
@Controller()
@UseGuards(RolesGuard, AuthGuard)
export class ParkingsController {
  constructor(private readonly parkingsService: ParkingsService) {}

  @ApiOperation({ summary: 'Save parking'})
  @ApiBody({ type: ParkingRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: ParkingResponseDto })
  @ApiResponse(createErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request - Caused by an invalid user", 'BadRequestException', ["User isn't a 'SOCIO', only users with role 'SOCIO' can be assigned to the parking"]))
  @ApiResponse(createErrorResponse(HttpStatus.NOT_FOUND, "Not Found - Caused by user not found", 'EntityNotFoundException', ["User not found"]))
  @ApiResponse(createErrorResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized - Caused by user does not have permission to access this route', 'JwtAuthException', ['User does not have permission to access this route']))
  @Post('parking')
  @Roles('ADMIN')
  @HttpCode(200)
  async createParking(@Body() body: ParkingRequestDto) : Promise<ParkingResponseDto> {
    return this.parkingsService.createParking(body);
  }
  
  @ApiOperation({ summary: 'Update parking'})
  @ApiParam({ name: 'id', type: Number, required: true, description: 'Parking id'})
  @ApiBody({ type: ParkingRequestDto })
  @ApiResponse({ status: HttpStatus.OK, type: ParkingResponseDto })
  @ApiResponse(createErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request - Caused by an invalid user", 'BadRequestException', ["User isn't a 'SOCIO', only users with role 'SOCIO' can be assigned to the parking"]))
  @ApiResponse(createErrorResponse(HttpStatus.NOT_FOUND, "Not Found - Caused by user not found", 'EntityNotFoundException', ["User not found"]))
  @ApiResponse(createErrorResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized - Caused by user does not have permission to access this route', 'JwtAuthException', ['User does not have permission to access this route']))
  @Put('parking/:id')
  @Roles('ADMIN')
  @HttpCode(200)
  async updateParking(@Param('id') id : number, @Body() body: ParkingRequestDto) : Promise<ParkingResponseDto> {
    return this.parkingsService.updateParking(id, body);
  }

  @ApiOperation({ summary: 'Get parking by id'})
  @ApiParam({ name: 'id', type: Number, required: true, description: 'Parking id'})
  @ApiResponse({ status: HttpStatus.OK, type: ParkingResponseDto })
  @ApiResponse(createErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request - Caused by parking not exists", 'ParkingNotExistsException', ["Parking not exists"]))
  @Get('parking/:id')
  @Roles('ADMIN', 'SOCIO')
  @HttpCode(200)
  async getParkingById(@Param('id') id : number) : Promise<ParkingResponseDto> {
    return this.parkingsService.getParkingById(id);
  }
  
  @ApiOperation({ summary: 'Get all parking'})
  @ApiResponse({ status: HttpStatus.OK, type: [ParkingResponseDto] })
  @ApiResponse(createErrorResponse(HttpStatus.NOT_FOUND, "Not Found - Caused by not found any parking", 'NotFoundException', ["Not found any parking"]))
  @Get('parkings')
  @Roles('ADMIN', 'SOCIO')
  @HttpCode(200)
  async getAllParkings() : Promise<ParkingResponseDto[]> {
    return this.parkingsService.getAllParkings();
  }

  @ApiOperation({ summary: 'Delete parking'})
  @ApiParam({ name: 'id', type: Number, required: true, description: 'Parking id'})
  @ApiResponse({ status: HttpStatus.OK, type: null, description: 'Parking deleted'})
  @ApiResponse(createErrorResponse(HttpStatus.BAD_REQUEST, "Bad Request - Caused by parking not exists", 'ParkingNotExistsException', ["Parking not exists"]))
  @ApiResponse(createErrorResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized - Caused by user does not have permission to access this route', 'JwtAuthException', ['User does not have permission to access this route']))
  @Delete('parking/:id')
  @Roles('ADMIN')
  @HttpCode(200)
  async deleteParking(@Param('id') id : number) : Promise<void> {
    return this.parkingsService.deleteParking(id);
  }
}