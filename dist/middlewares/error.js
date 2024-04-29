"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverError = exports.notFound = void 0;
const app_1 = __importDefault(require("../errors/app"));
const winston_1 = __importDefault(require("../services/winston"));
const notFound = (req, res, next) => {
    const error = new app_1.default("Invalid Request!", 404);
    next(error);
};
exports.notFound = notFound;
const serverError = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (!err.statusCode || err.statusCode === 500) {
        winston_1.default.error("Error", {
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method,
            error: err.message,
            stack: err.stack,
        });
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).send({ message });
};
exports.serverError = serverError;
//# sourceMappingURL=error.js.map