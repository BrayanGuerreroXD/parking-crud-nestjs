import { BaseEntity } from "src/config/base.entity";
import { ParkingRecordEntity } from "src/modules/parking-records/entities/parking.record.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity("history")
export class HistoryEntity extends BaseEntity {
    @Column('double precision')
    totalCost!: number;

    @ManyToOne(() => ParkingRecordEntity, {nullable: false})
    @JoinColumn({ name: "parking_record_id"})
    parkingRecord!: ParkingRecordEntity;
}