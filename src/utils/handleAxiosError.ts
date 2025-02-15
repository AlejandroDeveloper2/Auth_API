import { AxiosError } from "axios";

import { ErrorResponse } from "@interfaces/.";
import { AppError } from ".";

const handleAxiosError = (e: unknown) => {
  const error: AxiosError<ErrorResponse> = e as AxiosError<ErrorResponse>;

  if (error.response) {
    const message = error.response
      ? error.response.data.message
      : "No hubo respuesta de la API de usuarios";

    throw new AppError(error.status ?? 500, message);
  }

  if (e instanceof AppError) throw new AppError(e.code, e.message);
  throw new AppError(500, "Hubo un error al realizar la petición");
};

export { handleAxiosError };
