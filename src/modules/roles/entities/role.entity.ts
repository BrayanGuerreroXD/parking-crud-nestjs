import { BaseEntity } from "../../../config/base.entity";
import { Column, Entity } from "typeorm";

@Entity('roles')
export class RoleEntity extends BaseEntity {
    @Column({
        unique: true, 
        nullable: false, 
        length: 10
    })
    name!: string;
}