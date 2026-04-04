import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.ts";
import * as Faculty from "../models/profile.ts";


export const getFacultyDashboard = async (req: AuthRequest, res: Response) => {
  try {
    // const facultyId = req.user?.id;
    // if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const facultyProfile = await Faculty.fetchAllFacultyProfiles();
    res.status(200).json(facultyProfile);

  } catch (error) {
    console.log("Fetching faculty error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


export const whitelistFaculty = async (req: AuthRequest, res: Response) => {
  try {
    // const facultyId = req.user?.id;
    // if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const facultyData = req.body;
    console.log("FACULTY DATA:", facultyData)
    const result = await Faculty.addNewFaculty(facultyData);
    res.status(201).json(result);
    
  } catch (error) {
    console.log("Adding new faculty error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteFaculty = async (req: AuthRequest & { params: { facultyId: string } }, res: Response) => {
  try {
    // const facultyId = req.user?.id;
    // if (!facultyId) return res.status(401).json({ error: "Unauthorized" });
    
    const { facultyId } = req.params;
    await Faculty.deleteFaculty(facultyId);
    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    console.log("Deleting faculty error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
