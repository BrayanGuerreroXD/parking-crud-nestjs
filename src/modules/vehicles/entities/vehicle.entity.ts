import { BaseEntity } from "../../../config/base.entity";
import { Column, Entity } from "typeorm";

@Entity('vehicles')
export class VehicleEntity extends BaseEntity {
    @Column({
        nullable: false,
        length: 6
    })
    plate!: string;
}