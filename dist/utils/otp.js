"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatedOTP = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generatedOTP = () => new Promise((res) => crypto_1.default.randomBytes(3, (err, buffer) => {
    res(parseInt(buffer.toString("hex"), 16).toString().substr(0, 6));
}));
exports.generatedOTP = generatedOTP;
//# sourceMappingURL=otp.js.map