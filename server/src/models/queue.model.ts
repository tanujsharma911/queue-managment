import mongoose from "mongoose";

interface QueueModel {
  queueId: string;
  queueName: string;
  doctorName: string;
  status: "Available" | "Occupied" | "Closed";
  token: string;
}

type QueueDocument = mongoose.HydratedDocument<QueueModel>;

const queueSchema = new mongoose.Schema<QueueDocument>(
  {
    queueId: { type: String, required: true, unique: true },
    queueName: { type: String, required: true },
    doctorName: { type: String, required: true },
    status: {
      type: String,
      enum: ["Available", "Occupied", "Closed"],
      default: "Available",
    },
    token: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Queue = mongoose.model<QueueDocument>("Queue", queueSchema);
