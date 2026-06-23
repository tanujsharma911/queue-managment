import mongoose from "mongoose";

interface TokenModel {
  token: string;
  username: string;
  status: "Waiting" | "Called" | "Completed";
  queueId: string;
  issuedAt: Date;
  calledAt: Date | null;
  completedAt: Date | null;
}

type TokenDocument = mongoose.HydratedDocument<TokenModel>;

const tokenSchema = new mongoose.Schema<TokenDocument>(
  {
    token: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    status: {
      type: String,
      enum: ["Waiting", "Called", "Completed"],
      default: "Waiting",
    },
    queueId: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    calledAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Token = mongoose.model<TokenDocument>("Token", tokenSchema);
