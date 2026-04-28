import { Router } from "express";
import * as RoomController from "../../controllers/ManageSchedControler/RmController.ts";
import { authenticateToken } from "../../middleware/authenticate.ts";

const router = Router();

router.get("/", authenticateToken, RoomController.getAllRooms);
router.get("/:id", authenticateToken, RoomController.getRoomById);

export default router;