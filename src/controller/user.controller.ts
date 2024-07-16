import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function RegisterUser(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.UserName = username;
    user.email = email;
    user.password = hashedPassword;

    await AppDataSource.getRepository(User).save(user);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {

    console.log("Erroe registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

export async function LoginUser(req: Request, res: Response) {

  try {

    const { email, password } = req.body;

    const user = await AppDataSource.getRepository(User).findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({
      userid: user.id,
    }, JWT_SECRET_KEY, {
      expiresIn: "1h"
    });

    res.status(200).json({ token });
  } catch (error) {
    console.log("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const verifyToken = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.body.user = decoded;
    console.log(req.body.user);
    next();
  } catch (error) {
    console.log("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid Token" });
  }

}

export async function GetUserInfo(req: Request, res: Response) {
  try {
    const { userId } = req.body.user;
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, createdAt, updatedAt, ...userInfo } = user;
    res.status(200).json({ user: userInfo });
  } catch (error) {
    console.log("Error getting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

