import { CorsOptions } from "cors";

export * from "./app";

export const logDirPath = "../logs";

const allowedOrigins = ["http://localhost:3000"];

export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
