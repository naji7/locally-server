import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import { prisma } from "../services/prisma";
import AppError from "../errors/app";
import { getMailOptions, getTransporter } from "../services/email";
import { stringToSlug } from "../utils";

export class SubscriptionController {
  public async addSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sub = await prisma.subscriptionPlan.create({ data: req.body });

      res.status(200).send({
        data: sub,
        message: `Subscription successfully added`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const sub = await prisma.subscriptionPlan.updateMany({
        where: {
          id: id,
        },
        data: req.body,
      });

      res.status(204).send({
        data: { sub },
        message: `Subscription successfully updated`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getSubscriptions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sub = await prisma.subscriptionPlan.findMany();

      res.status(200).send(sub);
    } catch (error) {
      next(error);
    }
  }
}
