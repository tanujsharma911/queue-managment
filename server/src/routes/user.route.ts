import { Router } from "express";
import { UsersController } from "../controllers/users.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter: Router = Router();
const usersController = new UsersController();

userRouter.post("/signup", usersController.signup);
userRouter.post("/login", usersController.login);
userRouter.post("/logout", verifyJWT, usersController.logout);
userRouter.get("/me", verifyJWT, usersController.getMe);

export { userRouter };
