import { Router } from "express";
import * as educationController from "../controllers/educationController.ts";
import { authenticateToken } from "../middleware/authenticate.ts";

const router = Router();

router.post("/add", authenticateToken, educationController.addEducation);

router.get("/get-education", authenticateToken, educationController.getEducation);

router.delete("/delete/:educationId", authenticateToken, educationController.deleteEducation);

export default router;