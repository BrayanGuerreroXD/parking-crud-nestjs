import { ApiProperty } from "@nestjs/swagger";

export class EarningsResponseDto {
    @ApiProperty({
        type: Number,
        description: 'Today earnings',
        example: 0
    })
    today: number;

    @ApiProperty({
        type: Number,
        description: 'Week earnings',
        example: 0
    })
    week: number;

    @ApiProperty({
        type: Number,
        description: 'Month earnings',
        example: 0
    })
    month: number;

    @ApiProperty({
        type: Number,
        description: 'Year earnings',
        example: 0
    })
    year: number;

    constructor(today: number, week: number, month: number, year: number) {
        this.today = today;
        this.week = week;
        this.month = month;
        this.year = year;
    }
}    