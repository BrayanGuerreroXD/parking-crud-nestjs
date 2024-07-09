import { Controller, Post, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MailRequestDto } from './dto/mail.request.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MailResponseDto } from './dto/mail.response.dto';
import { createErrorResponse } from 'src/config/base.swagger.error.response.options';

@ApiTags('Mail')
@ApiBearerAuth('access-token')
@Controller()
@UseGuards(AuthGuard, RolesGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: 'Send mail'})
  @ApiBody({ type: MailRequestDto })
  @ApiResponse({ status: 200, description: 'Mail sent successfully', type: MailResponseDto })
  @ApiResponse(createErrorResponse(HttpStatus.BAD_REQUEST, 'Bad Request - Caused by an incorrect request object', 'BadRequestException', [
    "Email must be a maximum of 50 characters",
    "Email is not valid",
    "Email cannot be empty",
    "Email must be a string"
  ]))
  @ApiResponse(createErrorResponse(HttpStatus.UNAUTHORIZED, 'Unauthorized - Caused by user does not have permission to access this route', 'JwtAuthException', ['User does not have permission to access this route']))
  @ApiResponse(createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Error - Internal server error occurred', 'InternalServerErrorException', ['Error sending mail']))
  @Post("sending-mail")
  @Roles('ADMIN')
  async sendMail(@Body() mailRequestDto: MailRequestDto) : Promise<MailResponseDto> {
    return await this.mailService.sendMail(mailRequestDto);
  }
  
}