export class ExceptionResponseDto {
    message!: string[];
    error!: string;
    status!: number;
    date!: string;
  
    constructor(message: string[], error: string, status: number) {
        this.message = message;
        this.error = error;
        this.status = status;
        this.date = new Date().toISOString();
    }
}