import type { Request, Response } from "express";
import { tokenManager } from "../TokenManager.js";
import { describe } from "node:test";
import { Token } from "../models/token.model.js";

export const statsController = async (req: Request, res: Response) => {
  const tokens = await Token.aggregate([
    {
      $sort: { issuedAt: -1 },
    },
    {
      $limit: 100,
    },
  ]);

  // Total Waiting
  const totalWaiting = tokens.filter(
    (token) => token.status === "Waiting",
  ).length;

  // Average Session Time
  let averageSessionTime = 0;

  const completedTokens = tokens.filter(
    (token) => token.calledAt && token.completedAt,
  );

  if (completedTokens.length > 0) {
    averageSessionTime =
      completedTokens.reduce((sum, token) => {
        const completedAt = new Date(token.completedAt!).getTime();
        const calledAt = new Date(token.calledAt!).getTime();

        return sum + (completedAt - calledAt);
      }, 0) / completedTokens.length;
  }

  // Average Wait Time
  // Longest Wait Time
  let averageWaitTime = 0;
  let longestWaitTime = 0;

  const calledAndCompletedTokens = tokens.filter(
    (token) => token.calledAt && token.completedAt,
  );

  if (calledAndCompletedTokens.length > 0) {
    averageWaitTime =
      calledAndCompletedTokens.reduce((sum, token) => {
        const calledAt = new Date(token.calledAt!).getTime();
        const createdAt = new Date(token.issuedAt).getTime();

        longestWaitTime = Math.max(longestWaitTime || 0, calledAt - createdAt);

        return sum + (calledAt - createdAt);
      }, 0) / calledAndCompletedTokens.length;
  }

  // Patients Arrived
  let patientsArrived = tokens.length;

  // Yesterday Arrived
  const yesterdayStartTime = new Date();
  yesterdayStartTime.setDate(yesterdayStartTime.getDate() - 1);
  yesterdayStartTime.setHours(0, 0, 0, 0);

  const yesterdayEndTime = new Date();
  yesterdayEndTime.setDate(yesterdayEndTime.getDate() - 1);
  yesterdayEndTime.setHours(23, 59, 59, 999);

  const tokensYesterday = tokens.filter(
    (token) =>
      token.issuedAt >= yesterdayStartTime &&
      token.issuedAt <= yesterdayEndTime,
  );
  let patientsArrivedYesterday = tokensYesterday.length;

  const response = [
    {
      name: "Total Waiting",
      data: totalWaiting,
      describe:
        "Total number of patients currently waiting in the clinic today",
    },
    {
      name: "Average Session Time",
      data: Math.round(averageSessionTime / 1000 / 60)
        ? `${Math.round(averageSessionTime / 1000 / 60)} min`
        : undefined, // Convert to minutes
      describe: "Average time a patient spends in the clinic today",
    },
    {
      name: "Average Wait Time",
      data: Math.round(averageWaitTime / 1000 / 60)
        ? `${Math.round(averageWaitTime / 1000 / 60)} min`
        : undefined,
      describe: "Average time a patient waits today",
    },
    {
      name: "Longest Wait Time",
      data: Math.round(longestWaitTime / 1000 / 60)
        ? `${Math.round(longestWaitTime / 1000 / 60)} min`
        : undefined,
      describe: "The longest time a patient waits today",
    },
    {
      name: "Patients Arrived",
      data: patientsArrived,
      describe: "Number of patients who visited today",
    },
    {
      name: "Yesterday Arrived",
      data: patientsArrivedYesterday,
      describe: "Number of patients who visited yesterday",
    },
  ];

  res.status(200).json({ stats: response });
};
