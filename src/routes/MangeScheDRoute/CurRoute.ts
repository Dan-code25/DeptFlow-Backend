import { Router } from "express";
import * as CurriculumController from "../../controllers/ManageSchedControler/CurController.ts";
import { authenticateToken } from "../../middleware/authenticate.ts";
import { setupCurriculumSections } from "../../controllers/curriculumsController.ts";

const router = Router();

router.post("/setup-sections", setupCurriculumSections);
router.get("/", authenticateToken, CurriculumController.getAllCurriculums);
router.get("/:id", authenticateToken, CurriculumController.getCurriculumById);

export default router;