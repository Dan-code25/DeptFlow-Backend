import { Router } from "express";
import * as FacultyController from "../../controllers/ManageSchedControler/FacController.js";
import { authenticateToken } from "../../middleware/authenticate.js";

const router = Router();

router.get("/", authenticateToken, FacultyController.getAllFaculty);
router.get("/:id", authenticateToken, FacultyController.getFacultyById);

export default router;