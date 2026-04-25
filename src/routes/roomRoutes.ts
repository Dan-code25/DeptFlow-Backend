import { Router } from "express";
import * as roomController from "../controllers/roomcontroller.ts";
import { authenticateToken } from "../middleware/authenticate.ts";
 
const router = Router();
 
router.get("/", authenticateToken, roomController.getAllRooms);
router.get("/:roomId", authenticateToken, roomController.getRoomById);
router.post("/", authenticateToken, roomController.addRoom);
router.patch("/:roomId", authenticateToken, roomController.editRoom);
router.delete("/:roomId", authenticateToken, roomController.removeRoom);
 
export default router;