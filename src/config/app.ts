import { CorsOptions } from "cors";

export * from "./app";

export const logDirPath = "../logs";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://winlads-client-app.vercel.app",
];

export const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};
