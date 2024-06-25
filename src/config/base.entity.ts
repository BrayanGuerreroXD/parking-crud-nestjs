import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export abstract class BaseEntity {
    @PrimaryGeneratedColumn( 'increment', {type: 'bigint'} )
    id!: number

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at'
    })
    createdAt!: Date

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at'
    })
    updatedAt!: Date
}