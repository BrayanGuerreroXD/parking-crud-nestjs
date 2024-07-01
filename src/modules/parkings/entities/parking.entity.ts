import { BaseEntity } from "../../../config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "../../users/entities/user.entity";

@Entity("parking")
export class ParkingEntity extends BaseEntity {
    @Column({nullable: false, length: 50})
    name!: string;

    @Column('double precision', {nullable: false})
    hourlyCost!: number;

    @Column({nullable: false})
    maxParkingSpace!: number;

    @ManyToOne(() => UserEntity, {nullable: false})
    @JoinColumn({ name: "user_id"})
    user!: UserEntity;
}