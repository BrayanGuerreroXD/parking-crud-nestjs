export class VehicleResponseDto {
    id: number;
    plate: string;
    recordCount: number;

    constructor(id: number, plate: string, recordCount: number) {
        this.id = id;
        this.plate = plate;
        this.recordCount = recordCount;
    }
}