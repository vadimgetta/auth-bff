import { Router } from "express";
import { createUser, loginUser, logoutUser } from "../controllers/auth";

const router = Router();

router.post("/signup", createUser);
router.post("/signin", loginUser);
router.post("/logout", logoutUser);

export default router;
