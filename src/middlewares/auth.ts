import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import NotAuthorizedError from "../errors/not-authorized-error";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    next(new NotAuthorizedError());

    return;
  }

  const jwtSecret = process.env.JWT_SECRET as string;

  try {
    const payload = jwt.verify(token, jwtSecret) as { id: string };

    res.locals.user = payload;

    next();
  } catch (error) {
    next(new NotAuthorizedError());
  }
};
