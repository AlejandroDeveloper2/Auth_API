import { Response } from "express";
import { AxiosError } from "axios";

import { ErrorResponse } from "@interfaces/.";
import { handleHttp } from ".";

const handleAxiosError = (e: unknown, res: Response): void => {
  const error: AxiosError<ErrorResponse> = e as AxiosError<ErrorResponse>;
  if (error.response) {
    handleHttp(
      res,
      { data: null, message: error.response.data.message },
      error.response.status
    );
    return;
  }

  handleHttp(
    res,
    {
      data: null,
      message: "¡No se obtuvo respuesta del microservicio de autentificación!",
    },
    500
  );
};

export { handleAxiosError };
