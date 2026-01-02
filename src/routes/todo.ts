import { Router } from "express";

import { createTodo, getAllTodos, removeTodoById } from "../controllers/todo";

const router = Router();

router.get("/todos", getAllTodos);
router.post("/todos", createTodo);
router.delete("/todos/:id", removeTodoById);

export default router;
