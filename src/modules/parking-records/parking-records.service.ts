import { BadRequestException, Injectable } from '@nestjs/common';
import { ParkingsService } from '../parkings/parkings.service';
import { TokensService } from '../tokens/tokens.service';
import { DataSource } from 'typeorm';
import { ParkingRecordRepository } from './parking-records.repository';
import { VehiclesService } from '../vehicles/vehicles.service';
import { ParkingRecordRequestDto } from './dto/parking-record.request.dto';
import { ParkingRecordEntryResponseDto, ParkingRecordExitResponseDto } from './dto/parking-record.response.dto';
import { ParkingEntity } from '../parkings/entities/parking.entity';
import { ParkingIsFullException, ParkingNotAssignedException, VehicleNotFoundException } from 'src/exception-handler/exceptions.classes';
import { ParkingRecordEntity } from './entities/parking.record.entity';
import { VehicleResponseDto } from '../vehicles/dto/vehicle.response.dto';
import { ROLES } from 'src/constants/roles';
import { HistoryEntity } from '../histories/entities/history.entity';
import { HistoriesService } from '../histories/histories.service';

@Injectable()
export class ParkingRecordsService {

  constructor(
    private readonly parkingRecordRepository : ParkingRecordRepository,
    private readonly parkingService : ParkingsService,
    private readonly vehicleService : VehiclesService,
    private readonly tokensService : TokensService,
    private readonly historiesService : HistoriesService,
    private readonly dataSource : DataSource
  ) {}

  public async createParkingEntryRecord(body : ParkingRecordRequestDto) : Promise<ParkingRecordEntryResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const parking : ParkingEntity = await this.parkingService.getParkingEntityById(body.parkingId);

        const userId: number = await this.tokensService.getUserIdByRequestToken();
        if (parking.user.id != userId) {  
          throw new ParkingNotAssignedException();
        }

        const parkingCapacity = parking.maxParkingSpace;
        const parkingRecordsCount = await this.parkingRecordRepository.countByParkingIdAndExitDateIsNull(parking.id);

        if(parkingCapacity > 0 && parkingRecordsCount === parkingCapacity) {
          throw new ParkingIsFullException();
        }

        const lastRecord : ParkingRecordEntity = await this.parkingRecordRepository.getLastParkingRecordByVehiclesPlate(body.plate);

        let vehicle = null;
        if (!lastRecord) {
          vehicle = await this.vehicleService.createVehicle(body.plate);
        } else {
          if (!lastRecord.exitDate) {
            throw new BadRequestException("Unable to Register Entry, vehicle already in a parking lot.");
          }
          vehicle = lastRecord.vehicle;
        }

        const parkingRecordEntity : ParkingRecordEntity = new ParkingRecordEntity();
        parkingRecordEntity.vehicle = vehicle;
        parkingRecordEntity.parking = parking;
        parkingRecordEntity.entryDate = new Date();

        const savedParkingRecord = await queryRunner.manager.save(parkingRecordEntity);

        const response = new ParkingRecordEntryResponseDto(
          savedParkingRecord.id,
          savedParkingRecord.vehicle.plate,
          savedParkingRecord.entryDate
        );

        await queryRunner.commitTransaction();

