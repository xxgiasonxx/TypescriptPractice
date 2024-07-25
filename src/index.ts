import app from "./app";
import * as dotenv from "dotenv"
import { createTypeormConnection } from "./data-source";
dotenv.config()
const port = 3000;



app.listen(port, async () => {
    console.log(`server is listening on http://localhost:${port} !!!`);

    await createTypeormConnection();
});




