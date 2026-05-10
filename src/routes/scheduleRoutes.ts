import { Router } from "express";
import * as scheduleController from "../controllers/schedulecontroller.ts";
import { authenticateToken } from "../middleware/authenticate.ts";

const router = Router();

// More specific routes FIRST
// Gemini context endpoint
router.get("/gemini-context", authenticateToken, scheduleController.getGeminiContext);

// My own schedule (faculty token)
router.get("/my", authenticateToken, scheduleController.getMySchedules);

// By faculty id
router.get("/faculty/:facultyId", authenticateToken, scheduleController.getSchedulesByFaculty);

router.get("/my-schedule", authenticateToken, scheduleController.getFacultyScheduleById);

// Then generic routes
// Admin — all schedules (optional ?periodId query param)
router.get("/", authenticateToken, scheduleController.getAllSchedules);

// Single schedule (most generic, goes last)
router.get("/:scheduleId", authenticateToken, scheduleController.getScheduleById);

router.post("/", authenticateToken, scheduleController.addSchedule);
router.patch("/:scheduleId", authenticateToken, scheduleController.editSchedule);
router.delete("/:scheduleId", authenticateToken, scheduleController.removeSchedule);

router.post("/", authenticateToken, scheduleController.addSchedule);
router.patch("/:scheduleId", authenticateToken, scheduleController.editSchedule);

export default router;
 