import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { Contract } from '../../contract/contract';
import { app } from '../index';
import userRouter from './user.routes';

// const router = express.Router();

const Routers = {
    userRouter

}
export default Routers;



// router.get("/", (req, res) =>{
//     return res.send("Hello World!");
// })

// router.get('/healthcheck', (req, res) => {
//     return res.sendStatus(200);
// });

// const router = s.router
// router.use(user);
