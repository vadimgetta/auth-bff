import { NextFunction, Request, Response } from "express";

import Todo from "../models/todo";
import NotFoundError from "../errors/not-found-error";

export const createTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const todo = req.body;

  todo.owner = "680cab4c76b59ccf2b3203e3";

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

  try {
    const totalDocs = await Todo.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    const todos = await Todo.find()
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

  try {
    await Todo.findByIdAndDelete(id).orFail(
      () => new NotFoundError("Todo does not exist!"),
    );
  } catch (error) {
    next(error);
  }
};
