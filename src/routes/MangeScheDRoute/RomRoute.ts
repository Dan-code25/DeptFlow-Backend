import { Router } from "express";
import * as RoomController from "../../controllers/ManageSchedControler/RmController.js";
import { authenticateToken } from "../../middleware/authenticate.js";

const router = Router();

router.get("/", authenticateToken, RoomController.getAllRooms);
router.get("/:id", authenticateToken, RoomController.getRoomById);

export default router;