import "dotenv/config";
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";

import logger from "./services/winston";
import { corsOptions } from "./config";
import { auth, giveaway, subscription, user } from "./routes";
import { notFound, serverError } from "./middlewares";

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors(corsOptions));

//routes
app.use("/api", auth);
app.use("/api", subscription);
app.use("/api", giveaway);
app.use("/api", user);

const port = process.env.PORT || 5000;
app.listen(parseInt(port as string), () => {
  logger.info(`Server running on port:${port}`);
});

app.use(notFound);
app.use(serverError);
