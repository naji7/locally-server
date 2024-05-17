import { Router } from "express";

import { AuthController } from "../controllers";
import { authenticateJwt, validateBodyParams } from "../middlewares";

const router = Router();
const authController: AuthController = new AuthController();

router.post("/registerWithStripe", authController.registerWithStripe);

router.post(
  "/updateUserSubscription",
  authenticateJwt,
  authController.updateUserSubscription
);

router.get("/authenticate", authenticateJwt, authController.authenticate);

router.post("/login", authController.login);

router.post("/adminLogin", authController.adminLogin);

router.post(
  "/sendOtp",
  validateBodyParams("email"),
  authController.sendOtpEmail
);

router.post("/verifyOtp", authController.verifyOtp);

router.get(
  "/transactions",
  authenticateJwt,
  authController.getUserTransactions
);

router.get("/allTransactions", authController.getAllTransactions);

export { router as auth };
