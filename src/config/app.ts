import { CorsOptions } from "cors";

export * from "./app";

export const logDirPath = "../logs";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3004",
  "http://localhost:4200",
];

export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
};
