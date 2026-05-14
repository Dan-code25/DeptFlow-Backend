import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.js";
import { SubjectModel } from "../../models/ManagScheModel/MSsubject.js";

export const getAllSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const data = await SubjectModel.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetching subjects error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubjectById = async (
  req: AuthRequest & { params: { id: string } },
  res: Response
) => {
  try {
    const subjectId = req.params.id;
    const data = await SubjectModel.getById(subjectId);
    
    if (!data) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Fetching subject by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};