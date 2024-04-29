import { ISendOtp } from "../../types";
import { generatedOTP } from "../../utils";
import { prisma } from "./main";

export const saveOtp = async ({ email }: ISendOtp) => {
  try {
    const otp: any = await generatedOTP();

    await prisma.verification.upsert({
      where: {
        email: email,
      },
      update: {
        otp: +otp,
        expireAt: new Date(new Date().getTime() + 5 * 60000),
      },
      create: {
        email: email,
        otp: +otp,
        expireAt: new Date(new Date().getTime() + 5 * 60000),
      },
    });

    return otp;
  } catch (error) {
    throw new Error(error.message);
  }
};
