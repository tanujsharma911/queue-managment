import { EventEmitter } from "events";
import { tokenManager } from "./TokenManager.js";
import type { QueueType, TokenType } from "./types/types.js";
import { Queue } from "./models/queue.model.js";

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
    const todaysTokens = await tokenManager.getAllTokens();

    const tokens = todaysTokens
      .filter((token) => token.queueId === queueId)
      .sort((a, b) => a.issuedAt.getTime() - b.issuedAt.getTime());

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

  public getNextInQueue = async (queueId: string): Promise<string | null> => {
    const todaysTokens = await tokenManager.getAllTokens();

    const sortedTokens = todaysTokens
      .filter((token) => token.queueId === queueId)
      .sort((a, b) => a.issuedAt.getTime() - b.issuedAt.getTime());

    const tokenToCall = sortedTokens.find(
      (token) => token.queueId === queueId && token.status === "Waiting",
    );

    if (tokenToCall) {
      await tokenManager.updateToken(tokenToCall.token, {
        status: "Called",
        calledAt: new Date(),
      });
      await this.updateQueue(queueId, { status: "Occupied" });

      return tokenToCall.token;
    }

    return null;
  };

  public endCurrentInQueue = async (queueId: string) => {
    const sortedTokens = await tokenManager.getAllTokens();

    const currentToken = sortedTokens.find(
      (token) => token.queueId === queueId && token.status === "Called",
    );

    if (currentToken) {
      await tokenManager.updateToken(currentToken.token, {
        status: "Completed",
        completedAt: new Date(),
      });

      await this.updateQueue(queueId, { status: "Available" });
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

  public getQueueLength = async (queueId: string): Promise<number> => {
    const todaysTokens = await tokenManager.getAllTokens();

    const sortedTokens = todaysTokens.filter(
      (token) => token.queueId === queueId,
    );

    return sortedTokens.length;
  };
}

const queueManager = new QueueManager();

export { queueManager };
