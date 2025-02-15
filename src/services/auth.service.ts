import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import axios, { AxiosError } from "axios";

import { ErrorResponse, ServerResponse } from "@interfaces/index";
import { enviromentVariables } from "@config/enviromentVariables";

import { AppError } from "@utils/AppError";

import { UserCredential } from "@models/UserCredential.model";

class AuthService {
  public async loginUser(
    userCredentials: UserCredential
  ): Promise<{ token: string }> {
    try {
      /** Hacemos la petición a nuestra API de usuarios para validar si existe el usuario */
      const userResponse = await axios.get<
        ServerResponse<{ id: number; password: string }>
      >(
        `${enviromentVariables.USERS_API_URL}/users/email/${userCredentials.email}`
      );

      const hashedPassword: string = userResponse.data.data.password;

      const isPasswordCorrect = await compare(
        userCredentials.password,
        hashedPassword
      );

      /** Validamos si la contraseña es correcta */
      if (!isPasswordCorrect)
        throw new AppError(401, "La contraseña es incorrecta");

      const token = sign(
        { id: userResponse.data.data.id },
        enviromentVariables.JWT_SECRET,
        {
          expiresIn: "2d",
        }
      );

      return {
        token,
      };
    } catch (error) {
      const axiosError: AxiosError<ErrorResponse> =
        error as AxiosError<ErrorResponse>;
      const message = axiosError.response
        ? axiosError.response.data.message
        : "";

      throw new AppError(axiosError.status ?? 500, message);
    }
  }

  public verifySessionToken() {}
}

export default AuthService;