        return response;
      } catch (e) {
          await queryRunner.rollbackTransaction();
          throw e;
      } finally {
          await queryRunner.release();
      }
  }
  
  public async createParkingExitRecord(body : ParkingRecordRequestDto) : Promise<ParkingRecordExitResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const vehicleExists = await this.vehicleService.existsVehicleByPlate(body.plate);
        if (!vehicleExists)
            throw new VehicleNotFoundException();

        const parking : ParkingEntity = await this.parkingService.getParkingEntityById(body.parkingId);

        const userId: number = await this.tokensService.getUserIdByRequestToken();
        if (parking.user.id != userId) {
          throw new ParkingNotAssignedException();
        }

        const lastRecord : ParkingRecordEntity = await this.parkingRecordRepository.getLastParkingRecordByVehiclesPlate(body.plate);

        if (!lastRecord)
          throw new BadRequestException("Unable to Register Exit, no license plate found in any parking lot.");

        if (lastRecord.parking.id !== parking.id)
          throw new BadRequestException("Unable to Register Exit, vehicle license plate in another parking lot.");

        if (lastRecord.exitDate)
          throw new BadRequestException("Unable to Register Exit, vehicle not found in a parking lot.");

        lastRecord.exitDate = new Date();

        const updatedParkingRecord = await queryRunner.manager.save(lastRecord);

        await this.saveHistory(updatedParkingRecord);

        await queryRunner.commitTransaction();

        return new ParkingRecordExitResponseDto(
          updatedParkingRecord.id,
          updatedParkingRecord.vehicle.plate,
          updatedParkingRecord.entryDate,
          updatedParkingRecord.exitDate,
        );

      } catch (e) {
          await queryRunner.rollbackTransaction();
          throw e;
      } finally {
          await queryRunner.release();
      }
  }

  // (ADMIN and SOCIO) return all the vehicles that are parked in a parking lot and have not yet left.
  public async getParkingRecordsWithExitDateNullByParkingId(parkingId : number) : Promise<ParkingRecordEntryResponseDto[]> {
    const userId: number = await this.tokensService.getUserIdByRequestToken();
    const userRole: string = await this.tokensService.getRoleByRequestToken();

    const parking : ParkingEntity = await this.parkingService.getParkingEntityById(parkingId);

    if (userRole !== ROLES.ADMIN && parking.user.id != userId) {
      throw new ParkingNotAssignedException();
    }

    const parkingRecords : ParkingRecordEntity[] = userRole === ROLES.ADMIN ?
      await this.parkingRecordRepository.findByParkingIdAndExitDateIsNull(parkingId) :
      await this.parkingRecordRepository.findByParkingIdAndParkingUserIdAndExitDateIsNull(parkingId, userId);

    return parkingRecords.map(this.toParkingRecordEntryResponseDto);
  }

  // ============================================== INDICATORS ==============================================
  /**
   * (ADMIN and SOCIO) return the 10 vehicles that have been registered the most times in the different parking lots and how many
   * times they have been registered different parking lots and how many times they have been
   */

  public async getMostRegisteredVehiclesAtAllParking() : Promise<VehicleResponseDto[]> {
    const userId: number = await this.tokensService.getUserIdByRequestToken();
    const userRole: string = await this.tokensService.getRoleByRequestToken();

    const vehicles : object[] = userRole === ROLES.ADMIN ?
      await this.parkingRecordRepository.getMostRegisteredVehiclesAtAllParking() :
      await this.parkingRecordRepository.getMostRegisteredVehiclesAtAllParkingByUserId(userId);

    return vehicles.map(this.toVehicleResponseDto);
  }

  // ================================= AUXILIARY METHODS =================================

  private toParkingRecordEntryResponseDto(record : ParkingRecordEntity) : ParkingRecordEntryResponseDto {
    return new ParkingRecordEntryResponseDto(
      record.id,
      record.vehicle.plate,
      record.entryDate
    );
  }

  private toParkingRecordExitResponseDto(record : ParkingRecordEntity) : ParkingRecordExitResponseDto {
    return new ParkingRecordExitResponseDto(
      record.id,
      record.vehicle.plate,
      record.entryDate,
      record.exitDate
    );
  }

  private toVehicleResponseDto(vehicle : object) : VehicleResponseDto {
    return new VehicleResponseDto(
      vehicle['id'],
      vehicle['plate'],
      vehicle['recordCount']
    );
  }

  private async saveHistory(parkingRecord : ParkingRecordEntity) : Promise<void> {
    const history = new HistoryEntity();
    history.parkingRecord = parkingRecord;
    const hours = this.calculateHoursDifference(parkingRecord.entryDate, parkingRecord.exitDate);
    const price = hours * parkingRecord.parking.hourlyCost;
    history.totalCost = price;
    await this.historiesService.createHistory(history);
  }

  private calculateHoursDifference(firstDate : Date, secondDate : Date) : number {
    const diff = secondDate.getTime() - firstDate.getTime();
    return diff / (1000 * 60 * 60);
  }

}

//     // ================================= INDICATORS =================================

//     /**
//      * (ADMIN and SOCIO) return the 10 vehicles that have been registered the most times in the different parking lots and how many
//      * times they have been registered different parking lots and how many times they have been
//      */

//     @Override
//     public List<VehicleResponseDto> getMostRegisteredVehiclesAtAllParking() {
//         String token = tokenService.getToken();
//         Long userId = tokenService.getUserIdByToken(token);
//         String userRole = tokenService.getUserRoleByToken(token);

//         this.validateTokenAndParkingAssignedToUser(token, userId, userRole, null);
        
