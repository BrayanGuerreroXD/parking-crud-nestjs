export class ParkingRecordEntryResponseDto {
    id!: number
    plate!: string
    entryDate!: Date

    constructor(id: number, plate: string, entryDate: Date) {
        this.id = id
        this.plate = plate
        this.entryDate = entryDate
    }
}

export class ParkingRecordExitResponseDto {
    id!: number
    plate!: string
    entryDate!: Date
    exitDate!: Date

    constructor(id: number, plate: string, entryDate: Date, exitDate: Date) {
        this.id = id
        this.plate = plate
        this.entryDate = entryDate
        this.exitDate = exitDate
    }
}