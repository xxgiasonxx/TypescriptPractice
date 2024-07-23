import { initServer } from "@ts-rest/express";
import { Contract } from "../contract/contract";
import { GetUserInfo, LoginUser, RegisterUser, verifyToken } from "../controller/user.controller";

const s = initServer();

const router = s.router(Contract.User, {
    RegisterUser: async ({ body }) => {
        return await RegisterUser(body);
    },
    LoginUser: async ({ body }) => {
        return await LoginUser(body);
    },
    GetUserInfo: {
        middleware: [
            verifyToken
        ],
        handler: async ({ req, res }) => {
            return await GetUserInfo(req, res);
        }
    }
});


export default router;
