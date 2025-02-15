import { Router } from "express";

import AuthController from "@controllers/auth.controller";

const AuthRouter = Router();

const authController = new AuthController();

AuthRouter.post("/auth/login", authController.postLogin).get(
  "/auth/verify",
  authController.getTokenValidation
);

export { AuthRouter };
