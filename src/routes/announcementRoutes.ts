import { Router } from "express";
import multer from "multer";
import * as announcementController from "../controllers/announcementController.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = Router();
const upload = multer({storage: multer.memoryStorage()});

router.get("/get-announcements", authenticateToken, announcementController.getAllAnnouncements);

router.post("/add-announcement", authenticateToken, upload.array("files"), announcementController.addAnnouncement);

router.delete("/delete/:announcementId", authenticateToken, announcementController.deleteAnnouncement);

router.patch("/edit/:announcementId", authenticateToken, upload.array("files"), announcementController.editAnnouncement);


export default router;