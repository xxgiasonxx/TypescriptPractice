import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import * as dotenv from "dotenv"
dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost" || process.env.DB_HOST,
    port: 5432 || Number(process.env.DB_PORT),
    username: "postgres" || process.env.DB_USERNAME,
    password: "123456" || process.env.DB_PASSWORD,
    database: "pr-db" || process.env.DB_DATABASE,
    // synchronize: true,
    // logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
})
