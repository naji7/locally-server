"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const winston_1 = __importDefault(require("./services/winston"));
const config_1 = require("./config");
const routes_1 = require("./routes");
const middlewares_1 = require("./middlewares");
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(body_parser_1.default.urlencoded({ limit: "50mb", extended: false }));
app.use(body_parser_1.default.json({ limit: "50mb" }));
app.use((0, cors_1.default)(config_1.corsOptions));
app.use("/api", routes_1.auth);
app.use("/api", routes_1.subscription);
const port = process.env.PORT || 5000;
app.listen(parseInt(port), () => {
    winston_1.default.info(`Server running on port:${port}`);
});
app.use(middlewares_1.notFound);
app.use(middlewares_1.serverError);
//# sourceMappingURL=app.js.map