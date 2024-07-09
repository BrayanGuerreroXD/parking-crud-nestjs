import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { RoleDto } from 'src/modules/roles/dto/role.dto';

export class UserResponseDto {
  @Expose()
  @ApiProperty({
    type: Number,
    description: 'User id',
    example: 2
  })
  id: number;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'User email',
    example: 'socio@mail.com'
})
  email: string;

  @Expose()
  @Type(() => RoleDto)
  @ApiProperty({
    type: RoleDto,
    description: 'User role',
  })
  role: RoleDto;
}
