import { Request, Response, NextFunction } from "express";

import { AppError, handleHttp } from "@utils/index";

const errorHandle = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    handleHttp(
      res,
      {
        data: null,
        message: err.message,
      },
      err.code
    );
    return;
  }

  handleHttp(
    res,
    {
      data: null,
      message: "¡Ha ocurrido un error inesperado al realizar la operación!",
    },
    500
  );
};

export default errorHandle;
