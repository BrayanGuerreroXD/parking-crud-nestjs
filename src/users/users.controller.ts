import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRequestDto } from './dto/user.request.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller()
@UseGuards(RolesGuard, AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user/register')
  @Roles('ADMIN')
  async createUser(@Body() body: UserRequestDto) : Promise<UserResponseDto> {
    return this.usersService.createUser(body);
  }

}
