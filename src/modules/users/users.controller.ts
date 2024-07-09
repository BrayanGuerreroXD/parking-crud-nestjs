import { Controller, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRequestDto } from './dto/user.request.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { createErrorResponse } from 'src/config/base.swagger.error.response.options';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller()
@UseGuards(RolesGuard, AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user', security: [{ 'access-token': [] }]})
  @ApiBody({ type: UserRequestDto })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse(createErrorResponse(HttpStatus.BAD_REQUEST, 'Bad Request - Caused by an incorrect request object', 'BadRequestException', [
    "Email must be a maximum of 50 characters",
    "Email is not valid",
    "Email cannot be empty",
    "Email must be a string"
  ]))
  @ApiResponse(createErrorResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized - Caused by user does not have permission to access this route', 'JwtAuthException', ['User does not have permission to access this route']))
  @ApiResponse(createErrorResponse(HttpStatus.CONFLICT, 'Conflict - Caused by an email already registered', 'BadRequestException', ["Email already exists"]))
  @Post('user/register')
  @Roles('ADMIN')
  async createUser(@Body() body: UserRequestDto) : Promise<UserResponseDto> {
    return this.usersService.createUser(body);
  }

}
