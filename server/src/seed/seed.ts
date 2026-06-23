import mongoose from "mongoose";
import { config } from "../config.js";
import { Queue } from "../models/queue.model.js";
import { Token } from "../models/token.model.js";
import type { QueueType, TokenType } from "../types/types.js";
import { exit } from "node:process";

const ROOM_1_ID = "230bcdf7-2edb-41ac-ac3b-d59f0736901e";
const ROOM_2_ID = "9c65b088-886f-4a07-9892-7c6f9ae0a455";
const ROOM_3_ID = "d1044c08-2f64-49c5-8395-7a34face8bd4";

/**
 * Generates a dynamic Date object based on the current system date.
 * @param hours - The hour of the day (0-23)
 * @param minutes - The minute of the hour (0-59)
 * @param daysAgo - Number of days to subtract from today (default is 0 for today)
 */
const getDynamicDate = (
  hours: number,
  minutes: number,
  daysAgo: number = 0,
): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const mockQueues: QueueType[] = [
  {
    queueId: ROOM_1_ID,
    queueName: "Room 1",
    doctorName: "Dr. Smith",
    token: "",
    status: "Available",
  },
  {
    queueId: ROOM_2_ID,
    queueName: "Room 2",
    doctorName: "Dr. Johnson",
    token: "",
    status: "Available",
  },
  {
    queueId: ROOM_3_ID,
    queueName: "Room 3",
    doctorName: "Dr. Lee",
    token: "",
    status: "Available",
  },
];

export const mockTokens: TokenType[] = [
  // ---------------- ROOM 1 ----------------
  {
    token: "T0048",
    username: "Olivia Davis",
    status: "Completed",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(8, 45),
    calledAt: getDynamicDate(8, 45),
    completedAt: getDynamicDate(9, 0),
  },
  {
    token: "T0051",
    username: "James Anderson",
    status: "Completed",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(8, 55),
    calledAt: getDynamicDate(9, 0),
    completedAt: getDynamicDate(9, 15),
  },
  {
    token: "T0045",
    username: "Alex Johnson",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(9, 0),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0066",
    username: "Emily Walker",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(9, 20),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0054",
    username: "Mia Jackson",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(9, 35),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0057",
    username: "Daniel Thompson",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(9, 45),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0081",
    username: "John Mitchell",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(9, 50),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0060",
    username: "Harper Martinez",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(10, 0),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0063",
    username: "Alexander Rodriguez",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(10, 10),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0069",
    username: "Jack Young",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(10, 35),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0072",
    username: "Avery Wright",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(10, 45),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0075",
    username: "David Scott",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(11, 0),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0078",
    username: "Grace Baker",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(11, 10),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0084",
    username: "Lily Turner",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(11, 35),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0087",
    username: "Anthony Parker",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(11, 45),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0090",
    username: "Zoey Collins",
    status: "Waiting",
    queueId: ROOM_1_ID,
    issuedAt: getDynamicDate(12, 0),
    calledAt: null,
    completedAt: null,
  },

  // ---------------- ROOM 2 ----------------
  {
    token: "T0046",
    username: "Emma Wilson",
    status: "Completed",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(9, 5),
    calledAt: getDynamicDate(9, 5),
    completedAt: getDynamicDate(9, 20),
  },
  {
    token: "T0061",
    username: "William Robinson",
    status: "Completed",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(9, 10),
    calledAt: getDynamicDate(9, 20),
    completedAt: getDynamicDate(9, 35),
  },
  {
    token: "T0049",
    username: "Noah Miller",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(9, 15),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0052",
    username: "Isabella Thomas",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(9, 25),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0076",
    username: "Scarlett Green",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(9, 40),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0055",
    username: "Ethan Harris",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(9, 40),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0058",
    username: "Amelia White",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(9, 50),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0064",
    username: "Abigail Lewis",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(10, 15),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0067",
    username: "Sebastian Hall",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(10, 25),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0070",
    username: "Sofia Hernandez",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(10, 40),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0073",
    username: "Matthew Lopez",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(10, 50),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0079",
    username: "Samuel Nelson",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(11, 15),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0082",
    username: "Victoria Perez",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(11, 25),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0085",
    username: "Gabriel Phillips",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(11, 40),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0088",
    username: "Hannah Evans",
    status: "Waiting",
    queueId: ROOM_2_ID,
    issuedAt: getDynamicDate(11, 50),
    calledAt: null,
    completedAt: null,
  },

  // ---------------- ROOM 3 ----------------
  {
    token: "T0056",
    username: "Charlotte Martin",
    status: "Completed",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(9, 0),
    calledAt: getDynamicDate(9, 0),
    completedAt: getDynamicDate(9, 15),
  },
  {
    token: "T0047",
    username: "Liam Brown",
    status: "Completed",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(9, 10),
    calledAt: getDynamicDate(9, 15),
    completedAt: getDynamicDate(9, 30),
  },
  {
    token: "T0050",
    username: "Sophia Taylor",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(9, 20),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0053",
    username: "Benjamin Moore",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(9, 30),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0071",
    username: "Aiden King",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(9, 30),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0059",
    username: "Michael Garcia",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(9, 55),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0086",
    username: "Aria Campbell",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(10, 0),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0062",
    username: "Evelyn Clark",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(10, 5),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0065",
    username: "Henry Lee",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(10, 20),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0068",
    username: "Elizabeth Allen",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(10, 30),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0074",
    username: "Ella Hill",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(10, 55),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0077",
    username: "Joseph Adams",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(11, 5),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0080",
    username: "Chloe Carter",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(11, 20),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0083",
    username: "Owen Roberts",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(11, 30),
    calledAt: null,
    completedAt: null,
  },
  {
    token: "T0089",
    username: "Christopher Edwards",
    status: "Waiting",
    queueId: ROOM_3_ID,
    issuedAt: getDynamicDate(11, 55),
    calledAt: null,
    completedAt: null,
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(config.DB_URL + `/${config.DB_NAME}`);
    console.log("\x1b[32m%s\x1b[0m", "\n💾  Connected to MongoDB");
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

connectDB().then(async () => {
  await Queue.insertMany(mockQueues);
  await Token.insertMany(mockTokens);

  console.log("\x1b[32m%s\x1b[0m", "\n✅  Seed data inserted successfully");
  exit(0);
});
