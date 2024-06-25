import { BaseEntity } from "../config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ParkingEntity } from "./parking.entity";
import { VehicleEntity } from "./vehicle.entity";

@Entity("parkingrecord")
export class ParkingRecordEntity extends BaseEntity {
    @Column()
    entryDate!: Date;

    @Column()
    exitDate!: Date;

    @ManyToOne(() => VehicleEntity, {nullable: false})
    @JoinColumn({ name: "vehicle_id"})
    vehicle!: VehicleEntity;

    @ManyToOne(() => ParkingEntity, {nullable: false})
    @JoinColumn({ name: "parking_id"})
    parking!: ParkingEntity;
}