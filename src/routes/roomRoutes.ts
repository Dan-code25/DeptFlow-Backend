import { Router } from "express";
import * as roomController from "../controllers/roomcontroller.js";
import { authenticateToken } from "../middleware/authenticate.js";
 
const router = Router();
 
router.get("/", authenticateToken, roomController.getAllRooms);
router.get("/:roomId", authenticateToken, roomController.getRoomById);
router.post("/", authenticateToken, roomController.addRoom);
router.patch("/:roomId", authenticateToken, roomController.editRoom);
router.delete("/:roomId", authenticateToken, roomController.removeRoom);
 
export default router;