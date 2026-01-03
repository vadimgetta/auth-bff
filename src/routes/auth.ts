import { Router } from "express";
import { createUser, loginUser, logoutUser } from "../controllers/auth";

const router = Router();

router.post("/sign-up", createUser);
router.post("/sign-in", loginUser);
router.post("/logout", logoutUser);

export default router;
