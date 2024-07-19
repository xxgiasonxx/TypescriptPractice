import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { UserSchemaWithoutId, UserSchemaWithoutNameAndId } from "../../contract/contract";
import * as dotenv from "dotenv";
dotenv.config();


const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret";

export async function RegisterUser(email: string, password: string, UserName: string): 
Promise<{ status: number, body: { message: string } }>
{
  try {
    const userExists = await AppDataSource.getRepository(User).findOne({ where: { email } });

    if (userExists) {
      return {
        status: 400,
        body: {
          message: "User already exists"
        }
      }
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
      body: {
        message: "User created successfully"
      }
    }
    // res.status(201).json({ message: "User created successfully" });
  } catch (error) {

    console.log("Erroe registering user:", error);
    return {
      status: 500,
      body: {
        message: "Internal server error"
      }
    }
    // res.status(500).json({ message: "Internal server error" });
  }

}

export async function LoginUser(email: string, password: string):
Promise<{ status: number, body: { message?: string, token?: string } }>
{
  
  try {
    const user = await AppDataSource.getRepository(User).findOne({ where: { email } });

    if (!user) {
      return {
        status: 400,
        body: {
          message: "Invalid email or password"
        }
      }
      // return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return {
        status: 400,
        body: {
          message: "Invalid email or password"
        }
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
      body: {
        token: token
      }
    }
    // res.status(200).json({ token });
  } catch (error) {
    console.log("Error logging in user:", error);
    return {
      status: 500,
      body: {
        message: "Internal server error"
      }
    }
    // res.status(500).json({ message: "Internal server error" });
  }
}

export const verifyToken = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.body.token = decoded;
    console.log(req.body.user);
    next();
  } catch (error) {
    console.log("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid Token" });
  }

}

export async function GetUserInfo(userId: string) {
  try {
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      return {
        status: 404,
        body: {
          message: "User not found"
        }
      }
      // return res.status(404).json({ message: "User not found" });
    }

    const { password, createdAt, updatedAt, id, ...userInfo } = user;
    return {
      status: 200,
      body: {
        user: userInfo
      }
    
    }
    // res.status(200).json({ user: userInfo });
  } catch (error) {
    console.log("Error getting users:", error);
    return {
      status: 500,
      body: {
        message: "Internal server error"
      }
    }
    // res.status(500).json({ message: "Internal server error" });
  }
}

