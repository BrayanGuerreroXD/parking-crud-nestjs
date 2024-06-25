import { BaseEntity } from "../config/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { RoleEntity } from "./role.entity";

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({unique: true, nullable: false})
    email!: string;

    @Column()
    password!: string;

    @ManyToOne(() => RoleEntity, {nullable: false})
    @JoinColumn({ name: "role_id"})
    role!: RoleEntity;
}