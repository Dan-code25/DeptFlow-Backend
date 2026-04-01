import { Router } from "express";
import * as authController from "../controllers/authController.ts";
import { authenticateToken } from "../middleware/authenticate.ts";

const router = Router();

router.post("/google", authController.googleAuth);

router.post("/logout", authController.logout);

router.get("/verify", authenticateToken, authController.verifyAuth);

export default router;
