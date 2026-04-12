import { Router } from "express";
import * as SubjectsController from "../controllers/subjectsController.ts";
import { authenticateToken } from "../middleware/authenticate.ts";

const router = Router();


router.get("/get", authenticateToken, SubjectsController.getSubjects);

export default router;