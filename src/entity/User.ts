import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: false })
    UserName: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: false })
    email: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date

    @CreateDateColumn({ type: "timestamp" })
    updatedAt: Date
}