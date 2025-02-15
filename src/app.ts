import express from "express";
import cors from "cors";

import { AuthRouter } from "@routes/auth.route";

import errorHandler from "@middleware/errorHandler";

const app = express();

app.use(express.json());

app.use(cors({ origin: "*" }));

app.use(AuthRouter);

app.use(errorHandler);

export default app;
