import type { Request, Response } from "express";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import bcrypt from "bcrypt";

export class UsersController {
  public signup = async (req: Request, res: Response) => {
    try {
      const { name, username, email, password } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        username,
        password: hashedPassword,
      });
      await user.save();

      res.status(201).json(user);
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({
        message: typeof error === "string" ? error : "Internal server error",
      });
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const { email, username, password } = req.body;

      const identifier = email ?? username;

      if (!identifier) {
        return res
          .status(422)
          .json({ message: "Email or username is required" });
      }

      if (typeof identifier !== "string") {
        return res
          .status(422)
          .json({ message: "Email or username must be a string" });
      }

      if (typeof password !== "string") {
        return res.status(422).json({ message: "Password is required" });
      }

      const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isPasswordValid = await user.verifyPassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = user.generateToken();

      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        })
        .json({ user, token });
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: err.message || "Internal server error" });
    }
  };

  public logout = (req: Request, res: Response) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  };

  public getMe = async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (err: any) {
      return res
        .status(500)
        .json({ message: err.message || "Internal server error" });
    }
  };
}
