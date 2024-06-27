import { 
    BadRequestException, 
    ConflictException, 
    HttpException, 
    InternalServerErrorException, 
    NotFoundException, 
    UnauthorizedException 
} from "@nestjs/common";

class EmailAlreadyExistsException extends HttpException {
    constructor() {
        super('Email already exists', 409);
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