import Express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config.js";
import { userRouter } from "./routes/user.route.js";
import { queueRouter } from "./routes/queue.route.js";
import { tokenRouter } from "./routes/token.route.js";
import { statsController } from "./controllers/stats.controller.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";

const app: Express.Application = Express();

app.use(Express.json());
app.use(cookieParser());
app.use(Express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/users", userRouter);
app.use("/api/tokens", tokenRouter);
app.use("/api/queues", queueRouter);
app.use("/api/stats", verifyJWT, statsController);

export { app };
