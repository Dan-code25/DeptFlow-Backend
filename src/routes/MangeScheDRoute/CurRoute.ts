import { Router } from "express";
import * as CurriculumController from "../../controllers/ManageSchedControler/CurController.ts";
import { authenticateToken } from "../../middleware/authenticate.ts";

const router = Router();

router.get("/", authenticateToken, CurriculumController.getAllCurriculums);
router.get("/:id", authenticateToken, CurriculumController.getCurriculumById);

export default router;