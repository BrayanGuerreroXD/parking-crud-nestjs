import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRequestDto } from './dto/user.request.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

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
