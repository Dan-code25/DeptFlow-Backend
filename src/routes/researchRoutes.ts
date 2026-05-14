import { Router } from "express";
import * as researchController from "../controllers/researchController.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = Router();

router.get("/get-research", authenticateToken, researchController.getAllResearch);

router.post("/add-research", authenticateToken, researchController.addResearch);

router.delete("/delete/research/:researchId", authenticateToken, researchController.deleteResearch);

export default router;