import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import Stripe from "stripe";

import { createUser, prisma, saveOtp } from "../services/prisma";
import AppError from "../errors/app";
import { getMailOptions, getTransporter } from "../services/email";
import {
  generateJWT,
  otpVerificationMessage,
  registerConfirmMessage,
} from "../utils";
import { Duration, SERVER_URL, STRIPE_API_KEY } from "../constant";

export class AuthController {
  public async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      req.body = { ...req.body, email: req.body.email.toLowerCase() };

      const { fullName, teleNo, email, password } = req.body;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { teleNo: teleNo }],
        },
      });

      if (existingUser) throw new AppError("User already registered!", 409);

      const hashedPassword = await bcrypt.hash(password, 10);

      req.body.password = hashedPassword;

      const user = await createUser({ data: req.body });

      const payload = {
        id: user.id,
        fullName: fullName,
        email: email,
      };

      const token = generateJWT(payload);

      const mailOptions = getMailOptions({
        to: email,
        subject: "Registration Confirmation for Winlads Giveaway Program",
        body: registerConfirmMessage(fullName),
      });

      const transporter = getTransporter();

      // send email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(400).send({ message: "Error sending registration email" });
        } else {
          res.status(200).send({
            token,
            message: "Registration email sent successfully",
          });
        }
      });
    } catch (error) {
      next(error);
    }
  }
  public async registerWithStripe(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const stripe = new Stripe(STRIPE_API_KEY);
      req.body = { ...req.body, email: req.body.email.toLowerCase() };

      const {
        fullName,
        teleNo,
        email,
        password,
        subId,
        durationType,
        coupen,
        fivex,
      } = req.body;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { teleNo: teleNo }],
        },
      });

      if (existingUser) throw new AppError("User already registered!", 409);

      const hashedPassword = await bcrypt.hash(password, 10);

      req.body.password = hashedPassword;

      const existingSub = await prisma.subscriptionPlan.findFirst({
        where: {
          id: subId,
        },
      });

      if (!existingSub) throw new Error("Subscription plan not found");

      const user = await createUser({ data: req.body });

      let priceId;

      switch (durationType) {
        case Duration.MONTH:
          priceId = existingSub.priceIdMonth || "";
          break;
        case Duration.QUART:
          priceId = existingSub.priceIdSemiAnnual || "";
          break;
        case Duration.YEAR:
          priceId = existingSub.priceIdAnnual || "";
          break;
        default:
          throw new Error("Invalid durationType");
      }

      const payload = {
        id: user.id,
        fullName: fullName,
        email: email,
      };

      const token = generateJWT(payload);

      const session = await stripe.checkout.sessions.create({
        // success_url: `http://localhost:3000/saveUser?type=1&sub_id=${subId}&temp_id=${
        //   user.id
        // }&session_id={CHECKOUT_SESSION_ID}&coupen=${coupen || ""}&fivex=${
        //   fivex || ""
        // }&onetime=${0}`,
        success_url: `http://localhost:3000/subscriptionComplete/?token=${token}`,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        allow_promotion_codes: true,
      });

      res.json({
        status: 200,
        message: "Pay link accepted",
        payurl: session?.url,
        token,
      });
    } catch (error) {
      console.log("error : ", error);
      next(error);
    }
  }

  public async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("User not authenticated!", 401);

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          email: true,
          fullName: true,
          subscriptionPlan: true,
          subsciption: true,
        },
      });

      return res.status(200).send({ user });
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      req.body = { ...req.body, email: req.body.email.toLowerCase() };

      const { email, password } = req.body;

      if (!email || !password) {
        throw new AppError("Missing Fields", 404);
      }
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user || !user.password)
        throw new AppError("User doesn't exists", 404);

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) throw new AppError("Wrong Password", 401);

      const payload = {
        id: user.id,
        fullName: user.fullName,
        email: user.email || "",
      };

      const token = generateJWT(payload);

      res.status(200).send({
        token,
        message: "Successfully logged in",
      });
    } catch (err: any) {
      next(err);
    }
  }

  public async sendOtpEmail(req: Request, res: Response, next: NextFunction) {
    req.body = { ...req.body, email: req.body.email.toLowerCase() };

    const { email } = req.body;

    try {
      const otp = await saveOtp({ email });

      const mailOptions = getMailOptions({
        to: email,
        subject: "Winlads Email Verification",
        body: otpVerificationMessage(otp),
      });

      const transporter = getTransporter();

      // send email
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(400).send({ message: "Error sending otp email" });
        } else {
          res.status(200).send({
            message: "Otp email sent successfully",
          });
        }
      });
    } catch (error) {
      next(error);
    }
  }

  public async verifyOtp(req: Request, res: Response, next: NextFunction) {
    req.body = { ...req.body, email: req.body.email.toLowerCase() };

    const { otp, email } = req.body;

    try {
      const verification = await prisma.verification.findUnique({
        where: {
          email,
        },
      });

      if (!verification) {
        throw new Error("Email doesn't exists");
      }

      if (new Date().getTime() > +verification.expireAt) {
        res.status(400).send({ message: "OTP expired" });
      } else if (otp == verification.otp) {
        res.status(200).send({
          message: "OTP verified",
        });
      } else {
        res.status(400).send({ message: "Invalid OTP" });
      }
    } catch (error) {
      next(error);
    }
  }
}
