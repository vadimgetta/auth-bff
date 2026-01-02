import { NextFunction, Request, Response } from "express";

import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import { transformError } from "../helpers/transform-error";
import User from "../models/user";
import { Error as MongooseError } from "mongoose";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user = req.body;

  try {
    const newUser = await User.create(user);
    const token = newUser.generateToken();
    console.log({ token });

    res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
        maxAge: 3600000,
      })
      .json(newUser);
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      const errors = transformError(error);
      next(new BadRequestError(errors[0].message));
      return;
    }

    if ((error as Error).message.startsWith("E11000")) {
      next(new ConflictError("Email should be unique"));
      return;
    }

    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findByCredentials(email, password);
    const token = user.generateToken();

    res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
        maxAge: 3600000,
      })
      .json(user);
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.clearCookie("access_token").send("Logout successful");
};
