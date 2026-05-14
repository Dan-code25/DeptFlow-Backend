import { Router } from "express";
import * as curriculumController from "../controllers/curriculumsController.js";


import { authenticateToken } from "../middleware/authenticate.js";

const router = Router();
router.get("/ping", (req, res) => {
  res.send("The curriculum router is successfully connected!");
});
// Example router setup
router.get("/", authenticateToken, curriculumController.getAllCurriculums);
router.post("/", authenticateToken, curriculumController.addCurriculum);
router.put("/:program", authenticateToken  , curriculumController.editCurriculum);
router.delete("/:program", authenticateToken, curriculumController.removeCurriculum);

export default router;
