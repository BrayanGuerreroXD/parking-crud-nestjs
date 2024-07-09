import { ApiProperty } from "@nestjs/swagger";

export class VehicleResponseDto {
    @ApiProperty({
        type: Number,
        description: 'Vehicle id',
        example: 1
    })
    id: number;

    @ApiProperty({
        type: String,
        description: 'Vehicle plate',
        example: 'ABC123'
    })
    plate: string;

    @ApiProperty({
        type: Number,
        description: 'Record count',
        example: 2
    })
    recordCount: number;

    constructor(id: number, plate: string, recordCount: number) {
        this.id = id;
        this.plate = plate;
        this.recordCount = recordCount;
    }
}