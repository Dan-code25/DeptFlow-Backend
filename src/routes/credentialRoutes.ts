import { Router } from "express";
import multer from "multer";
import * as credentialController from "../controllers/credentialController.js";
import { authenticateToken } from "../middleware/authenticate.js";
  
const router = Router();

// get route
router.get("/get-credentials", authenticateToken, credentialController.getAllCredentials);

// post routes
router.post("/add-certification", authenticateToken, credentialController.addCertification); 

router.post("/add-license", authenticateToken, credentialController.addLicense);

router.post("/add-seminar", authenticateToken, credentialController.addSeminar);

router.post("/add-work-experience", authenticateToken, credentialController.addWorkExperience);

// delete routes
router.delete("/certificate/delete/:certificationId", authenticateToken, credentialController.deleteCertification);

router.delete("/license/delete/:licenseId", authenticateToken, credentialController.deleteLicense);

router.delete("/seminar/delete/:seminarId", authenticateToken, credentialController.deleteSeminar);

router.delete("/work-experience/delete/:workExperienceId", authenticateToken, credentialController.deleteWorkExperience);

export default router;