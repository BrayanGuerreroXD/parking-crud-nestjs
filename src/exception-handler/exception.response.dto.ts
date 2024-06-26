export class ExceptionResponseDto {
    message!: string;
  
    constructor(message: string) {
        this.message = message;
    }
}