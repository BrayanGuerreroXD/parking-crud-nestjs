export class EarningsResponseDto {
    today: number;
    week: number;
    month: number;
    year: number;

    constructor(today: number, week: number, month: number, year: number) {
        this.today = today;
        this.week = week;
        this.month = month;
        this.year = year;
    }
}    