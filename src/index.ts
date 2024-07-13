import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import "reflect-metadata"
import express, { Express, Request, Response } from "express"
import * as dotenv from "dotenv"
dotenv.config()

const app: Express = express();
const port = 5000 || process.env.PORT;

app.get('/', (req, res) => {
    res.send('The server is working!');
});


app.listen(port, () => {
    console.log(`server is listening on ${port} !!!`);

    AppDataSource.initialize().then(async () => {

        console.log("Inserting a new user into the database...")

    }).catch(error => console.log(error))
});




