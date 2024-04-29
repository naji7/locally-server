import { NextFunction, Request, Response } from "express";

export function validateBodyParams(...params: any) {
  const middleware = (req: Request, res: Response, next: NextFunction) => {
    for (const param of params) {
      if (!(param in req.body)) {
        return res.status(400).json({ error: `${param} is required` });
      }
    }

    next();
  };

  return middleware;
}
