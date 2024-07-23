import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";


@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({ nullable: false })
    public UserName: string;

    @Column({ nullable: false })
    public password: string;

    @Column({ nullable: false })
    public email: string;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt: Date;

    @CreateDateColumn({ type: "timestamp" })
    public updatedAt: Date;
}