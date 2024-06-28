import { BaseEntity } from "../../../config/base.entity";
import { ParkingEntity } from "../../../modules/parkings/entities/parking.entity";
import { VehicleEntity } from "../../../modules/vehicles/entities/vehicle.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity("parkingrecord")
export class ParkingRecordEntity extends BaseEntity {
    @Column()
    entryDate!: Date;

    @Column({nullable: true})
    exitDate!: Date;

    @ManyToOne(() => VehicleEntity, {nullable: false})
    @JoinColumn({ name: "vehicle_id"})
    vehicle!: VehicleEntity;

    @ManyToOne(() => ParkingEntity, {nullable: false})
    @JoinColumn({ name: "parking_id"})
    parking!: ParkingEntity;
}