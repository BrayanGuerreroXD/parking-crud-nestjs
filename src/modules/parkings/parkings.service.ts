import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ParkingEntity } from './entities/parking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingRequestDto } from './dto/parking.request.dto';
import { ParkingResponseDto } from './dto/parking.response.dto';
import { UsersService } from 'src/modules/users/users.service';
import { plainToInstance } from 'class-transformer';
import { ROLES } from 'src/constants/roles';
import { ParkingNotExistsException } from 'src/exception-handler/exceptions.classes';

@Injectable()
export class ParkingsService {

  constructor(
    @InjectRepository(ParkingEntity) private readonly parkingRepository: Repository<ParkingEntity>,
    private readonly usersService: UsersService
  ) {}

  public async createParking(body: ParkingRequestDto) : Promise<ParkingResponseDto> {
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
      
      const newParking: ParkingEntity = this.parkingRepository.create(parkingEntity);
      const savedParking = await this.parkingRepository.save(newParking);

      const response = plainToInstance(ParkingResponseDto, savedParking, {
        excludeExtraneousValues: true,
      });

      return response;
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }

  public async updateParking(idParking: number, body: ParkingRequestDto) : Promise<ParkingResponseDto> {
      const parkingEntity: ParkingEntity = await this.findParkingById(idParking)

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

      const updatedParking: ParkingEntity = await this.parkingRepository.save(parkingEntity);

      const response = plainToInstance(ParkingResponseDto, updatedParking, {
        excludeExtraneousValues: true,
      });

      return response;
  }

  public async getParkingById(id: number) : Promise<ParkingResponseDto> {

      const parkingEntity: ParkingEntity = await this.findParkingById(id);

      return plainToInstance(ParkingResponseDto, parkingEntity, {
        excludeExtraneousValues: true,
      });
  }

  public async getAllParkings() : Promise<ParkingResponseDto[]> {
    const parkings: ParkingEntity[] = await this.parkingRepository.find();
    return parkings.map(parking => plainToInstance(ParkingResponseDto, parking, {
      excludeExtraneousValues: true,
    }));
  }

  public async deleteParking(id: number) : Promise<void> {
    const parkingEntity: ParkingEntity = await this.findParkingById(id);
    if (!parkingEntity)
      throw new ParkingNotExistsException();
    await this.parkingRepository.delete(parkingEntity);
  }

  // Private method to find a parking by id and return the entity
  private async findParkingById(id: number): Promise<ParkingEntity> {
    if (id == null || id <= 0) 
      throw new BadRequestException("The parking id cannot be null or less than or equal to 0");

    const parkingEntity: ParkingEntity = await this.parkingRepository.createQueryBuilder('parking')
      .leftJoinAndSelect('parking.user', 'user')
      .where({ id })
      .getOne();

    if (!parkingEntity) 
      throw new ParkingNotExistsException();

    return parkingEntity;
  }

  // Private method to find all parkings by user id and return the entities
  private async findAllParkingsByUserId(userId: number): Promise<ParkingEntity[]> {
    if (userId == null || userId <= 0) 
      throw new BadRequestException("The user id cannot be null or less than or equal to 0");

    const parkings: ParkingEntity[] = await this.parkingRepository.createQueryBuilder('parking')
      .leftJoinAndSelect('parking.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    return parkings;
  }


  //   @Override
  //   @Transactional
  //   public Map<String, String> deleteParking(Long id) {
  //       if(id == null || id <= 0)
  //           throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The parking id cannot be null or less than or equal to 0");
  //       Parking parking = parkingRepository.findById(id)
  //           .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking not found"));
  //       parkingRepository.delete(parking);
  //       return Map.of("message", "Parking deleted successfully");
  //   }

  //   @Override
  //   public List<ParkingResponseDto> getParkingListByUser() {
  //       String token = tokenService.getToken();
  //       if (Objects.isNull(token))
  //           throw new TokenNullException();

  //       Long userId = tokenService.getUserIdByToken(token);
  //       if (Objects.isNull(userId) || userId <= 0)
  //           throw new UserIdNullOrNotPositiveException();

  //       String userRole = tokenService.getUserRoleByToken(token);
  //       if (Objects.isNull(userRole) || userRole.isBlank())
  //           throw new UserRoleNullOrBlankException();

  //       // Validate if user exists
  //       User user = userService.findById(userId);
  //       if (Objects.isNull(user)) 
  //           throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        
  //       List<Parking> parkingList = userRole.equals("ADMIN") ? parkingRepository.findAll() : parkingRepository.findByUserId(userId);
  //       if (parkingList.isEmpty())
  //           throw new ResponseStatusException(HttpStatus.NOT_FOUND,
  //                   userRole.equals("ADMIN") ? "Not found any parking" : "The user doesn't have any parking assigned");
        
  //       return parkingList.stream().map(parkingConverter::convertParkingEntityToParkingResponse).toList();
  //   }

  //   @Override
  //   public Boolean isParkingAssignedToUser(Long parkingId, Long userId) {
  //       return parkingRepository.existsByIdAndUserId(parkingId, userId);
  //   }

  //   @Override
  //   public Boolean isParkingAlreadyExists(Long parkingId) {
  //       return parkingRepository.existsById(parkingId);
  //   }
}
