import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.ts";
import * as Curriculums from "../models/curriculums.ts";
import { CurriculumModel } from "../models/ManagScheModel/MScurriculum.ts";

export const getAllCurriculums = async (req: AuthRequest, res: Response) => {
  try {
    const curriculums = await Curriculums.fetchAllCurriculums();
    res.status(200).json(curriculums);
  } catch (error: any) {
    console.error("Fetching curriculums error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
};

export const getCurriculumByProgram = async (
  req: AuthRequest & { params: { program: string } },
  res: Response
) => {
  try {
    const { program } = req.params;
    const curriculum = await Curriculums.fetchCurriculumByProgram(program);
    res.status(200).json(curriculum);
  } catch (error: any) {
    console.error("Fetching curriculum error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
};

export const addCurriculum = async (req: AuthRequest, res: Response) => {
  try {
    const curriculumData = req.body;
    
    // Validate required fields
    if (!curriculumData.program) {
      return res.status(400).json({ error: "Missing required field: program" });
    }
    
    if (!curriculumData.sections || !Array.isArray(curriculumData.sections)) {
      return res.status(400).json({ error: "Missing required field: sections (must be an array)" });
    }
    
    // Expecting payload: { "program": "BSCS", "sections": [...] }
    const result = await Curriculums.createCurriculum(curriculumData);
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Creating curriculum error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
};

export const editCurriculum = async (
  req: AuthRequest & { params: { program: string } },
  res: Response
) => {
  try {
    const { program } = req.params;
    const curriculumData = req.body;
    const result = await Curriculums.updateCurriculum(program, curriculumData);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Updating curriculum error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
};

export const removeCurriculum = async (
  req: AuthRequest & { params: { program: string } },
  res: Response
) => {
  try {
    const { program } = req.params;
    await Curriculums.deleteCurriculum(program);
    res.status(200).json({ message: "Curriculum deleted successfully" });
  } catch (error: any) {
    console.error("Deleting curriculum error:", error?.message || error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
};

export const setupCurriculumSections = async (req: Request, res: Response) => {
  try {
    const { schoolYear, semester, counts } = req.body;

    // Basic validation
    if (!schoolYear || !semester || !counts) {
      return res.status(400).json({ error: "Missing required fields: schoolYear, semester, or counts." });
    }

    // Pass the schoolYear into our updated model
    await CurriculumModel.setupSections(schoolYear, semester, counts);

    // Send success response
    res.status(200).json({ message: "Sections generated successfully!" });

  } catch (error: any) {
    console.error("Setup Sections Error:", error);
    const status = error.message === "No valid sections generated from the provided counts." ? 400 : 500;
    res.status(status).json({ error: error.message || "Failed to setup sections" });
  }
};