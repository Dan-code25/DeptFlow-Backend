import { Router } from "express";
import * as CurriculumController from "../../controllers/ManageSchedControler/CurController.js";
import { authenticateToken } from "../../middleware/authenticate.js";
import { setupCurriculumSections } from "../../controllers/curriculumsController.js";

const router = Router();

router.post("/setup-sections", setupCurriculumSections);
router.get("/", authenticateToken, CurriculumController.getAllCurriculums);
router.get("/:id", authenticateToken, CurriculumController.getCurriculumById);

export default router;