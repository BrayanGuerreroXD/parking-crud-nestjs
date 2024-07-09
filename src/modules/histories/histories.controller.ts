import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EarningsResponseDto } from './dto/earnings.response.dt';
import { createErrorResponse } from 'src/config/base.swagger.error.response.options';

@ApiTags('Histories')
@ApiBearerAuth('access-token')
@Controller('histories')
@UseGuards(RolesGuard, AuthGuard)
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

    @ApiOperation({ summary: 'Get earnings from a specific parking lot' })
    @ApiParam({ name: 'parkingId', description: 'Parking ID', required: true, type: 'number' })
    @ApiResponse({ status: 200, description: 'Earnings obtained successfully', type: EarningsResponseDto})
    @ApiResponse(createErrorResponse(401, 'Unauthorized - Caused by Invalid token', 'InvalidTokenException', ['Invalid token']))
    @Get("earnings/parkingId/:parkingId")
    @Roles('SOCIO')
    public async getEarnings(@Param('parkingId') parkingId: number) : Promise<EarningsResponseDto> {
        return await this.historiesService.getEarnings(parkingId);
    }

}
