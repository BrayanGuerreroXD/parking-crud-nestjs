import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from 'src/constants/key-decorators';
import { IUseToken } from '../interfaces/auth.interface';
import { Request } from 'express';
import { InvalidTokenException, JwtAuthException } from 'src/exception-handler/exceptions.classes';
import { UsersService } from 'src/modules/users/users.service';
import { useToken } from 'src/utils/user.token';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
      private readonly userService : UsersService,
      private readonly reflector : Reflector
    ) {}

    async canActivate(
        context: ExecutionContext,
    ) {
        const isPublic = this.reflector.get<boolean>(
          PUBLIC_KEY,
          context.getHandler(),
        );

        if (isPublic) {
          return true;
        }
      
        const req = context.switchToHttp().getRequest<Request>();

        const bearerToken = req.headers['authorization']

        if (!bearerToken || Array.isArray(bearerToken)) {
            throw new InvalidTokenException();
        }

        const token = bearerToken.split('Bearer ')[1];

        const manageToken: IUseToken = useToken(token);

        if (manageToken.isExpired) {
          throw new JwtAuthException('Token expired');
        }

        const { sub } = manageToken;
        
        const user = await this.userService.findUserById(+sub);

        req.idUser = user.id.toString();
        req.roleUser = user.role.name;
        
        return true;
    }
}