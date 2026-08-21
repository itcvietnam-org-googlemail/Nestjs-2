
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        name: 'first_name'
    })
    firstName!: string;

    @Column({
        name: 'last_name'
    })
    lastName!: string;
}