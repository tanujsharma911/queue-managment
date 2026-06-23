import type { Request, Response } from "express";
import { tokenManager } from "../TokenManager.js";
import type { TokenType } from "../types/types.js";
import { Token } from "../models/token.model.js";

export class TokenController {
  public getTokens = async (req: Request, res: Response) => {
    const tokens = await Token.aggregate([
      {
        $sort: { issuedAt: -1 },
      },
      {
        $limit: 100,
      },
    ]);

    res.status(200).json({ tokens });
  };

  public getTokenDetails = async (req: Request, res: Response) => {
    try {
      const token = req.params.token;

      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      if (typeof token !== "string") {
        return res.status(400).json({ message: "Token must be a string" });
      }

      const tokenDetails = await tokenManager.getToken(token);

      if (!tokenDetails) {
        return res.status(404).json({ message: "Token not found" });
      }

      res.status(200).json({ token: tokenDetails });
    } catch (error) {
      console.error("Error fetching token details:", error);
      return res.status(500).json({
        message: typeof error === "string" ? error : "Internal server error",
      });
    }
  };

  public deleteToken = async (req: Request, res: Response) => {
    try {
      const token = req.params.token;

      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      if (typeof token !== "string") {
        return res.status(400).json({ message: "Token must be a string" });
      }

      await tokenManager.deleteToken(token);

      res.status(200).json({ message: "Token deleted successfully" });
    } catch (error) {
      console.error("Error deleting token:", error);
      return res.status(500).json({
        message: typeof error === "string" ? error : "Internal server error",
      });
    }
  };

  public createToken = async (req: Request, res: Response) => {
    try {
      const { username, queueId } = req.body;

      if (!username || typeof username !== "string") {
        return res
          .status(400)
          .json({ message: "username is required and must be a string" });
      }
      if (!queueId || typeof queueId !== "string") {
        return res
          .status(400)
          .json({ message: "queueId is required and must be a string" });
      }

      const token = tokenManager.generateNextToken();

      const tokenObj: TokenType = {
        token,
        username,
        status: "Waiting",
        queueId,
        issuedAt: new Date(),
        calledAt: null,
        completedAt: null,
      };

      await tokenManager.addToken(tokenObj);

      return res
        .status(201)
        .json({ message: "Token created", token: tokenObj });
    } catch (error) {
      console.error("Error creating token:", error);
      return res.status(500).json({
        message: typeof error === "string" ? error : "Internal server error",
      });
    }
  };

  public updateToken = async (req: Request, res: Response) => {
    try {
      const token = req.params.token;
      const { username, queueId, status } = req.body;

      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      if (typeof token !== "string") {
        return res.status(400).json({ message: "Token must be a string" });
      }

      const updates: Partial<TokenType> = {};

      if (username !== undefined) {
        if (typeof username !== "string") {
          return res.status(400).json({ message: "username must be a string" });
        }
        updates.username = username;
      }
      if (queueId !== undefined) {
        if (typeof queueId !== "string") {
          return res.status(400).json({ message: "queueId must be a string" });
        }
        updates.queueId = queueId;
      }
      if (status !== undefined) {
        if (
          status !== "Waiting" &&
          status !== "Called" &&
          status !== "Completed"
        ) {
          return res.status(400).json({ message: "Invalid status value" });
        }

        updates.status = status;

        if (status === "called") {
          updates.calledAt = new Date();
        }
        if (status === "completed") {
          updates.completedAt = new Date();
        }
      }

      await tokenManager.updateToken(token, updates);

      return res.status(200).json({ message: "Token updated" });
    } catch (error) {
      console.error("Error updating token:", error);
      return res.status(500).json({
        message: typeof error === "string" ? error : "Internal server error",
      });
    }
  };
}
