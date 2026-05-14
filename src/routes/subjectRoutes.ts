import { Router } from "express";
import * as SubjectsController from "../controllers/subjectsController.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = Router();


router.get("/count", authenticateToken, SubjectsController.getSubjectCount);
router.get("/get", authenticateToken, SubjectsController.getSubjects);
router.get("/:subjectCode", authenticateToken, SubjectsController.getSubjectByCode);
router.get("/", authenticateToken, SubjectsController.getAllSubjects);

router.post("/", authenticateToken, SubjectsController.addSubject);
router.patch("/:subjectCode", authenticateToken, SubjectsController.editSubject);
router.delete("/:subjectCode", authenticateToken, SubjectsController.removeSubject);

export default router;