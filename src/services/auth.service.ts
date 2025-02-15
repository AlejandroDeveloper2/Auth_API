import { compare } from "bcryptjs";
import {
  JsonWebTokenError,
  JwtPayload,
  sign,
  TokenExpiredError,
  verify,
} from "jsonwebtoken";
import axios from "axios";

import { ServerResponse } from "@interfaces/index";
import { enviromentVariables } from "@config/enviromentVariables";
import { UserCredential } from "@models/UserCredential.model";

import { handleAxiosError, AppError, hasAllProperties } from "@utils/index";

class AuthService {
  public async loginUser(
    userCredentials: UserCredential
  ): Promise<{ token: string }> {
    try {
      if (!hasAllProperties(userCredentials))
        throw new AppError(400, "hay campos que son obligatorios");

      /** Hacemos la petición a nuestra API de usuarios para validar si existe el usuario */
      const userResponse = await axios.get<
        ServerResponse<{ id: number; password: string }>
      >(
        `${enviromentVariables.USERS_API_URL}/users/email/${userCredentials.email}`
      );

      /** Obtenemos la password encriptada de el resultado de la solicitud */
      const hashedPassword: string = userResponse.data.data.password;

      /** Comparamos la contraseña que le pasamos por
       * parametro con las contreseña que obtenemos de la solicitud a la API de Usuarios*/
      const isPasswordCorrect = await compare(
        userCredentials.password,
        hashedPassword
      );

      /** Validamos si la contraseña es correcta */
      if (!isPasswordCorrect)
        throw new AppError(401, "La contraseña es incorrecta");

      /** Generamos y firmamos el token */
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
      return handleAxiosError(error);
    }
  }

  public async verifySessionToken(
    sessionToken: string | undefined
  ): Promise<JwtPayload> {
    try {
      /** Validar si el cliente ha proporcionado el token */
      if (!sessionToken)
        throw new AppError(401, "No se ha proporcionado un token de sesión");

      /** Validamos que el token sea correcto */
      const decodedToken: JwtPayload = verify(
        sessionToken,
        enviromentVariables.JWT_SECRET
      ) as JwtPayload;

      return decodedToken;
    } catch (error) {
      /** Validamos el tipo de error */
      if (error instanceof TokenExpiredError)
        throw new AppError(403, "El token ha expirado");
      else if (error instanceof JsonWebTokenError)
        throw new AppError(403, "Token invalido");

      const parsedError = error as AppError;
      throw new AppError(parsedError.code, parsedError.message);
    }
  }
}

export default AuthService;
