import "reflect-metadata"
import express from "express"
import * as dotenv from "dotenv"
import { createExpressEndpoints } from '@ts-rest/express';
import { Contract } from "./contract/contract"
import { generateOpenApi } from '@ts-rest/open-api';
import * as swaggerUi from 'swagger-ui-express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import Routers from "./routes/All.routes";
dotenv.config()

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const openApiDocument = generateOpenApi(Contract, {
    info: {
        title: 'API',
        version: '1.0.0',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                name: "Authorization",
                in: "header",
                bearerFormat: "JWT",
                description: 'Enter the token with the`Bearer: ` prefix, e.g. "Bearer abcde12345".'
            },
        },

    },
    security: [
        {
            bearerAuth: [],
        },
    ],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

createExpressEndpoints(Contract.User, Routers.userRouter, app);
export default app;