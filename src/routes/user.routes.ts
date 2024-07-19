import { GetUserInfo, LoginUser, RegisterUser, verifyToken } from "../controller/user.controller";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import { Contract } from "../../contract/contract";
import { app } from "..";

const s = initServer();

const router = s.router(Contract.User, {
    RegisterUser: async ({ body }) => {
        const result = await RegisterUser(body.UserName, body.email, body.password);
        if (result.status === 500) {
            return {
                status: 500,
                body: {
                    message: result.body.message
                }
            }
        } else if (result.status === 400) {
            return {
                status: 400,
                body: {
                    message: result.body.message
                }
            }
        }
        return {
            status: 201,
            body: {
                message: result.body.message
            }
        }
    },
    LoginUser: async ({ body }) => {
        const result = await LoginUser(body.email, body.password);
        
        if (result.status === 500) {
            return {
                status: 500,
                body: {
                    message: result.body.message!
                }
            }
        } else if (result.status === 400) {
            return {
                status: 400,
                body: {
                    message: result.body.message!
                }
            }
        }
        return {
            status: 200,
            body: {
                token: result.body.token!
            }
        }
    },
    GetUserInfo: {
        middleware: [
            verifyToken
        ],
        handler: async ({ body }) => {
            const result = await GetUserInfo(body.token);
            if (result.status === 500) {
                return {
                    status: 500,
                    body: {
                        message: result.body.message!
                    }
                }
            } else if (result.status === 404) {
                return {
                    status: 404,
                    body: {
                        message: result.body.message!
                    }
                }
            }
            return {
                status: 200,
                body: result.body.user!
            }
        }
    }
});

// createExpressEndpoints(Contract.User, router, app);


export default router;
