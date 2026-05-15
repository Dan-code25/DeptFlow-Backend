import { Router } from "express";
import * as FacultyController from "../controllers/facultyController.js";
import * as AvailabilityController from "../controllers/availabilityController.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = Router();

router.get("/all", FacultyController.getFacultyDashboard);

router.get("/profile-picture/:facultyId", FacultyController.fetchFacultyProfilePicture);

router.get("/profile/:facultyId", FacultyController.fetchFacultyProfile);

router.get("/education/faculty/:facultyId", FacultyController.fetchFacultyEducation);

router.get("/credentials/faculty/:facultyId", FacultyController.getFacultyCredentials);

router.get("/research/faculty/:facultyId", FacultyController.getFacultyResearch);

router.get("/load-units/:facultyId", FacultyController.getFacultyLoadUnits);


router.post("/add-faculty", FacultyController.whitelistFaculty);

router.delete("/delete/:facultyId", FacultyController.deleteFaculty);

router.get(
  "/availability/faculty/:facultyId", authenticateToken,
  AvailabilityController.getFacultyAvailability,
);

export default router;