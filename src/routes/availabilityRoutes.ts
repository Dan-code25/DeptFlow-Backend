import { Router } from "express";
import * as AvailabilityController from "../controllers/availabilityController.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = Router();

router.post("/save", authenticateToken, AvailabilityController.saveAvailability);

router.get("/get", authenticateToken, AvailabilityController.getMyAvailability);


export default router;