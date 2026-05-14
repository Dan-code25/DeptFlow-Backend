import { Router } from "express";
import * as periodController from "../controllers/Academicperiodcontroller.js";
import { authenticateToken } from "../middleware/authenticate.js";
 
const router = Router();
 
router.get("/", authenticateToken, periodController.getAllPeriods);
router.get("/current", authenticateToken, periodController.getCurrentPeriod);
router.post("/", authenticateToken, periodController.addPeriod);
router.patch("/:periodId/activate", authenticateToken, periodController.activatePeriod);
 
export default router;