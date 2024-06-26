import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRequestDto } from './dto/user.request.dto';
import { ErrorManager } from '../utils/error.manager';
import * as bcrypt from 'bcrypt';
import { ROLES } from 'src/constants/roles';
import { RolesService } from 'src/roles/roles.service';
import { UserResponseDto } from './dto/user.response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly rolesService: RolesService
    ) {}

    public async createUser(body: UserRequestDto): Promise<UserResponseDto> {
        try {
            const emailAlreadyExists = await this.existEmail(body.email);
            
            if (emailAlreadyExists)
              throw new ErrorManager({ type: "CONFLICT", message: 'Email already exists' });
            
            const role = await this.rolesService.findByName(ROLES.SOCIO);

            const userEntity: UserEntity = new UserEntity();
            userEntity.email = body.email;
            userEntity.password = body.password;
            userEntity.role = role;

            const newUser: UserEntity = this.userRepository.create(userEntity);

            const newUserPassword = await bcrypt.hash(
                newUser.password, 
                (+process.env.HASH_SALT || 10)
            );

            newUser.password = newUserPassword;

            const savedUser = await this.userRepository.save(newUser);

            const userResponseDto = plainToInstance(UserResponseDto, savedUser, {
              excludeExtraneousValues: true,
            });

            return userResponseDto;
        } catch (e) {
            throw ErrorManager.createSignatureError(e.message);          
        }
    }
    
    public async findUserById(id: number): Promise<UserEntity> {
        try {
            const user: UserEntity =  await this.userRepository
                .createQueryBuilder('user')
                .leftJoinAndSelect('user.role', 'role')
                .where({ id })
                .getOne();
            if (!user) 
                throw new ErrorManager({ type: "NOT_FOUND", message: 'User not found' });
            return user;
        } catch (e) {
            throw ErrorManager.createSignatureError(e.message);          
        }
    }   

    public async findBy({ key, value } : { key: keyof UserRequestDto; value: any }) {
        try {
            const user: UserEntity = await this.userRepository
                .createQueryBuilder('user')
                .addSelect('user.password')
                .where({ [key]: value })
                .getOne();
            return user;
        } catch (error) {
            throw ErrorManager.createSignatureError(error.message);
        }
    }

    private async existEmail(email: string): Promise<boolean> {
      const count = await this.userRepository.count({ where: { email } });
      return count > 0;
    }
}