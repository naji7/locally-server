import { CorsOptions } from "cors";

export * from "./app";

export const logDirPath = "../logs";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://winland-api-b8e7f08fc1f1.herokuapp.com",
];

export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
