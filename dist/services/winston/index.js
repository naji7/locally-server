"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const config_1 = require("../../config");
const logger = (0, winston_1.createLogger)({
    defaultMeta: { service: "winlads-service" },
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({
            level: "warn",
            filename: `${config_1.logDirPath}/logsWarnings.log`,
        }),
        new winston_1.transports.File({
            level: "error",
            filename: `${config_1.logDirPath}/logsErrors.log`,
        }),
    ],
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.colorize(), winston_1.format.json(), winston_1.format.prettyPrint(), winston_1.format.metadata()),
});
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston_1.transports.Console({
        format: winston_1.format.simple(),
    }));
}
exports.default = logger;
//# sourceMappingURL=index.js.map