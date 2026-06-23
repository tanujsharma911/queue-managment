import dotenv from "dotenv";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config.js";
import { app } from "./app.js";
import { Server } from "socket.io";
import { queueManager } from "./QueueManager.js";

dotenv.config();

const server = http.createServer(app);

const connectDB = async () => {
  try {
    await mongoose.connect(config.DB_URL + `/${config.DB_NAME}`);
    console.log("\x1b[32m%s\x1b[0m", "\n💾  Connected to MongoDB");
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

const io = new Server(server, {
  cors: {
    origin: config.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

connectDB().then(() => {
  io.on("connection", (socket) => {
    const handleQueueUpdate = (data: any) => {
      socket.emit("queueUpdated", data);
    };

    queueManager.on("queueUpdated", handleQueueUpdate);

    socket.on("disconnect", () => {
      queueManager.off("queueUpdated", handleQueueUpdate);
    });
  });

  server.listen(config.PORT, () => {
    console.log("Server is running on port", config.PORT);
  });
});
