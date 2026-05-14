import { Router } from "express";
import * as SchedController from "../../controllers/ManageSchedControler/SchController.js";
import { authenticateToken } from "../../middleware/authenticate.js";

const router = Router();

router.get("/", authenticateToken, SchedController.getAllSchedules);
router.post("/", authenticateToken, SchedController.createSchedule);
router.put("/:id", authenticateToken, SchedController.updateSchedule);
router.patch("/:id", authenticateToken, SchedController.updateSchedule);
router.delete("/:id", authenticateToken, SchedController.deleteSchedule);

export default router;