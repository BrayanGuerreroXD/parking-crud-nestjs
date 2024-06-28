import { Controller, Get, UseGuards } from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('histories')
@UseGuards(RolesGuard, AuthGuard)
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}


}
