import { Injectable } from '@nestjs/common';
import { ParkingEntity } from './entities/parking.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkingRequestDto } from './dto/parking.request.dto';
import { ParkingResponseDto } from './dto/parking.response.dto';
import { UsersService } from 'src/users/users.service';
import { plainToInstance } from 'class-transformer';
import { ErrorManager } from 'src/utils/error.manager';
import { ROLES } from 'src/constants/roles';

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
        throw new ErrorManager({ 
          type: "BAD_REQUEST", 
          message: "User isn't a 'SOCIO', only users with role 'SOCIO' can be assigned to the parking" 
        });
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
      throw ErrorManager.createSignatureError(e.message);
    }
  }

  //   @Override
  //   @Transactional
  //   public ParkingResponseDto updateParking(Long idParking, ParkingRequestDto requestDto) {
  //       if(idParking == null || idParking <= 0)
  //           throw new ParkingIdNullOrNotPositiveException();

  //       Parking parking = parkingRepository.findById(idParking)
  //               .orElseThrow(ParkingNotExistsException::new);

  //       parking.setName(requestDto.getName());
  //       parking.setHourlyCost(requestDto.getHourlyCost());
  //       parking.setMaxParkingSpace(requestDto.getMaxParkingSpace());

  //       // If the user is different from the one that is assigned to the parking, then it is updated
  //       if(!Objects.equals(parking.getUser().getId(), requestDto.getUserId())) {
  //           User user = userService.findById(requestDto.getUserId());
  //           // If the user is ADMIN then it throws an exception because only the user with role 'SOCIO' can be assigned to the parking
  //           if (user.getRole().getName().equals(RoleEnum.ADMIN.getRole())) {
  //               throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
  //                       "User isn't a 'SOCIO', only users with role 'SOCIO' can be assigned to the parking");
  //           }
  //           parking.setUser(user);
  //       }

  //       Parking parkingSave = parkingRepository.save(parking);

  //       return parkingConverter.convertParkingEntityToParkingResponse(parkingSave);
  //   }

  //   @Override
  //   public ParkingResponseDto getParkingById(Long id) {
  //       if(id == null || id <= 0)
  //           throw new ParkingIdNullOrNotPositiveException();
  //       Parking parking = parkingRepository.findById(id)
  //               .orElseThrow(ParkingNotExistsException::new);
  //       return parkingConverter.convertParkingEntityToParkingResponse(parking);
  //   }

  //   @Override
  //   public Parking getParkingEntityById(Long id) {
  //       if(id == null || id <= 0)
  //           throw new ParkingIdNullOrNotPositiveException();
  //       return parkingRepository.findById(id)
  //           .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Parking not found"));
  //   }

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
