import { ISendOtp } from "../../types";
import { generatedOTP } from "../../utils";
import { prisma } from "./main";

export const createUser = async ({ data }: any) => {
  const {
    fullName,
    teleNo,
    email,
    password,
    affiliateId,
    subId,
    durationType,
  } = data;
  try {
    const otp: any = await generatedOTP();

    let endsAt;

    switch (durationType) {
      case "monthly":
        endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        break;
      case "quartly":
        endsAt = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000);
        break;
      case "yearly":
        endsAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        throw new Error("Invalid durationType");
    }

    const user = await prisma.user.create({
      data: {
        fullName: fullName,
        teleNo: teleNo,
        email: email,
        password: password,
        affiliateId: affiliateId,
        subscriptionPlan: {
          connect: {
            id: subId,
          },
        },
      },
    });

    await prisma.subscription.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        durationType: durationType,
        endsAt: endsAt,
      },
    });

    return {
      id: user.id,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
