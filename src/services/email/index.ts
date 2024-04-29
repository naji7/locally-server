import nodemailer from "nodemailer";
import { EMAIL_ACCESS_PASSWORD, USER_EMAIL, SENDER } from "../../constant";

export const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: USER_EMAIL,
      pass: EMAIL_ACCESS_PASSWORD,
    },
  });

export const getMailOptions = ({ to, subject, body, text }: any) => {
  return {
    from: SENDER,
    to,
    subject,
    html: body,
  };
};
