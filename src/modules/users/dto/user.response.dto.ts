import { Expose, Type } from 'class-transformer';
import { RoleDto } from 'src/modules/roles/dto/role.dto';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}
