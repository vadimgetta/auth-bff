import { Router } from "express";

import {
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/user";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id", updateUserById);
router.delete("/users/:id", deleteUserById);

export default router;
