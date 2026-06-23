import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  CLIENT_URL: process.env.CLIENT_URL || "",
  DB_URL: process.env.DB_URL || "",
  DB_NAME: "queue_cure",
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || "1h",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "yoursecret",
};
