import express from 'express';
import user from './user.routes';

const router = express.Router();

router.get("/", (req, res) =>{
    return res.send("Hello World!");
})

router.get('/healthcheck', (req, res) => {
    return res.sendStatus(200);
});

router.use(user);

export default router;