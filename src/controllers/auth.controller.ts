import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { UserCredential } from "@models/UserCredential.model";

import AuthService from "@services/auth.service";
import { handleHttp } from "@utils/index";

const authService = new AuthService();

class AuthController {
  public async postLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userCredentials: UserCredential = req.body;
      const session = await authService.loginUser(userCredentials);
      handleHttp<{ token: string }>(
        res,
        { data: session, message: "Login correcto" },
        200
      );
    } catch (error) {
      next(error);
    }
  }

  public async getTokenValidation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sessionToken = req.headers.authorization?.split(" ").pop();
      const decodedToken: JwtPayload = await authService.verifySessionToken(
        sessionToken
      );
      handleHttp<JwtPayload>(
        res,
        { data: decodedToken, message: "Token de sesión valido" },
        200
      );
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
