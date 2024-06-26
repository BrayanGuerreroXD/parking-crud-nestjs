import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PUBLIC_KEY, ROLES_KEY } from 'src/constants/key-decorators';
import { ROLES } from 'src/constants/roles';
import { useToken } from 'src/utils/user.token';
import { IUseToken } from '../interfaces/auth.interface';
import { InvalidTokenException, JwtAuthException } from 'src/exception-handler/exceptions.classes';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) 
      return true;

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (roles === undefined)
      return true;

    const req = context.switchToHttp().getRequest<Request>();

    const bearerToken = req.headers['authorization']

    if (!bearerToken || Array.isArray(bearerToken)) {
        throw new InvalidTokenException();
    }

    const token = bearerToken.split('Bearer ')[1];

    const manageToken: IUseToken | string = useToken(token);

    if (typeof manageToken === 'string') {
      throw new JwtAuthException(manageToken);
    }

    const isAuth = roles.some((role) => role === manageToken.role);

    if (!isAuth)
      throw new JwtAuthException('User does not have permission to access this route');

    return true;
  }
}