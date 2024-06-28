import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { RoleEntity } from "../../roles/entities/role.entity";
import { Exclude } from "class-transformer";
import { BaseEntity } from "../../../config/base.entity";

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({unique: true, nullable: false})
    email!: string;

    @Exclude()
    @Column()
    password!: string;

    @ManyToOne(() => RoleEntity, {nullable: false})
    @JoinColumn({ name: "role_id"})
    role!: RoleEntity;
}