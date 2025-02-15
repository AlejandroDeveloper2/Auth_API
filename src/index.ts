import { enviromentVariables } from "@config/enviromentVariables";

import app from "./app";

app.listen(enviromentVariables.SERVER_PORT, () =>
  console.log("listening on port " + enviromentVariables.SERVER_PORT)
);
