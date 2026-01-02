import { NextFunction, Request, Response } from "express";

import Todo from "../models/todo";
import NotFoundError from "../errors/not-found-error";
import { Error as MongooseError } from "mongoose";
import ForbiddenError from "../errors/forbidden-error";

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const todo = req.body;

  const { id: userId } = res.locals.user;

  todo.owner = userId;

  try {
    const newTodo = await Todo.create(todo);

    res.status(201).send(newTodo);
  } catch (error) {
    next(error);
  }
};

export const getAllTodos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const { id: userId } = res.locals.user;

  try {
    const totalDocs = await Todo.countDocuments({ owner: userId });
    const totalPages = Math.ceil(totalDocs / limit);

    const todos = await Todo.find({ owner: userId })
      .populate("owner")
      .limit(limit)
      .skip((page - 1) * limit);

    res.send({ todos, currentPage: page, totalPages });
  } catch (error) {
    next(error);
  }
};

export const removeTodoById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const { id: userId } = res.locals.user;

  try {
    const todo = await Todo.findById(id).orFail(
      () => new NotFoundError("Todo does not exist!"),
    );
    if (todo.owner.toString() !== userId) {
      return next(new ForbiddenError("Access denied!"));
    }
    // await Todo.deleteOne({ _id: id, owner: userId }).orFail(
    //   () => new NotFoundError("Todo does not user!"),
    // );
    await Todo.findByIdAndDelete(id);
    return res.send({ message: "Todo deleted" });
  } catch (error) {
    // if (error instanceof MongooseError.DocumentNotFoundError) {
    //   return next(new NotFoundError("Todo does not exist!"));
    // }
    next(error);
  }
};
