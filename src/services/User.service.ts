import { AppDataSource } from "../data-source";
import { User } from "../entities/User.entity";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret";

/**
 * User Register Body
 * @summary User Register Body
 * @property UserName - The username of the user
 * @property password - The password of the user
 * @property email - The email of the user
 * @example
 * {
 *  "UserName": "JohnDoe",
 *  "password": "password",
 *  "email": "John@gmail.com"
 * }
 */
export type UserRegisterBody = {
    UserName: string;
    password: string;
    email: string;
};


/**
* User Login Body
* @summary User Login Body
* @property password - The password of the user
* @property email - The email of the user
* @example
* {
*   "password": "password",
*   "email": "John@gmail.com"
* }
*/
export type UserLoginBody = {
    password: string;
    email: string;
};


export class UserService {
    public async RegisterUser(body: UserRegisterBody):
        Promise<{ status: 201 | 400 | 500, body: { message: string } }> {
        try {
            const { email, password, UserName } = body;

            const userExists = await AppDataSource.getRepository(User).findOne({ where: { email } });

            if (userExists) {
                return {
                    status: 400,
                    body: { message: "User already exists" }
                };
                // return res.status(400).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User();
            user.UserName = UserName;
            user.email = email;
            user.password = hashedPassword;

            await AppDataSource.getRepository(User).save(user);
            return {
                status: 201,
                body: { message: "User created successfully" }
            };
            // res.status(201).json({ message: "User created successfully" });
        } catch (error) {

            console.log("Erroe registering user:", error);
            return {
                status: 500,
                body: { message: "Internal server error" }
            }
            // res.status(500).json({ message: "Internal server error" });
        }
    }

    public async LoginUser(body: UserLoginBody):
        Promise<{ status: 200 | 400 | 500, body: { message?: string, token?: string } }> {
        try {
            const { email, password } = body;

            const user = await AppDataSource.getRepository(User).findOne({ where: { email } });

            if (!user) {
                return {
                    status: 400,
                    body: { message: "Invalid email or password" }
                }
                // return res.status(400).json({ message: "Invalid email or password" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return {
                    status: 400,
                    body: { message: "Invalid email or password" }
                }
                // return res.status(400).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign({
                userid: user?.id,
            }, JWT_SECRET_KEY, {
                expiresIn: "1h"
            });

            return {
                status: 200,
                body: { token }
            }
            // res.status(200).json({ token });
        } catch (error) {
            console.log("Error logging in user:", error);
            return {
                status: 500,
                body: { message: "Internal server error" }
            }
            // res.status(500).json({ message: "Internal server error" });
        }
    }

    public async GetUserInfo(req: any):
        Promise<{ status: 200 | 404 | 500, body: { message?: string, user?: { UserName: string, email: string } } }> {
        try {
            const userId = req.user.userid;

            const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
            if (!user) {
                return {
                    status: 404,
                    body: { message: "User not found" }
                }
                // return res.status(404).json({ message: "User not found" });
            }

            const { password, createdAt, updatedAt, id, ...userInfo } = user;
            return {
                status: 200,
                body: { user: userInfo }
            }
            // res.status(200).json({ user: userInfo });
        } catch (error) {
            console.log("Error getting users:", error);
            return {
                status: 500,
                body: { message: "Internal server error" }
            }
            // res.status(500).json({ message: "Internal server error" });
        }
    }
}