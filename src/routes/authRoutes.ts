import { Router } from "express";
import * as authController from "../controllers/authController.js";

const router = Router();

router.post("/google", authController.googleAuth);

export default router;
