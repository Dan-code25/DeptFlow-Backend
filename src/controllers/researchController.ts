import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.js";
import * as Research from "../models/research.js";

type Params <T extends string> = {
  [K in T]: string;
};

type ResearchParams = Params<"researchId">;

export const getAllResearch = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const research = await Research.fetchAllResearch(facultyId);
    res.status(200).json(research);

  } catch (error) {
    console.log("Fetching research error:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
}

export const addResearch = async (req: AuthRequest, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });
    const researchData = req.body;

    const newResearch = await Research.createResearch(facultyId, researchData);
    res.status(201).json(newResearch);
  } catch (error) {
    console.log("Adding research error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteResearch = async (req: AuthRequest & { params: ResearchParams }, res: Response) => {
  try {
    const facultyId = req.user?.id;
    if (!facultyId) return res.status(401).json({ error: "Unauthorized" });

    const researchId = req.params.researchId;
    
    const result = await Research.deleteResearch(researchId);
    res.status(200).json(result);

  } catch (error) {
    console.log("Deleting research error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}