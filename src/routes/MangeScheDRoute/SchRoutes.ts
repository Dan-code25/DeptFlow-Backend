import { Router } from "express";
import * as SchedController from "../../controllers/ManageSchedControler/SchController.ts";
import { authenticateToken } from "../../middleware/authenticate.ts";

const router = Router();

router.get("/", authenticateToken, SchedController.getAllSchedules);
router.post("/", authenticateToken, SchedController.createSchedule);
router.put("/:id", authenticateToken, SchedController.updateSchedule);
router.delete("/:id", authenticateToken, SchedController.deleteSchedule);

export default router;