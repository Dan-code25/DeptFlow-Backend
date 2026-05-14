import type { Response } from "express";
import type { AuthRequest } from "../../middleware/authenticate.js";
import * as Faculty from "../../models/ManagScheModel/MSfaculty.js";

export const getAllFaculty = async (req: AuthRequest, res: Response) => {
  try {
    const data = await Faculty.getAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Fetching faculty error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFacultyById = async (
  req: AuthRequest & { params: { id: string } },
  res: Response
) => {
  try {
    const facultyId = req.params.id;
    const data = await Faculty.getById(facultyId);
    
    if (!data) {
      return res.status(404).json({ error: "Faculty not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Fetching faculty by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};