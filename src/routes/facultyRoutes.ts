import { Router } from "express";
import * as FacultyController from "../controllers/facultyController.ts";

const router = Router();

router.get("/all", FacultyController.getFacultyDashboard);

router.get("/profile-picture/:facultyId", FacultyController.fetchFacultyProfilePicture);

router.get("/profile/:facultyId", FacultyController.fetchFacultyProfile);

router.get("/education/faculty/:facultyId", FacultyController.fetchFacultyEducation);

router.get("/credentials/faculty/:facultyId", FacultyController.getFacultyCredentials);

router.get("/research/faculty/:facultyId", FacultyController.getFacultyResearch);


router.post("/add-faculty", FacultyController.whitelistFaculty);

router.delete("/delete/:facultyId", FacultyController.deleteFaculty);

export default router;