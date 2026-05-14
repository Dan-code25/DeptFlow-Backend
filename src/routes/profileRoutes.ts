import { Router } from "express";
import multer from "multer";
import * as profileController from "../controllers/profileController.js";
import { authenticateToken } from "../middleware/authenticate.js";

const router = Router();
const upload = multer({storage: multer.memoryStorage()}); 

router.patch("/update/personal-info", authenticateToken ,profileController.updatePersonalInfo);

router.post("/profile-picture", authenticateToken, upload.single("profilePicture"), profileController.updateProfilePhoto);

router.get("/personal-info", authenticateToken, profileController.getPersonalInfo);

router.get("/profile-picture", authenticateToken, profileController.getProfilePhoto);

export default router;
