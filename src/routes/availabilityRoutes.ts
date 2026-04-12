import { Router } from "express";
import * as AvailabilityController from "../controllers/availabilityController.ts";
import { authenticateToken } from "../middleware/authenticate.ts";

const router = Router();

router.post("/save", authenticateToken, AvailabilityController.saveAvailability);

router.get("/get", authenticateToken, AvailabilityController.getMyAvailability);


export default router;