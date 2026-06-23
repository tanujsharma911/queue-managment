export interface RoomCardProps {
  queueId: string;
  name: string;
  status: string;
  token?: string;
  doctorName?: string;
}
export interface TokenType {
  token: string;
  username: string;
  status: "Waiting" | "Called" | "Completed";
  queueId: string;
  issuedAt: Date;
  calledAt: Date | null;
  completedAt: Date | null;
}
export interface TokenDetailsType {
  calledAt: string;
  completedAt: string;
  doctorName: string;
  estimatedWaitTime: number;
  issuedAt: string;
  positionInQueue: number;
  queueId: string;
  queueName: string;
  status: string;
  token: string;
  username: string;
  tokenInRoom: string;
}

export interface QueueType {
  queueId: string;
  queueName: string;
  doctorName: string;
  status: "Available" | "Occupied" | "Closed";
  token: string;
}

export interface StatType {
  name: string;
  data?: string | number;
  describe: string;
}
