import { 
    BadRequestException, 
    ConflictException, 
    HttpException, 
    HttpStatus, 
    InternalServerErrorException, 
    NotFoundException, 
    UnauthorizedException 
} from "@nestjs/common";

class EmailAlreadyExistsException extends HttpException {
    constructor(message: string = 'Email already exists') {
        const responseObject = {
            response: message,
            status: HttpStatus.CONFLICT,
            message: 'Email Already Exists Exception',
            date: new Date().toISOString(),
        };
        super(responseObject, HttpStatus.CONFLICT);
    }
}

class EmailNotFoundException extends NotFoundException {
    constructor() {
        super('Email not found');
    }
}

class EntityNotFoundException extends NotFoundException {
    constructor(message: string) {
        super(message);
    }
}

class InvalidTokenException extends UnauthorizedException {
    constructor() {
        super('Invalid token');
    }
}

class JwtAuthException extends UnauthorizedException {
    constructor(message : string) {
        super(message);
    }
}

class NotSendMailException extends InternalServerErrorException {
    constructor() {
        super('Error sending mail');
    }
}

class ParkingNotAssignedException extends BadRequestException {
    constructor() {
        super('The parking not assigned to the user');
    }
}

class ParkingNotExistsException extends BadRequestException {
    constructor() {
        super('Parking not exists');
    }
}

class TokenNullException extends BadRequestException {
    constructor() {
        super('Token cannot be null');
    }
}

export {
    EmailAlreadyExistsException,
    EmailNotFoundException,
    EntityNotFoundException,
    InvalidTokenException,
    JwtAuthException,
    NotSendMailException,
    ParkingNotAssignedException,
    ParkingNotExistsException,
    TokenNullException
}