import { ApiProperty } from "@nestjs/swagger"

export class ParkingRecordEntryResponseDto {
    @ApiProperty({
        type: Number,
        description: 'Record id',
        example: 1
    })
    id!: number

    @ApiProperty({
        type: String,
        description: 'Vehicle plate',
        example: 'ABC123'
    })
    plate!: string

    @ApiProperty({
        type: Date,
        description: 'Entry date',
        example: '2021-10-15T00:00:00.000Z'
    })
    entryDate!: Date

    constructor(id: number, plate: string, entryDate: Date) {
        this.id = id
        this.plate = plate
        this.entryDate = entryDate
    }
}

export class ParkingRecordExitResponseDto {
    @ApiProperty({
        type: Number,
        description: 'Record id',
        example: 1
    })
    id!: number

    @ApiProperty({
        type: String,
        description: 'Vehicle plate',
        example: 'ABC123'
    })
    plate!: string

    @ApiProperty({
        type: Date,
        description: 'Entry date',
        example: '2021-10-15T00:00:00.000Z'
    })
    entryDate!: Date

    @ApiProperty({
        type: Date,
        description: 'Exit date',
        example: '2021-10-15T04:00:00.000Z'
    })
    exitDate!: Date

    constructor(id: number, plate: string, entryDate: Date, exitDate: Date) {
        this.id = id
        this.plate = plate
        this.entryDate = entryDate
        this.exitDate = exitDate
    }
}