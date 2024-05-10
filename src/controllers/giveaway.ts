import { NextFunction, Request, Response } from "express";

import { prisma } from "../services/prisma";
import AppError from "../errors/app";
import { cancelSubscription } from "../services/stripe";
import { GiveawayType } from "../constant";

export class GiveawayController {
  public async addGiveaways(req: Request, res: Response, next: NextFunction) {
    try {
      const { type } = req.body;

      const sub = await prisma.giveaway.create({ data: req.body });

      if (type === GiveawayType.WEEKLY) {
        const allUsers = await prisma.user.findMany();

        const entryObject = {
          giveawayId: sub.id,
          startDate: sub.startDate,
          imageUrl: sub.imageUrl,
          title: sub.title,
          entries: 25,
        };

        for (const user of allUsers) {
          let entries: any = user.entries;
          let totalEntries = user.totalEntries;

          if (Array.isArray(entries)) {
            entries.push(entryObject);
          } else {
            entries = [entryObject];
          }

          await prisma.user.update({
            where: { id: user.id },
            data: {
              entries: entries,
              totalEntries: totalEntries + 25,
            },
          });
        }
      }

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
