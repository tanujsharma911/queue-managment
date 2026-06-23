import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { QueuesController } from "../controllers/queues.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const queueRouter: Router = Router();
const queuesController = new QueuesController();

queueRouter.get("/", queuesController.getQueues);
queueRouter.post("/", verifyJWT, queuesController.createQueue);
queueRouter.get(
  "/:queueId/call-next",
  verifyJWT,
  queuesController.callNextInQueue,
);
queueRouter.get(
  "/:queueId/end-current",
  verifyJWT,
  queuesController.endCurrentInQueue,
);

export { queueRouter };
