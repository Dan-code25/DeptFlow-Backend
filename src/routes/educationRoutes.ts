import { Router } from "express";
import * as educationController from "../controllers/educationController.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = Router();

router.post("/add", authenticateToken, educationController.addEducation);

router.get("/get-education", authenticateToken, educationController.getEducation);

router.delete("/delete/:educationId", authenticateToken, educationController.deleteEducation);

export default router;