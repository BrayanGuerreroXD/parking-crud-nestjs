import { BaseEntity } from "../../config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ParkingRecordEntity } from "../../parking-records/entities/parking.record.entity";

@Entity("history")
export class HistoryEntity extends BaseEntity {
    @Column()
    totalCost!: number;

    @ManyToOne(() => ParkingRecordEntity, {nullable: false})
    @JoinColumn({ name: "parking_record_id"})
    parkingRecord!: ParkingRecordEntity;
}