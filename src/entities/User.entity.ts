import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * User Entity
 * @summary User Entity
 * @property UserName - The username of the user
 * @property password - The password of the user
 * @property email - The email of the user
 * @property createdAt - The date the user was created
 * @property updatedAt - The date the user was last updated
 * @example
 * {
 *  "UserName": "JohnDoe",
 *  "password": "password",
 *  "email": "John@gmail.com",
 * }
 */
@Entity()
export class User {
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