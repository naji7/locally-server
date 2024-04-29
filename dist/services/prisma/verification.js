"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOtp = void 0;
const utils_1 = require("../../utils");
const main_1 = require("./main");
const saveOtp = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email }) {
    try {
        const otp = yield (0, utils_1.generatedOTP)();
        yield main_1.prisma.verification.upsert({
            where: {
                email: email,
            },
            update: {
                otp: +otp,
                expireAt: new Date(new Date().getTime() + 5 * 60000),
            },
            create: {
                email: email,
                otp: +otp,
                expireAt: new Date(new Date().getTime() + 5 * 60000),
            },
        });
        return otp;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.saveOtp = saveOtp;
//# sourceMappingURL=verification.js.map