import { BaseEntity } from "../config/base.entity";
import { UserEntity } from "./user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('tokens')
export class TokenEntity extends BaseEntity {
    @Column()
    value!: string;

    @ManyToOne(() => UserEntity, {nullable: false})
    @JoinColumn({ name: "user_id"})
    user!: UserEntity;
}