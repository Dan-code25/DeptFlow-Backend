import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.js";
import * as Subjects from "../models/subjects.js";

export const getSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const subjects = await Subjects.fetchSubjects();

    console.log("Subjects:", subjects);
    res.status(200).json(subjects);
  } catch (error) {
    console.log("Fetching Subjects Error:", error);
    res.status(500).json({ error: "Failed to fetch subjects." });
  }

}


export const getAllSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const subjects = await Subjects.fetchAllSubjects();
    res.status(200).json(subjects);
  } catch (error) {
    console.error("Fetching subjects error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSubjectByCode = async (
  req: AuthRequest & { params: { subjectCode: string } },
  res: Response
) => {
  try {
    const { subjectCode } = req.params;
    const subject = await Subjects.fetchSubjectByCode(subjectCode);
    res.status(200).json(subject);
  } catch (error) {
    console.error("Fetching subject error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addSubject = async (req: AuthRequest, res: Response) => {
  try {
    const subjectData = req.body;
    const result = await Subjects.createSubject(subjectData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Creating subject error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const editSubject = async (
  req: AuthRequest & { params: { subjectCode: string } },
  res: Response
) => {
  try {
    const { subjectCode } = req.params;
    const subjectData = req.body;
    const result = await Subjects.updateSubject(subjectCode, subjectData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Updating subject error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeSubject = async (
  req: AuthRequest & { params: { subjectCode: string } },
  res: Response
) => {
  try {
    const { subjectCode } = req.params;
    await Subjects.deleteSubject(subjectCode);
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Deleting subject error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
  
};

export const getSubjectCount = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Getting subject count...");
    const count = await Subjects.countSubjects();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Fetching subject count error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

