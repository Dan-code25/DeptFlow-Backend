import { Router } from "express";
import * as authController from "../controllers/authController.ts";

const router = Router();

router.post("/google", authController.googleAuth);

export default router;