//         List<Object[]> vehicles = userRole.equals(RoleEnum.ADMIN.getRole()) ?
//             parkingRecordRepository.getMostRegisteredVehiclesAtAllParking() :
//             parkingRecordRepository.getMostRegisteredVehiclesAtAllParkingByUserId(userId);

//         return vehicles.stream()
//             .map(this::toVehicleResponseDto)
//             .toList();
//     }

//     /**
//      * (ADMIN and SOCIO) return the 10 vehicles that have been registered the most times in a parking 
//      * lot and how many times they have been registered.
//      */

//     @Override
//     public List<VehicleResponseDto> getMostRegisteredVehiclesAtAllParkingByParkingId(Long parkingId) {
//         String token = tokenService.getToken();
//         Long userId = tokenService.getUserIdByToken(token);
//         String userRole = tokenService.getUserRoleByToken(token);

//         this.validateTokenAndParkingAssignedToUser(token, userId, userRole, parkingId);

//         List<Object[]> vehicles = userRole.equals(RoleEnum.ADMIN.getRole()) ?
//             parkingRecordRepository.getMostRegisteredVehiclesAtAllParkingByParkingId(parkingId) :
//             parkingRecordRepository.getMostRegisteredVehiclesAtAllParkingByParkingIdAndUserId(parkingId, userId);

//         return vehicles.stream()
//             .map(this::toVehicleResponseDto)
//             .toList();
//     }
    
//     /**
//      * (ADMIN and SOCIO) verify which vehicles are parked for the first time in that parking lot.
//      */
    
//     @Override
//     public List<ParkingRecordResponseDto> getParkingRecordsFirstTimeWithExitDateNullByParkingId(Long parkingId) {
//         String token = tokenService.getToken();
//         Long userId = tokenService.getUserIdByToken(token);
//         String userRole = tokenService.getUserRoleByToken(token);

//         this.validateTokenAndParkingAssignedToUser(token, userId, userRole, parkingId);

//         List<ParkingRecord> parkingRecords = userRole.equals(RoleEnum.ADMIN.getRole()) ?
//             parkingRecordRepository.getParkingRecordsFirstTimeWithExitDateNullByParkingId(parkingId) :
//             parkingRecordRepository.getParkingRecordsFirstTimeWithExitDateNullByParkingIdAndUserId(parkingId, userId);

//         return parkingRecords.stream()
//             .map(this::toParkingRecordResponseDto)
//             .toList();
//     }

//     /**
//      * (ADMIN and PARTNER) Search for parked vehicles by matching license plate, e.g. entry "HT", 
//      * you can return vehicles with license plate "123HT4" | "HT231E".
//      */

//     @Override
//     public List<ParkingRecordResponseDto> getParkingRecordsByVehiclePlateMatches(String plate) {
//         String token = tokenService.getToken();
//         Long userId = tokenService.getUserIdByToken(token);
//         String userRole = tokenService.getUserRoleByToken(token);

//         this.validateTokenAndParkingAssignedToUser(token, userId, userRole, null);

//         List<ParkingRecord> parkingRecords = userRole.equals(RoleEnum.ADMIN.getRole()) ?
//             parkingRecordRepository.getParkingRecordsByVehiclePlateMatches(plate) :
//             parkingRecordRepository.getParkingRecordsByUserIdAndVehiclePlateMatches(userId, plate);

//         return parkingRecords.stream()
//             .map(this::toParkingRecordResponseDto)
//             .toList();
//     }

//     // ================================= AUXILIARY METHODS =================================

//     /**
//      * Validate token, userId, userRole and parkingId (this last one can be null when it is not necessary to validate it).
//      * @param token String
//      * @param userId Long
//      * @param userRole String
//      * @param parkingId Long
//      */
//     private void validateTokenAndParkingAssignedToUser(String token, Long userId, String userRole, Long parkingId) {
//         if (Objects.isNull(token))
//             throw new TokenNullException();

//         if (Objects.isNull(userId) || userId <= 0)
//             throw new UserIdNullOrNotPositiveException();

//         if (Objects.isNull(userRole) || userRole.isBlank())
//             throw new UserRoleNullOrBlankException();
        
//         if (Objects.nonNull(parkingId) && Boolean.FALSE.equals(parkingService.isParkingAlreadyExists(parkingId)))
//             throw new ParkingNotExistsException();

//         if (Objects.nonNull(parkingId) && userRole.equals(RoleEnum.SOCIO.getRole())
//                 && Boolean.FALSE.equals(parkingService.isParkingAssignedToUser(parkingId, userId)))
//             throw new ParkingNotAssignedException();
//     }