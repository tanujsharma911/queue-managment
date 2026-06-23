export interface TokenType {
  token: string;
  username: string;
  status: "Waiting" | "Called" | "Completed";
  queueId: string;
  issuedAt: Date;
  calledAt: Date | null;
  completedAt: Date | null;
}

export interface QueueType {
  queueId: string;
  queueName: string;
  doctorName: string;
  status: "Available" | "Occupied" | "Closed";
  token: string;
}
