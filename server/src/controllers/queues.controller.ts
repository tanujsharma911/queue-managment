import type { Request, Response } from "express";
import { randomUUID } from "crypto";
import { queueManager } from "../QueueManager.js";
import type { QueueType } from "../types/types.js";

export class QueuesController {
  public async createQueue(req: Request, res: Response) {
    try {
      const { queueName, doctorName } = req.body;

      if (!queueName || typeof queueName !== "string") {
        return res
          .status(400)
          .json({ message: "queueName is required and must be a string" });
      }
      if (!doctorName || typeof doctorName !== "string") {
        return res
          .status(400)
          .json({ message: "doctorName is required and must be a string" });
      }

      const newQueue: QueueType = {
        queueId: randomUUID(),
        queueName: queueName,
        doctorName: doctorName,
        status: "Available",
        token: "",
      };

      await queueManager.createQueue(newQueue);

      res
        .status(201)
        .json({ message: "Queue created successfully", queue: newQueue });
    } catch (error) {
      console.error("Error creating queue:", error);
      res.status(500).json({
        message: typeof error === "string" ? error : "Internal server error",
      });
    }
  }

  public getQueues = async (req: Request, res: Response) => {
    try {
      const queues = await queueManager.getQueues();

      res.status(200).json({ queues });
    } catch (error) {
      console.error("Error fetching queues:", error);
      res.status(500).json({
        message: typeof error === "string" ? error : "Internal server error",
      });
    }
  };

  public callNextInQueue = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { queueId } = req.params;

      if (!queueId || Array.isArray(queueId) || typeof queueId !== "string") {
        res.status(400).json({ message: "queueId is required" });
        return;
      }

      const queue = await queueManager.getQueue(queueId);

      if (!queue) {
        res.status(404).json({ message: "Queue not found" });
        return;
      }

      const nextToken = await queueManager.getNextInQueue(queueId);

      if (!nextToken) {
        await queueManager.updateQueue(queueId, { status: "Available" });
        res.status(200).json({ message: "No tokens in queue" });
        return;
      }

      const updatedQueue = await queueManager.updateQueue(queueId, {
        status: "Occupied",
        token: nextToken,
      });

      res.status(200).json({
        message: "Next token called successfully",
        token: nextToken,
        queue: updatedQueue,
      });
    } catch (error) {
      console.error("Error calling next token in queue:", error);
      res.status(500).json({
        message: typeof error === "string" ? error : "Internal server error",
      });
    }
  };

  public endCurrentInQueue = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { queueId } = req.params;

      if (!queueId || Array.isArray(queueId) || typeof queueId !== "string") {
        res.status(400).json({ message: "queueId is required" });
        return;
      }

      const queue = await queueManager.getQueue(queueId);

      if (!queue) {
        res.status(404).json({ message: "Queue not found" });
        return;
      }

      await queueManager.endCurrentInQueue(queueId);

      res.status(200).json({
        message: "Current token ended successfully",
      });
    } catch (error) {
      console.error("Error ending current token in queue:", error);
      res.status(500).json({
        message: typeof error === "string" ? error : "Internal server error",
      });
    }
  };
}
