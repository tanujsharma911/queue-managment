import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { User } from "../models/user.model.js";

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decode = jwt.verify(token, config.ACCESS_TOKEN_SECRET as string);

    req.user = decode as { _id: string; username: string };

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};
