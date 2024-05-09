import { NextFunction, Request, Response } from "express";

import { prisma } from "../services/prisma";
import AppError from "../errors/app";
import { cancelSubscription } from "../services/stripe";

export class GiveawayController {
  public async addGiveaways(req: Request, res: Response, next: NextFunction) {
    try {
      const sub = await prisma.giveaway.create({ data: req.body });

      res.status(200).send({
        data: sub,
        message: `Giveaway successfully added`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getUpcomingGiveaways(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const currentDate = new Date();

      const sub = await prisma.giveaway.findMany({
        where: {
          startDate: {
            gt: currentDate,
          },
          status: 0,
        },
      });

      res.status(200).send(sub);
    } catch (error) {
      next(error);
    }
  }
}
