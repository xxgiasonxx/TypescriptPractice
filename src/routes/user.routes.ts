import express from "express";
import { GetUserInfo, LoginUser, RegisterUser, verifyToken } from "../controller/user.controller";

const router = express.Router();

router.post("/register", RegisterUser);

router.post("/login", LoginUser);

router.post("/userinfo", verifyToken, GetUserInfo);

export default router;
