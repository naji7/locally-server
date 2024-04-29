"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMailOptions = exports.getTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const constant_1 = require("../../constant");
const getTransporter = () => nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: constant_1.USER_EMAIL,
        pass: constant_1.EMAIL_ACCESS_PASSWORD,
    },
});
exports.getTransporter = getTransporter;
const getMailOptions = ({ to, subject, body, text }) => {
    return {
        from: constant_1.SENDER,
        to,
        subject,
        html: body,
    };
};
exports.getMailOptions = getMailOptions;
//# sourceMappingURL=index.js.map