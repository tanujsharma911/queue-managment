import { Token } from "./models/token.model.js";
import { queueManager } from "./QueueManager.js";
import type { TokenType } from "./types/types.js";

class TokenManager {
  private nextTokenNumber: number;

  constructor() {
    this.nextTokenNumber = 1;
  }

  public init = async () => {
    const recentToken = await Token.aggregate([
      {
        $sort: { issuedAt: -1 },
      },
      {
        $limit: 1,
      },
    ]);

    if (recentToken.length > 0) {
      const lastToken = recentToken[0].token;
      const lastTokenNumber = parseInt(lastToken.slice(1), 10);
      this.nextTokenNumber = lastTokenNumber + 1;
    }
  };

  public addToken = async (token: TokenType) => {
    await Token.create(token);
  };

  private getWaitTime = (token: TokenType) => {
    if (!token.calledAt) {
      return null;
    }

    return (
      new Date(token.calledAt).getTime() - new Date(token.issuedAt).getTime()
    );
  };

  public getEstimatedWaitTime = async (): Promise<number> => {
    const [tokensToday, tokensYesterday] = await Promise.all([
      this.getAllTokens(),
      this.getAllTokensOfYesterday(),
    ]);

    const recentTokens = [...tokensToday, ...tokensYesterday]
      .filter((token) => token.calledAt)
      .sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime())
      .slice(0, 5);

    if (recentTokens.length === 0) {
      return 0;
    }

    const totalWaitTime = recentTokens.reduce((sum, token) => {
      const waitTime = this.getWaitTime(token);
      return sum + (waitTime ?? 0);
    }, 0);

    return totalWaitTime / recentTokens.length;
  };

  public getToken = async (
    token: string,
  ): Promise<
    | (TokenType & {
        positionInQueue: number;
        tokenInRoom: string;
        queueName: string;
        doctorName: string;
        estimatedWaitTime: number;
      })
    | undefined
  > => {
    const tokenDetails = await Token.findOne({ token });

    if (!tokenDetails) {
      console.log(`Token details not found for token: ${token}`);
      return undefined;
    }

    const queueDetails = await queueManager.getQueue(tokenDetails.queueId);
    const queueTokens = await queueManager.getQueueTokens(tokenDetails.queueId);

    const tokenIndex = queueTokens
      .filter((t) => t.status === "Waiting")
      .findIndex((t) => t.token === token);

    if (!queueDetails) {
      console.error(
        `Queue details not found for queueId: ${tokenDetails.queueId}`,
      );
      return undefined;
    }

    const estimatedWaitTime = await this.getEstimatedWaitTime();

    const tokenMoreDetails = {
      ...(tokenDetails as any)._doc,
      positionInQueue: tokenIndex + 1,
      tokenInRoom: queueDetails.token,
      queueName: queueDetails.queueName,
      doctorName: queueDetails.doctorName,
      estimatedWaitTime: estimatedWaitTime * (tokenIndex + 1),
    };

    tokenMoreDetails.positionInQueue = tokenIndex + 1;

    return tokenMoreDetails;
  };

  public deleteToken = async (token: string) => {
    await Token.deleteOne({ token });
  };

  public updateToken = async (
    token: string,
    updatedToken: Partial<TokenType>,
  ): Promise<TokenType | null> => {
    const existingToken = await Token.findOne({ token });

    if (!existingToken) {
      return null;
    }

    const updatedTokenDoc = await Token.findOneAndUpdate(
      { token },
      updatedToken,
      {
        returnDocument: "after",
      },
    );

    return updatedTokenDoc;
  };

  public generateNextToken(): string {
    const next = this.nextTokenNumber;
    this.nextTokenNumber++;

    return `T${next.toString().padStart(4, "0")}`;
  }

  /**
   *
   * @returns All tokens created today
   */
  public getAllTokens = async (): Promise<TokenType[]> => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const tokensToday = await Token.aggregate([
      {
        $match: {
          issuedAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
    ]);

    return tokensToday;
  };

  public getAllTokensOfYesterday = async (): Promise<TokenType[]> => {
    const startOfDay = new Date();
    startOfDay.setDate(startOfDay.getDate() - 1);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setDate(endOfDay.getDate() - 1);
    endOfDay.setHours(23, 59, 59, 999);

    const tokensYesterday = await Token.aggregate([
      {
        $match: {
          issuedAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
    ]);

    return tokensYesterday;
  };
}

const tokenManager = new TokenManager();
tokenManager.init();

export { tokenManager };
