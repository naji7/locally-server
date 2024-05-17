import { Duration } from "../../constant";
import { generatedOTP } from "../../utils";
import { prisma } from "./main";

export const createUser = async ({ data }: any) => {
  const { fullName, teleNo, email, password, subId, durationType, refferalId } =
    data;
  try {
    let endsAt;

    switch (durationType) {
      case Duration.MONTH:
        endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        break;
      case Duration.QUART:
        endsAt = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000);
        break;
      case Duration.YEAR:
        endsAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        throw new Error("Invalid durationType");
    }

    // if (refferalId) {
    //   const refferalUser = await prisma.user.findFirst({
    //     where: {
    //       id: refferalId,
    //     },
    //     select: {
    //       subscriptionPlan: true,
    //     },
    //   });

    //   console.log("refferalUser : ", refferalUser.s);
    //   const refferal = await prisma.referral.create({
    //     data: {
    //       referredBy: refferalId,
    //     },
    //   });
    // }

    const user = await prisma.user.create({
      data: {
        fullName: fullName,
        teleNo: teleNo,
        email: email,
        password: password,
        subscriptionPlan: {
          connect: {
            id: subId,
          },
        },
      },
    });

    const subs = await prisma.subscription.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        subscriptionPlan: {
          connect: {
            id: subId,
          },
        },
        durationType: durationType,
        endsAt: endsAt,
      },
    });

    return {
      id: user.id,
      subsId: subs.id,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
