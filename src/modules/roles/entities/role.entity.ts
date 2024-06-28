import { BaseEntity } from "src/config/base.entity";
import { Column, Entity } from "typeorm";

@Entity('roles')
export class RoleEntity extends BaseEntity {
    @Column()
    name!: string;
}