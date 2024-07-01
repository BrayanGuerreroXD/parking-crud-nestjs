import { BaseEntity } from "../../../config/base.entity";
import { ParkingEntity } from "../../../modules/parkings/entities/parking.entity";
import { VehicleEntity } from "../../../modules/vehicles/entities/vehicle.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity("parkingrecord")
export class ParkingRecordEntity extends BaseEntity {
    @Column({
        nullable: false,
        default: () => "CURRENT_TIMESTAMP",
        readonly: true
    })
    entryDate!: Date;

    @Column({
        nullable: true,
        default: () => "CURRENT_TIMESTAMP",
    })
    exitDate!: Date;

    @ManyToOne(() => VehicleEntity, {nullable: false})
    @JoinColumn({ name: "vehicle_id"})
    vehicle!: VehicleEntity;

    @ManyToOne(() => ParkingEntity, {nullable: false})
    @JoinColumn({ name: "parking_id"})
    parking!: ParkingEntity;
}