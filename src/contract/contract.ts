import { initContract, isAppRouteOtherResponse } from "@ts-rest/core"
import { z } from "zod"

const c = initContract();

export const UserO = z.object({
    id: z.string(),
    UserName: z.string(),
    password: z.string(),
    email: z.string().email(),
});

const UserOWithoutId = UserO.omit({ id: true });

const UserOWithoutNameAndId = UserOWithoutId.omit({ UserName: true });

const UserOWithoutPasswordAndId = UserOWithoutId.omit({ password: true });

const ResponseMessageO = z.object({ message: z.string() });


export type UserSchema = z.infer<typeof UserO>;

export type UserSchemaWithoutId = z.infer<typeof UserOWithoutId>;

export type UserSchemaWithoutNameAndId = z.infer<typeof UserOWithoutNameAndId>;

export type UserSchemaWithoutPasswordAndId = z.infer<typeof UserOWithoutPasswordAndId>;

export type ResponseMessageSchema = z.infer<typeof ResponseMessageO>;

export const Contract = c.router({
    User: {
        RegisterUser: {
            method: 'POST',
            path: '/register',
            responses: {
                201: ResponseMessageO,
                400: ResponseMessageO,
                500: ResponseMessageO
            },
            body: UserOWithoutId,
            summary: 'Register a new user',
            strictStatusCodes: true
        },
        LoginUser: {
            method: 'POST',
            path: '/login',
            responses: {
                200: z.object({ token: z.string() }),
                400: ResponseMessageO,
                500: ResponseMessageO
            },
            body: UserOWithoutNameAndId,
            summary: 'Login a user',
            strictStatusCodes: true
        },
        GetUserInfo: {
            method: 'GET',
            path: '/userinfo',
            metadata: {
                middleware: [
                    'verifyToken'
                ],
            },
            responses: {
                200: UserOWithoutPasswordAndId.required(),
                404: ResponseMessageO,
                401: ResponseMessageO,
                500: ResponseMessageO
            },
            summary: 'Get a user by jwt token',
            description: 'Go to the /login route to get the token and put token to Authorize header ex: `Bearer ${token}`',
            strictStatusCodes: true
        }
    }
});