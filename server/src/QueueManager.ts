import { EventEmitter } from "events";
import { tokenManager } from "./TokenManager.js";
import type { QueueType, TokenType } from "./types/types.js";
import { Queue } from "./models/queue.model.js";
import { Token } from "./models/token.model.js";

class QueueManager extends EventEmitter {
  constructor() {
    super();
  }

  public createQueue = async (queue: QueueType) => {
    await Queue.create(queue);

    this.emit("queueUpdated", { queues: this.getQueues() });
  };

  public getQueue = async (queueId: string): Promise<QueueType | null> => {
    const queue = await Queue.findOne({ queueId });
    return queue;
  };

  public getQueueTokens = async (queueId: string): Promise<TokenType[]> => {
    const tokens = await Token.aggregate([
      {
        $match: { queueId },
      },
      {
        $sort: { issuedAt: 1 },
      },
      {
        $limit: 100,
      },
    ]);

    return tokens;
  };

  public getQueues = async (): Promise<QueueType[]> => {
    const queues = await Queue.find({}).sort({ queueName: 1 });

    return queues;
  };

  public updateQueue = async (
    queueId: string,
    updates: Partial<QueueType>,
  ): Promise<QueueType | null> => {
    const queue = await Queue.findOne({ queueId });

    if (!queue) {
      console.error(`Queue with ID ${queueId} not found.`);
      return null;
    }

    const updatedQueue = await Queue.findOneAndUpdate(
      { queueId },
      { $set: updates },
      { returnDocument: "after" },
    ).lean();

    this.emit("queueUpdated", { queues: await this.getQueues() });

    return updatedQueue as QueueType;
  };

  public callNextToken = async (queueId: string) => {
    const nextTokens = await Token.find({ queueId, status: "Waiting" }).sort({
      issuedAt: 1,
    });

    const tokenToCall = nextTokens[0];

    if (tokenToCall) {
      await tokenManager.updateToken(tokenToCall.token, {
        status: "Called",
        calledAt: new Date(),
      });
      return await this.updateQueue(queueId, {
        status: "Occupied",
        token: tokenToCall.token,
      });
    }
  };

  public endCurrentInQueue = async (queueId: string) => {
    const currentToken = await Token.findOne({
      queueId,
      status: "Called",
    });

    if (currentToken) {
      await tokenManager.updateToken(currentToken.token, {
        status: "Completed",
        completedAt: new Date(),
      });

      return await this.updateQueue(queueId, { status: "Available" });
    }
  };

  public removeFromQueue = async (
    queueId: string,
    token: string,
  ): Promise<void> => {
    await tokenManager.updateToken(token, {
      status: "Completed",
      completedAt: new Date(),
    });

    const queue = await this.getQueue(queueId);

    if (queue && queue.token === token) {
      await this.updateQueue(queueId, { ...queue, token: "" });
    }

    const queues = await this.getQueues();

    this.emit("queueUpdated", { queues });
  };
}

const queueManager = new QueueManager();

export { queueManager };
