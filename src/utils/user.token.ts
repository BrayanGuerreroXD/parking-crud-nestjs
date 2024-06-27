import * as jwt from 'jsonwebtoken';
import { InvalidTokenException } from 'src/exception-handler/exceptions.classes';
import { AuthTokenResult, IUseToken } from 'src/modules/auth/interfaces/auth.interface';

export const useToken = (token: string): IUseToken => {
    try {
        const decode = jwt.decode(token) as AuthTokenResult;

        const currentDate = new Date();
        const expiresDate = new Date(decode.exp);

        return {
            sub: decode.sub,
            role: decode.role,
            isExpired: +expiresDate <= +currentDate / 1000,
        };
    } catch (error) {
        throw new InvalidTokenException();
    }
};