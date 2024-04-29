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
exports.createUser = void 0;
const utils_1 = require("../../utils");
const main_1 = require("./main");
const createUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ data }) {
    console.log("data : ", data);
    const { fullName, teleNo, email, password, affiliateId, subId, durationType, } = data;
    try {
        const otp = yield (0, utils_1.generatedOTP)();
        const user = yield main_1.prisma.user.create({
            data: {
                fullName: fullName,
                teleNo: teleNo,
                email: email,
                password: password,
                affiliateId: affiliateId,
                subscriptionPlan: {
                    connect: {
                        id: subId,
                    },
                },
            },
        });
        return yield main_1.prisma.subsciption.create({
            data: {
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                durationType: durationType,
            },
        });
        return otp;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.createUser = createUser;
//# sourceMappingURL=auth.js.map