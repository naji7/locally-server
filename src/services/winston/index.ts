import { createLogger, format, transports } from "winston";

import { logDirPath } from "../../config";

const logger = createLogger({
  defaultMeta: { service: "winlads-service" },
  transports: [
    new transports.Console(),
    // new transports.File({
    //   level: "warn",
    //   filename: `${logDirPath}/logsWarnings.log`,
    // }),
    // new transports.File({
    //   level: "error",
    //   filename: `${logDirPath}/logsErrors.log`,
    // }),
  ],
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.json(),
    format.prettyPrint(),
    format.metadata()
  ),
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

export default logger;
