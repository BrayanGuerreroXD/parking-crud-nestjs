import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('histories')
@UseGuards(RolesGuard, AuthGuard)
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

    @Get("earnings/parkingId/:parkingId")
    @Roles('SOCIO')
    public async getEarnings(@Param('parkingId') parkingId: number) {
        return await this.historiesService.getEarnings(parkingId);
    }

}
