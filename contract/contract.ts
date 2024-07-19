import { initContract } from "@ts-rest/core"
import path from "path";
import { z } from "zod"

const c = initContract();

export const UserSchemaO = z.object({
    id: z.string(),
    UserName: z.string(),
    password: z.string(),
    email: z.string().email(),
});

const UserWithoutId = UserSchemaO.omit({id: true});

const UserSchemaWithoutNameAndId = UserWithoutId.omit({UserName: true});


export type UserSchema = z.infer<typeof UserSchemaO>;

export type UserSchemaWithoutId = z.infer<typeof UserWithoutId>;

export type UserSchemaWithoutNameAndId = z.infer<typeof UserSchemaWithoutNameAndId>;

export const Contract = c.router({
    User:{
        RegisterUser:{
            method: 'POST',
            path: '/register',
            responses:{
                201: z.object({message: z.string()}),
                400: z.object({message: z.string()}),
                500: z.object({message: z.string()})
            },
            body: UserWithoutId,
            summary: 'Register a new user',
            strictStatusCodes: true
        },
        LoginUser:{
            method: 'POST',
            path: '/login',
            responses:{
                200: z.object({token: z.string()}),
                400: z.object({message: z.string()}),
                500: z.object({message: z.string()})
            },
            body: UserSchemaO.omit({UserName: true, id: true}),
            summary: 'Login a user',
            strictStatusCodes: true
        },
        GetUserInfo:{
            method: 'POST',
            path: '/userinfo',
            responses:{
                200: UserSchemaO.omit({password: true, id: true}).required(),
                404: z.object({message: z.string()}),
                500: z.object({message: z.string()})
            },
            headers: z.object({authorization: z.string()}),
            body: z.object({token: z.string()}),
            summary: 'Get a user by id',
            strictStatusCodes: true
        }
    }
});