import "dotenv/config";

export const enviromentVariables = {
  SERVER_PORT: process.env.SERVER_PORT || 3005,
  USERS_API_URL: process.env.USERS_API_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
};
