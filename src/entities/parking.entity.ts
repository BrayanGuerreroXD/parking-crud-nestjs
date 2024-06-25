import { BaseEntity } from "src/config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity("parking")
export class ParkingEntity extends BaseEntity {
    @Column()
    name!: string;

    @Column()
    hourlyCost!: number;

    @Column()
    maxParkingSpace!: number;

    @ManyToOne(() => UserEntity, {nullable: false})
    @JoinColumn({ name: "user_id"})
    user!: UserEntity;
}