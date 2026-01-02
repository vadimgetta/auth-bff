import { NextFunction, Request, Response } from "express";
import NotFoundError from "../errors/not-found-error";
import User from "../models/user";

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
