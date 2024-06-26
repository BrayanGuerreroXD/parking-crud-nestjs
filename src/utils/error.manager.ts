import { HttpException, HttpStatus } from "@nestjs/common";

export class ErrorManager extends Error {
    constructor({type, message}:{ type: keyof typeof HttpStatus, message: string}) {
        super(`${type} :: ${message}`);
    }

    public static createSignatureError(message: string) {
        const status = message.split(' :: ')[0];
        throw new HttpException(message, (status) ? HttpStatus[status] : HttpStatus.INTERNAL_SERVER_ERROR);
    }
}