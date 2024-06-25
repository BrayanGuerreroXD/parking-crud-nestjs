import { BaseEntity } from "src/config/base.entity";
import { Column, Entity } from "typeorm";

@Entity({name: 'roles'})
export class RoleEntity extends BaseEntity {
    @Column()
    name!: string;

    @Column()
    description!: string;
}