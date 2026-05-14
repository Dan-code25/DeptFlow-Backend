import type { Response, Request } from "express";
import type { AuthRequest } from "../middleware/authenticate.js";
import * as Education from "../models/education.js";


export const addEducation = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    const { degreeLevel, degreeType, major, university, yearGraduated } = req.body;

    if (!facultyId) return res.status(400).json({ error: "Faculty ID is missing in token." });

    const educationData = await Education.addEducation(facultyId, {
      degreeLevel,
      degreeType,
      major,
      university,
      yearGraduated
    });

    res.status(201).json(educationData);

  } catch (error) {
    console.error("Error adding education record:", error);
    res.status(500).json({ error: "Failed to add education record." });
  }
};

export const getEducation = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;

    if (!facultyId) return res.status(400).json({ error: "Faculty ID is missing in token." });

    const educationData = await Education.getEducationById(facultyId); 
    res.status(200).json(educationData);

  } catch (error) {
    console.error("Error fetching education record:", error);
    res.status(500).json({ error: "Failed to fetch education record." });
  }
};

type Params = {
  educationId: string;
}

export const deleteEducation = async (req: AuthRequest & { params: Params }, res: Response) => {
  try {
    const educationId = req.params.educationId;
    console.log(educationId);
    if (!educationId) return res.status(400).json({ error: "Education ID is missing in request parameters." });

    await Education.deleteEducationById(educationId);
    res.status(200).json({ message: "Education record deleted successfully." });

  } catch (error) {
    console.error("Error deleting education record:", error);
    res.status(500).json({ error: "Failed to delete education record." });
  }
};
