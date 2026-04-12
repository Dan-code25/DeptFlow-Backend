import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authenticate.ts";
import * as Subjects from "../models/subjects.ts";

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