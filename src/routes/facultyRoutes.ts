import { Router } from "express";
import * as FacultyController from "../controllers/facultyController.ts";

const router = Router();

router.get("/all", FacultyController.getFacultyDashboard);

router.post("/add-faculty", FacultyController.whitelistFaculty);

router.delete("/delete/:facultyId", FacultyController.deleteFaculty);

export default router;