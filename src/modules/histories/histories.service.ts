import { Injectable } from '@nestjs/common';
import { ParkingsService } from '../parkings/parkings.service';
import { TokensService } from '../tokens/tokens.service';
import { DataSource } from 'typeorm';
import { HistoryEntity } from './entities/history.entity';
import { EarningsResponseDto } from './dto/earnings.response.dt';
import { HistoriesRepository } from './histories.repository';

@Injectable()
export class HistoriesService {
  constructor(
    private readonly historiesRepository : HistoriesRepository,
    private readonly parkingService : ParkingsService,
    private readonly tokensService : TokensService
  ) {}

  public async createHistory(body : HistoryEntity) : Promise<void> {
    await this.historiesRepository.saveHistory(body);
  }

  // ======================== INDICATOR ========================

  /**
   * (SOCIO) obtain today's, this week's, this month's, this year's profits from a specific parking lot
   */

  public async getEarnings(parkingId : number) : Promise<EarningsResponseDto> {
    const userId = await this.tokensService.getUserIdByRequestToken();
    
    // Check if the parking lot exists
    await this.parkingService.isParkingAlreadyExists(parkingId);

    // Check if the parking lot is assigned to the user
    await this.parkingService.isParkingAssignedToUser(parkingId, userId);

    const today = await this.getEarningsForToday(parkingId);
    const week = await this.getEarningsForThisWeek(parkingId);
    const month = await this.getEarningsForThisMonth(parkingId);
    const year = await this.getEarningsForThisYear(parkingId);

    return new EarningsResponseDto(today, week, month, year);
  }

  private async getEarningsForToday(parkingId : number) : Promise<number> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    return await this.historiesRepository.countByParkingIdAndExitDateIsNull(parkingId, startOfDay, now);
  }

  private async getEarningsForThisWeek(parkingId : number) : Promise<number> {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay(), 0, 0, 0, 0);
    return await this.historiesRepository.countByParkingIdAndExitDateIsNull(parkingId, startOfWeek, now);
  }

  private async getEarningsForThisMonth(parkingId : number) : Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    return await this.historiesRepository.countByParkingIdAndExitDateIsNull(parkingId, startOfMonth, now);
  }

  private async getEarningsForThisYear(parkingId : number) : Promise<number> {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    return await this.historiesRepository.countByParkingIdAndExitDateIsNull(parkingId, startOfYear, now);
  }
}
