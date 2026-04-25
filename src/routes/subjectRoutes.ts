import { Router } from "express";
import * as SubjectsController from "../controllers/subjectsController.ts";
import { authenticateToken } from "../middleware/authenticate.ts";

const router = Router();


router.get("/get", authenticateToken, SubjectsController.getSubjects);
router.get("/", authenticateToken, SubjectsController.getAllSubjects);
router.get("/:subjectCode", authenticateToken, SubjectsController.getSubjectByCode);
router.post("/", authenticateToken, SubjectsController.addSubject);
router.patch("/:subjectCode", authenticateToken, SubjectsController.editSubject);
router.delete("/:subjectCode", authenticateToken, SubjectsController.removeSubject);

export default router;