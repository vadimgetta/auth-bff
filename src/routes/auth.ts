import { Router } from "express";
import { createUser } from "../controllers/user";

const router = Router();

router.post("/signup", createUser);
router.post("/signin");

export default router;
