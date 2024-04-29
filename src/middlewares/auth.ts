import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

import { IAuthUser } from "../types";
import { prisma } from "../services/prisma";
import { JWT_SECRET } from "../constant";
import { Unauthorized } from "../errors";

export const authenticateJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let user = (await verifyToken(token)) as IAuthUser;
    req.user = user;
    if (req.user === undefined) {
      throw new Error("internal Error");
    }
    req.user = user;
    next();
  } catch (err: any) {
    next(err);
  }
};

export const verifyToken = (token: string | undefined) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token || token === "" || token == undefined)
        throw new Error("no token");

      let decodedPayload = (await jwt.verify(
        token,
        JWT_SECRET as Secret
      )) as jwt.JwtPayload;
      let payload = decodedPayload.payload as IAuthUser;

      const user = await prisma.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) throw new Error("no user found");

      resolve(payload);

      return;
    } catch (err: any) {
      reject(new Unauthorized(err.message));
      return;
    }
  });
};
