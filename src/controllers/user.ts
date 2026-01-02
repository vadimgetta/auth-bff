import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";

import BadRequestError from "../errors/bad-request-error";
import ConflictError from "../errors/conflict-error";
import NotFoundError from "../errors/not-found-error";
import { transformError } from "../helpers/transform-error";
import User from "../models/user";

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

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find().sort({ createdAt: -1, email: 1 });

    res.send(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).orFail(
      () => new NotFoundError("User does not exist!"),
    );

    res.send(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id).orFail(
      () => new NotFoundError("User does not exist!"),
    );

    res.send({ id });
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const user = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    }).orFail(() => new NotFoundError("User does not exist!"));

    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
};
