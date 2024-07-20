import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../services/prisma";
import AppError from "../errors/app";
import { generateJWT } from "../utils";

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      req.body = { ...req.body, email: req.body.email.toLowerCase() };

      const { fullName, email, password } = req.body;

      console.log(fullName, email, password);

      if (!fullName || !email || !password)
        throw new AppError("Missing Fields", 404);

      const exist = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (exist) throw new AppError("Email already exists", 404);

      const hashedPassword = await bcrypt.hash(password, 10);

      req.body.password = hashedPassword;

      const user = await prisma.user.create({
        data: {
          fullName,
          email,
          password: hashedPassword,
        },
      });

      const payload = {
        id: user.id,
        fullName: fullName,
        email: email || "",
      };

      const token = generateJWT(payload);

      res.status(200).send({
        data: { token, userId: user.id },
        message: `User successfully registered `,
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

  // public async getStoreProducts(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   try {
  //     const { storeId } = req.body;

  //     const products = await prisma.product.findMany({
  //       where: { storeId: storeId },
  //     });

  //     return res.status(200).send({ products });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

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
}
