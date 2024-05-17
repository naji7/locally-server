import { NextFunction, Request, Response } from "express";

import { prisma } from "../services/prisma";
import AppError from "../errors/app";
import { cancelSubscription } from "../services/stripe";
import { GiveawayType } from "../constant";

export class UserController {
  public async getSubscribedUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const users = await prisma.user.findMany({
        where: {
          subId: {
            not: undefined,
          },
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          teleNo: true,
          subscription: true,
          subscriptionPlan: true,
          transaction: true,
        },
      });

      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  }

  public async addPartner(req: Request, res: Response, next: NextFunction) {
    try {
      const sub = await prisma.partners.create({ data: req.body });

      res.status(200).send({
        data: sub,
        message: `Partner successfully added`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updatePartner(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const sub = await prisma.partners.updateMany({
        where: {
          id: id,
        },
        data: req.body,
      });

      res.status(204).send({
        data: { sub },
        message: `Partner successfully updated`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getPartners(req: Request, res: Response, next: NextFunction) {
    try {
      const partners = await prisma.partners.findMany();

      res.status(200).send(partners);
    } catch (error) {
      next(error);
    }
  }
}
