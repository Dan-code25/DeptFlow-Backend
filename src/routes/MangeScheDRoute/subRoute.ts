import { Router } from "express";
import * as SubController from "../../controllers/ManageSchedControler/SubController.js";
import { authenticateToken } from "../../middleware/authenticate.js";

const router = Router();

router.get("/", authenticateToken, SubController.getAllSubjects);
router.get("/:id", authenticateToken, SubController.getSubjectById);

export default router;