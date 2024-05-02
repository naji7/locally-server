import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import { createUser, prisma, saveOtp } from "../services/prisma";
import AppError from "../errors/app";
import { getMailOptions, getTransporter } from "../services/email";
import {
  generateJWT,
  otpVerificationMessage,
  registerConfirmMessage,
} from "../utils";

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

  public async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw new AppError("User not authenticated!", 401);

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
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
