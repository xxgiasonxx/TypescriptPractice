import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "postgres",
    synchronize: false,
    logging: false,
    entities: [
        __dirname + "/entity/*.{ts,js}"
    ],
    migrations: [
        __dirname + "/migration/*.{ts,js}"
    ],
})
