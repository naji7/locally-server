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
exports.AuthController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../services/prisma");
const app_1 = __importDefault(require("../errors/app"));
const email_1 = require("../services/email");
const utils_1 = require("../utils");
class AuthController {
    registerUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body = Object.assign(Object.assign({}, req.body), { email: req.body.email.toLowerCase() });
                const { fullName, teleNo, email, password } = req.body;
                const existingUser = yield prisma_1.prisma.user.findFirst({
                    where: {
                        OR: [{ email: email }, { teleNo: teleNo }],
                    },
                });
                if (existingUser)
                    throw new app_1.default("User already registered!", 409);
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                req.body.password = hashedPassword;
                yield (0, prisma_1.createUser)({ data: req.body });
                const mailOptions = (0, email_1.getMailOptions)({
                    to: email,
                    subject: "Registration Confirmation for Winlads Giveaway Program",
                    body: (0, utils_1.registerConfirmMessage)(fullName),
                });
                const transporter = (0, email_1.getTransporter)();
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.status(400).send({ message: "Error sending registration email" });
                    }
                    else {
                        res.status(200).send({
                            message: "Registration email sent successfully",
                        });
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user)
                    throw new app_1.default("User not authenticated!", 401);
                const user = yield prisma_1.prisma.user.findUnique({
                    where: { id: req.user.id },
                });
                return res.status(200).send({ user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body = Object.assign(Object.assign({}, req.body), { email: req.body.email.toLowerCase() });
                const { email, password } = req.body;
                if (!email || !password) {
                    throw new app_1.default("Missing Fields", 404);
                }
            }
            catch (err) {
                next(err);
            }
        });
    }
    sendOtpEmail(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body = Object.assign(Object.assign({}, req.body), { email: req.body.email.toLowerCase() });
            const { email } = req.body;
            try {
                const otp = yield (0, prisma_1.saveOtp)({ email });
                const mailOptions = (0, email_1.getMailOptions)({
                    to: email,
                    subject: "Winlads Email Verification",
                    body: (0, utils_1.otpVerificationMessage)(otp),
                });
                const transporter = (0, email_1.getTransporter)();
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.status(400).send({ message: "Error sending otp email" });
                    }
                    else {
                        res.status(200).send({
                            message: "Otp email sent successfully",
                        });
                    }
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.js.map