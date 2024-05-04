import { Router } from "express";

import { AuthController } from "../controllers";
import { authenticateJwt, validateBodyParams } from "../middlewares";

const router = Router();
const authController: AuthController = new AuthController();

router.post("/register", authController.registerUser);

router.post("/registerWithStripe", authController.registerWithStripe);

router.get("/authenticate", authenticateJwt, authController.authenticate);

router.post("/login", authController.login);

router.post(
  "/sendOtp",
  validateBodyParams("email"),
  authController.sendOtpEmail
);

router.post("/verifyOtp", authController.verifyOtp);

export { router as auth };
