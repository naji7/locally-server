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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../services/prisma");
const constant_1 = require("../constant");
const errors_1 = require("../errors");
const authenticateJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        let user = (yield (0, exports.verifyToken)(token));
        req.user = user;
        if (req.user === undefined) {
            throw new Error("internal Error");
        }
        req.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.authenticateJwt = authenticateJwt;
const verifyToken = (token) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!token || token === "" || token == undefined)
                throw new Error("no token");
            let decodedPayload = (yield jsonwebtoken_1.default.verify(token, constant_1.JWT_SECRET));
            let payload = decodedPayload.payload;
            const user = yield prisma_1.prisma.user.findUnique({
                where: {
                    id: payload.id,
                },
            });
            if (!user)
                throw new Error("no user found");
            resolve(payload);
            return;
        }
        catch (err) {
            reject(new errors_1.Unauthorized(err.message));
            return;
        }
    }));
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth.js.map