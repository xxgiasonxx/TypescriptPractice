import { AppDataSource } from "./data-source"
import "reflect-metadata"
import express, { Express, Request, Response } from "express"
import * as dotenv from "dotenv"
import router from "./routes/All.routes"
dotenv.config()

const app: Express = express();
const port = process.env.WEB_PORT || 3000;

app.use(express.json());
app.use(router);


app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port} !!!`);

    AppDataSource.initialize()
    .then(async (conn) => {
        await conn.runMigrations();
        console.log('Database connected successfully');
        console.log('Migration run successfully');
    }).catch(error => console.log(error))
});




