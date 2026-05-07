import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.ts";
import { CurriculumModel } from "../../models/ManagScheModel/MScurriculum.ts";

export const getAllCurriculums = async (req: AuthRequest, res: Response) => {
  try {
    const data = await CurriculumModel.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetching curriculums error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCurriculumById = async (
  req: AuthRequest & { params: { id: string } },
  res: Response
) => {
  try {
    const curriculumId = req.params.id;
    const data = await CurriculumModel.getById(curriculumId);
    
    if (!data) {
      return res.status(404).json({ error: "Curriculum not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Fetching curriculum by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
