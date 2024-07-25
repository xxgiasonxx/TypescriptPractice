import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
dotenv.config()

const TypeORMConfig: Record<string, DataSource> = {
    development: new DataSource({
        name: "development",
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_DATABASE || "postgres",
        synchronize: false,
        logging: false,
        entities: [
            __dirname + '/**/*.entity.{js,ts}',
        ],
        migrations: [
            __dirname + "/migration/*.{ts,js}"
        ],
    }),
    production: new DataSource({
        name: "production",
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: process.env.DB_DATABASE || "postgres",
        synchronize: false,
        logging: false,
        entities: [
            __dirname + '/**/*.entity.{js,ts}',
        ],
        migrations: [
            __dirname + "/migration/*.{ts,js}"
        ],
    }),
    test: new DataSource({
        name: "test",
        type: "postgres",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "postgres",
        database: "api_test",
        synchronize: false,
        logging: false,
        dropSchema: true,
        entities: [
            __dirname + '/**/*.entity.{js,ts}',
        ],
        migrations: [
            __dirname + "/migration/*.{ts,js}"
        ],
    })
}

export const AppDataSource = TypeORMConfig[process.env.NODE_ENV ?? "development"];

export const createTypeormConnection = async () => {
    await AppDataSource.initialize()
        .then(async (conn) => {
            await conn.runMigrations();
            console.log('Database connected successfully');
            console.log('Migration run successfully');
        }).catch(error => console.log(error))
    return AppDataSource;
}