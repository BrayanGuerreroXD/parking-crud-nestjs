import { BaseEntity } from "../../config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { ParkingEntity } from "../../parkings/entities/parking.entity";
import { VehicleEntity } from "../../vehicles/entities/vehicle.entity";

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