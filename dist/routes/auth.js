"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
exports.auth = router;
const authController = new controllers_1.AuthController();
router.post("/register", authController.registerUser);
router.get("/authenticate", middlewares_1.authenticateJwt, authController.authenticate);
router.post("/login", authController.login);
router.post("/sendOtp", (0, middlewares_1.validateBodyParams)("email"), authController.sendOtpEmail);
//# sourceMappingURL=auth.js.map