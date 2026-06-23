import { Router } from "express";
import { TokenController } from "../controllers/token.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const tokenRouter: Router = Router();
const tokenController = new TokenController();

tokenRouter.get("/", tokenController.getTokens);
tokenRouter.get("/:token", tokenController.getTokenDetails);
tokenRouter.post("/", verifyJWT, tokenController.createToken);
tokenRouter.delete("/:token", verifyJWT, tokenController.deleteToken);
tokenRouter.put("/:token", verifyJWT, tokenController.updateToken);

export { tokenRouter };
