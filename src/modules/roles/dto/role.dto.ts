import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RoleDto {
  @Expose()
  @ApiProperty({
    type: Number,
    description: 'Role id',
    example: 2
  })
  id: number;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Role name',
    example: 'SOCIO'
  })
  name: string;
}