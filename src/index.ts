import { AppDataSource } from "./data-source"
import "reflect-metadata"
import express from "express"
import * as dotenv from "dotenv"
import { createExpressEndpoints } from '@ts-rest/express';
import { Contract } from "../contract/contract"
import { generateOpenApi } from '@ts-rest/open-api';
import * as swaggerUi from 'swagger-ui-express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import Routers from "./routes/All.routes";
dotenv.config()

export const app = express();
const port = process.env.API_PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const openApiDocument = generateOpenApi(Contract, {
    info: {
        title: 'API',
        version: '1.0.0',
    },
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

createExpressEndpoints(Contract.User, Routers.userRouter, app);

app.listen(port, () => {
    console.log(`server is listening on http://localhost:${port} !!!`);

    AppDataSource.initialize()
        .then(async (conn) => {
            await conn.runMigrations();
            console.log('Database connected successfully');
            console.log('Migration run successfully');
        }).catch(error => console.log(error))
});




