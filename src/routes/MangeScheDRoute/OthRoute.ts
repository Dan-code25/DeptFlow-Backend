import express from "express";
import { createOtherFaculty, createOtherRoom, getOtherFaculty, getOtherRooms} from "../../controllers/ManageSchedControler/OthController.ts";

const router = express.Router();

router.post("/other-faculty", createOtherFaculty);
router.post("/other-rooms", createOtherRoom);

router.get("/other-faculty", getOtherFaculty);
router.get("/other-rooms", getOtherRooms);  

export default router;