import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
import { Client } from "pg"
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

export const createDBIfNotExists = async (AppDataSource: DataSource): Promise<void> => {
    const client = new Client({
        user: process.env.DB_USERNAME || "postgres",
        host: process.env.DB_HOST || "localhost",
        password: process.env.DB_PASSWORD || "postgres",
        port: Number(process.env.DB_PORT) || 5432,
    });

    await client.connect();

    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${AppDataSource.options.database}';`);

    if (res.rowCount === 0) {
        console.log(`${AppDataSource.options.database} database not found, creating it.`);
        await client.query(`CREATE DATABASE "${AppDataSource.options.database}";`);
        console.log(`created database ${AppDataSource.options.database}`);
    } else {
        console.log(`${AppDataSource.options.database} database exists.`);
    }

    await client.end();
}

export const createTypeormConnection = async () => {
    await createDBIfNotExists(AppDataSource);

    await AppDataSource.initialize()
        .then(async (conn) => {
            console.log('Database connected successfully');
        }).catch(error => console.log(error))

    await AppDataSource.runMigrations()
        .catch(error => console.log(error));
    console.log('Migration run successfully');
    return AppDataSource;
}