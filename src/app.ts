import "reflect-metadata"
import express, { Request, Response, NextFunction } from "express"
import * as dotenv from "dotenv"
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerJson from "./routes/swagger.json";
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { ValidateError } from "tsoa";
import { RegisterRoutes } from "./routes/routes";
dotenv.config()

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));


RegisterRoutes(app);

app.use(function notFoundHandler(_req, res: Response) {
    res.status(404).send({
        message: "Not Found",
    });
});

app.use(function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): Response | void {
    if (err instanceof ValidateError) {
        // console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }

    next();
});



export default app;