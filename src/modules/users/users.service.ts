import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { UserRequestDto } from './dto/user.request.dto';
import * as bcrypt from 'bcrypt';
import { ROLES } from 'src/constants/roles';
import { RolesService } from 'src/modules/roles/roles.service';
import { UserResponseDto } from './dto/user.response.dto';
import { plainToInstance } from 'class-transformer';
import { EmailAlreadyExistsException, EntityNotFoundException } from 'src/exception-handler/exceptions.classes';
import { UserRepository } from './users.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(
        private readonly userRepository : UserRepository,
        private readonly rolesService: RolesService,
        private readonly dataSource: DataSource
    ) {}
    
    public async createUser(body: UserRequestDto): Promise<UserResponseDto> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const emailAlreadyExists = await this.existEmail(body.email);
    
            if (emailAlreadyExists) {
                throw new EmailAlreadyExistsException();
            }
    
            const role = await this.rolesService.findByName(ROLES.SOCIO);
    
            const encryptPass = await bcrypt.hash(body.password, +process.env.HASH_SALT || 10);

            const userEntity: UserEntity = new UserEntity();
            userEntity.email = body.email;
            userEntity.password = encryptPass;
            userEntity.role = role;
    
            const savedUser = await queryRunner.manager.save(userEntity);

            const userResponseDto = plainToInstance(UserResponseDto, savedUser, {
                excludeExtraneousValues: true,
            });

            await queryRunner.commitTransaction();

            return userResponseDto;
        } catch (e) {
            if (queryRunner.isTransactionActive) {
                await queryRunner.rollbackTransaction();
            }
            throw e;
        } finally {
            await queryRunner.release();
        }
    }
    
    public async findUserById(id: number): Promise<UserEntity> {
        const user: UserEntity =  await this.userRepository.findUserById(id)
        if (!user) 
            throw new EntityNotFoundException('User not found');
        return user;
    }   

    public async findBy({ key, value } : { key: keyof UserRequestDto; value: any }) {
        const user: UserEntity = await this.userRepository.findByKey(key, value);
        if (!user) 
            throw new EntityNotFoundException('User not found');
        return user;
    }

    private async existEmail(email: string): Promise<boolean> {
        const count = await this.userRepository.count({ where: { email } });
        return count > 0;
    }
}