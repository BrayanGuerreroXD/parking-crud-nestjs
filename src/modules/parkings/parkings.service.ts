import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ParkingEntity } from './entities/parking.entity';
import { DataSource } from 'typeorm';
import { ParkingRequestDto } from './dto/parking.request.dto';
import { ParkingResponseDto } from './dto/parking.response.dto';
import { UsersService } from 'src/modules/users/users.service';
import { plainToInstance } from 'class-transformer';
import { ROLES } from 'src/constants/roles';
import { ParkingNotAssignedException, ParkingNotExistsException } from 'src/exception-handler/exceptions.classes';
import { ParkingRepository } from './parkings.repository';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class ParkingsService {

  constructor(
    private readonly parkingRepository: ParkingRepository,
    private readonly usersService: UsersService,
    private readonly tokensService : TokensService,
    private readonly dataSource: DataSource
  ) {}
  
  public async createParking(body: ParkingRequestDto) : Promise<ParkingResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
        const parkingEntity: ParkingEntity = new ParkingEntity();
        const user = await this.usersService.findUserById(body.userId);

        if (user?.role?.name !== ROLES.SOCIO) {
          throw new BadRequestException("User isn't a 'SOCIO', only users with role 'SOCIO' can be assigned to the parking");
        }

        parkingEntity.name = body.name;
        parkingEntity.hourlyCost = body.hourlyCost;
        parkingEntity.maxParkingSpace = body.maxParkingSpace;
        parkingEntity.user = user;
        
        const savedParking = await queryRunner.manager.save(parkingEntity);

        const response = plainToInstance(ParkingResponseDto, savedParking, {
          excludeExtraneousValues: true,
        });

        await queryRunner.commitTransaction();

        return response;
      } catch (e) {
          await queryRunner.rollbackTransaction();
          throw e;
      } finally {
          await queryRunner.release();
      }
  }

  public async updateParking(idParking: number, body: ParkingRequestDto) : Promise<ParkingResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (idParking == null || idParking <= 0)
        throw new BadRequestException("The parking id cannot be null or less than or equal to 0");

      const parkingEntity: ParkingEntity = await this.parkingRepository.findParkingById(idParking);

      if (!parkingEntity) 
        throw new ParkingNotExistsException();

      // If the user is different from the one that is assigned to the parking, then it is updated
      if (body.userId !== parkingEntity.user.id) {
        const user = await this.usersService.findUserById(body.userId);
        // If the user is ADMIN then it throws an exception because only the user with role 'SOCIO' can be assigned to the parking
        if (user?.role?.name !== ROLES.SOCIO) {
          throw new BadRequestException("User isn't a 'SOCIO', only users with role 'SOCIO' can be assigned to the parking");
        }
        parkingEntity.user = user;
      }

      parkingEntity.name = body.name;
      parkingEntity.hourlyCost = body.hourlyCost;
      parkingEntity.maxParkingSpace = body.maxParkingSpace;

      const updatedParking : ParkingEntity = await queryRunner.manager.save(parkingEntity);

      const response = plainToInstance(ParkingResponseDto, updatedParking, {
        excludeExtraneousValues: true,
      });

      await queryRunner.commitTransaction();

      return response;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

  }

  public async getParkingById(id: number) : Promise<ParkingResponseDto> {
      if (id == null || id <= 0)
        throw new BadRequestException("The parking id cannot be null or less than or equal to 0");

      const parkingEntity: ParkingEntity = await this.parkingRepository.findParkingById(id);

      if (!parkingEntity) 
        throw new ParkingNotExistsException();

      const userId: number = await this.tokensService.getUserIdByRequestToken();
      const userRole: string = await this.tokensService.getRoleByRequestToken();

      if (userRole !== ROLES.ADMIN && userId !== parkingEntity.user.id) {
        throw new ParkingNotAssignedException();
      }

      return plainToInstance(ParkingResponseDto, parkingEntity, {
        excludeExtraneousValues: true,
      });
  }

  public async getParkingEntityById(id: number) : Promise<ParkingEntity> {
    if (id == null || id <= 0)
      throw new BadRequestException("The parking id cannot be null or less than or equal to 0");

    const parkingEntity: ParkingEntity = await this.parkingRepository.findParkingById(id);

    if (!parkingEntity) 
      throw new ParkingNotExistsException();

    return parkingEntity;
  }

  public async getAllParkings() : Promise<ParkingResponseDto[]> {
      const userId: number = await this.tokensService.getUserIdByRequestToken();
      const userRole: string = await this.tokensService.getRoleByRequestToken();

      if (userId == null || userId <= 0) 
        throw new BadRequestException("The user id cannot be null or less than or equal to 0");

      const parkings: ParkingEntity[] = userRole === ROLES.ADMIN 
          ? await this.parkingRepository.findAllParkings() 
          : await this.parkingRepository.findAllParkingsByUserId(userId);

      if (!parkings.length) {
         throw new NotFoundException(userRole === ROLES.ADMIN ? "Not found any parking" : "The user doesn't have any parking assigned")
      }

      return parkings.map(parking => plainToInstance(ParkingResponseDto, parking, {
        excludeExtraneousValues: true,
      }));
  }

  public async deleteParking(id: number) : Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (id == null || id <= 0)
        throw new BadRequestException("The parking id cannot be null or less than or equal to 0");

      const parkingEntity: ParkingEntity = await this.parkingRepository.findParkingById(id);

      if (!parkingEntity)
        throw new ParkingNotExistsException();

      await queryRunner.manager.delete(ParkingEntity, id);

      await queryRunner.commitTransaction();
      
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  // Validate if the parking is assigned to the user
  public async isParkingAssignedToUser(parkingId: number, userId: number): Promise<void> {
    if (!await this.parkingRepository.existsByIdAndUserId(parkingId, userId))
      throw new ParkingNotAssignedException();
  }

  // Validate if the parking exists
  public async isParkingAlreadyExists(parkingId: number): Promise<void> {
    if (!await this.parkingRepository.existsById(parkingId))
      throw new ParkingNotExistsException();
  }
}
