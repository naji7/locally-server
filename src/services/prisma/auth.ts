import { ISendOtp } from "../../types";
import { generatedOTP } from "../../utils";
import { prisma } from "./main";

export const createUser = async ({ data }: any) => {
  console.log("data : ", data);
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

    return await prisma.subsciption.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        durationType: durationType,
        // endsAt: Date.now(),
      },
    });

    return otp;
  } catch (error) {
    throw new Error(error.message);
  }
};
