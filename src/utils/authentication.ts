import { rejects } from "assert";
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { UserService } from "../services/User.service";
import { stat } from "fs";
dotenv.config();


export function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[],
): Promise<any> {
    if (securityName === "jwt") {
        const token =
            request.headers.authorization?.split(" ")[1]!;
        return new Promise((resolve, reject) => {
            if (!token) {
                reject(new Error("No token provided"));;
            }
            jwt.verify(token, process.env.JWT_SECRET_KEY ?? "secert_key", function (err: any, decoded: any) {
                if (err) {
                    reject(err);
                } else {
                    // Check if JWT contains all required scopes
                    for (let scope of scopes?.values() ?? []) {
                        if (!decoded.scopes.includes(scope)) {
                            reject(new Error("JWT does not contain required scope."));
                        }
                    }
                    resolve(decoded);
                }
            });
        });
    }
    return Promise.reject({});
}

export const expressAuthenticationRecasted = expressAuthentication as (req: Request, securityName: string, scopes?: string[], res?: Response) => Promise<any>;